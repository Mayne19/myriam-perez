import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/demo";
import ProfileForm from "@/components/espace/ProfileForm";
import ProfileHeader from "@/components/espace/ProfileHeader";
import PersonalDetails from "@/components/espace/PersonalDetails";
import NameForm from "@/components/espace/NameForm";

export const metadata: Metadata = {
  title: "Profil | Espace apprenant — Inspire & Impact",
};

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-espresso-500">
        <Link href="/espace" className="no-underline hover:text-accent">
          Espace apprenant
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-espresso-900">Profil</span>
      </nav>

      <ProfileHeader fullName={profile.full_name} email={profile.email} />

      <PersonalDetails fullName={profile.full_name} email={profile.email} status={profile.status} />

      <NameForm initialFullName={profile.full_name} />

      <div>
        <h2 className="mb-3 font-medium text-espresso-900">Sécurité</h2>
        <ProfileForm demoMode={!isSupabaseConfigured()} />
      </div>
    </div>
  );
}
