import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, User } from "lucide-react";
import NotificationPreferences from "@/components/espace/NotificationPreferences";

export const metadata: Metadata = {
  title: "Paramètres | Espace apprenant — Inspire & Impact",
};

export default function ParametresPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-medium text-espresso-900">Paramètres</h1>

      <div className="rounded-2xl border border-espresso-900/10 bg-white p-6">
        <h2 className="font-medium text-espresso-900">Notifications</h2>
        <p className="mt-2 text-sm text-espresso-500">
          Choisissez les courriels que vous souhaitez recevoir de notre part.
        </p>
        <NotificationPreferences />
      </div>

      <div className="rounded-2xl border border-espresso-900/10 bg-white p-6">
        <h2 className="font-medium text-espresso-900">Compte</h2>
        <p className="mt-2 text-sm text-espresso-500">
          Gérez vos informations personnelles et votre abonnement.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/espace/profil"
            className="inline-flex items-center gap-2 rounded-full border border-espresso-900/15 px-5 py-2.5 text-sm font-medium text-espresso-700 no-underline transition-colors hover:border-accent/40 hover:text-accent"
          >
            <User className="h-4 w-4" />
            Mon profil
          </Link>
          <Link
            href="/espace/abonnement"
            className="inline-flex items-center gap-2 rounded-full border border-espresso-900/15 px-5 py-2.5 text-sm font-medium text-espresso-700 no-underline transition-colors hover:border-accent/40 hover:text-accent"
          >
            <CreditCard className="h-4 w-4" />
            Abonnement
          </Link>
        </div>
      </div>
    </div>
  );
}
