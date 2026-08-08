import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Abonnement | Espace apprenant — Inspire & Impact",
};

export default async function AbonnementPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const active = profile.status === "active";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-medium text-espresso-900">Abonnement</h1>

      <div className="rounded-2xl border border-espresso-900/10 bg-white p-6">
        <p className="text-sm font-medium text-espresso-500">Statut</p>
        <span
          className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            active ? "bg-accent-bg text-accent-text" : "bg-amber-100 text-amber-700"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-amber-500"}`} />
          {active ? "Accès actif" : "En attente de confirmation"}
        </span>
      </div>

      <div className="rounded-2xl border border-espresso-900/10 bg-white p-6">
        <h2 className="font-medium text-espresso-900">Facturation</h2>
        <p className="mt-2 text-sm text-espresso-500">
          Pour toute question sur un paiement ou pour obtenir une facture, contactez-nous directement — nous nous en occupons
          personnellement.
        </p>
        <a
          href="mailto:info@myriamperez.ca"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-espresso-900/15 px-5 py-2.5 text-sm font-medium text-espresso-700 no-underline transition-colors hover:border-accent/40 hover:text-accent"
        >
          info@myriamperez.ca
        </a>
      </div>
    </div>
  );
}
