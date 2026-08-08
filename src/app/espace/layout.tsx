import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/demo";
import EspaceNav from "@/components/espace/EspaceNav";

/*
  Layout du groupe /espace (dashboard apprenant). Réservé aux comptes de
  rôle "learner" ; un admin/éditeur qui atterrit ici est renvoyé vers son
  propre panel.
*/
export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const demoMode = !isSupabaseConfigured();
  const profile = await getCurrentProfile();

  if (!profile) redirect(demoMode ? "/demo" : "/login?mode=login");
  if (profile.role !== "learner") redirect("/admin");

  return (
    <div className="min-h-svh bg-cream-50">
      <EspaceNav fullName={profile.full_name} demoMode={demoMode} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
