import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

/*
  Création d'une session Stripe Checkout selon l'option choisie dans le panneau.

  Variables d'environnement requises (à placer dans .env.local) :
    STRIPE_SECRET_KEY        clé secrète du compte Stripe
    NEXT_PUBLIC_SITE_URL     URL du site, pour les pages de retour

  Klarna et le paiement en plusieurs fois doivent aussi être activés dans le
  tableau de bord Stripe (Paramètres → Moyens de paiement).

  L'identifiant du compte à activer (voir /api/webhooks/stripe) est relu ici
  depuis la session Supabase du cookie de la requête — jamais depuis un
  champ envoyé par le client, qui pourrait être falsifié pour activer le
  compte de quelqu'un d'autre.
*/

// Montants en cents, dans la devise du compte (CAD).
const PRICES = {
  full: { label: "Programme complet de formation de formateurs certifiés", amount: 499500 },
  installments: { label: "Programme complet — 1er versement sur 5", amount: 114860 },
  klarna: { label: "Programme complet de formation de formateurs certifiés", amount: 499500 },
} as const;

type OptionId = keyof typeof PRICES;

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Le paiement n'est pas encore configuré. La clé Stripe est manquante." },
      { status: 500 },
    );
  }

  let option: OptionId;
  try {
    const body = await request.json();
    option = body.option;
    if (!(option in PRICES)) {
      return NextResponse.json({ error: "Option de paiement inconnue." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Source de vérité unique : la session authentifiée, jamais un id fourni par le client.
  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {
    // Supabase pas encore configuré : le paiement continue sans compte lié.
  }

  const stripe = new Stripe(secretKey);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const price = PRICES[option];

  // Klarna est proposé en plus de la carte lorsque l'option est choisie.
  const methods: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
    option === "klarna" ? ["card", "klarna"] : ["card"];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: methods,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: price.amount,
            product_data: { name: price.label },
          },
        },
      ],
      success_url: `${site}/programme?paiement=succes`,
      cancel_url: `${site}/programme?paiement=annule`,
      // `client_reference_id` est repris par le webhook pour activer le
      // compte Supabase correspondant une fois le paiement confirmé.
      client_reference_id: userId,
      metadata: { option, ...(userId ? { user_id: userId } : {}) },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe n'a pas renvoyé d'adresse de paiement." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inattendue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
