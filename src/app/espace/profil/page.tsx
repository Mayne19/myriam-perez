import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/demo";
import ProfileForm from "@/components/espace/ProfileForm";

export const metadata: Metadata = {
  title: "Profil | Espace apprenant — Inspire & Impact",
};

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <h1 className="text-2xl font-medium text-espresso-900">Profil</h1>

      <ProfileForm initialFullName={profile.full_name} demoMode={!isSupabaseConfigured()} />

      <div className="rounded-2xl border border-espresso-900/10 bg-white p-6">
        <h2 className="font-medium text-espresso-900">Besoin d&apos;aide ?</h2>
        <p className="mt-2 text-sm text-espresso-500">
          Notre équipe vous répond par courriel pour toute question sur le programme ou l&apos;accès à votre contenu.
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
