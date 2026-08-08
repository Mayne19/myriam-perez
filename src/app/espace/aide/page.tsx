import Link from "next/link";
import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Aide | Espace apprenant — Inspire & Impact",
};

export default function AidePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link href="/espace" className="text-sm font-medium text-espresso-400 no-underline hover:text-accent">
        ← Retour
      </Link>
      <h1 className="text-2xl font-medium text-espresso-900">Aide &amp; support</h1>

      <div className="rounded-2xl border border-espresso-900/10 bg-white p-6">
        <h2 className="font-medium text-espresso-900">Besoin d&apos;aide ?</h2>
        <p className="mt-2 text-sm text-espresso-500">
          Notre équipe vous répond par courriel pour toute question sur le programme, l&apos;accès à votre contenu ou votre
          abonnement.
        </p>
        <a
          href="mailto:info@myriamperez.ca"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-espresso-900/15 px-5 py-2.5 text-sm font-medium text-espresso-700 no-underline transition-colors hover:border-accent/40 hover:text-accent"
        >
          <Mail className="h-4 w-4" />
          info@myriamperez.ca
        </a>
      </div>
    </div>
  );
}
