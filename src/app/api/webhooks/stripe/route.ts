import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

/*
  Webhook Stripe — à déclarer dans le tableau de bord Stripe sur
  {NEXT_PUBLIC_SITE_URL}/api/webhooks/stripe, événement
  "checkout.session.completed".

  Variables d'environnement requises :
    STRIPE_SECRET_KEY
    STRIPE_WEBHOOK_SECRET
    NEXT_PUBLIC_SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY

  Une fois le paiement confirmé, passe le profil Supabase correspondant
  (client_reference_id = id utilisateur) au statut "active".
*/
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Webhook Stripe non configuré." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Signature invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id ?? session.metadata?.user_id;

    if (userId) {
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("profiles")
        .update({ status: "active", stripe_customer_id: session.customer as string | null })
        .eq("id", userId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
