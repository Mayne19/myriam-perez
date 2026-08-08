import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/demo";
import EspaceNav from "@/components/espace/EspaceNav";
import EspaceTopBar from "@/components/espace/EspaceTopBar";

/*
  Layout du groupe /espace (dashboard apprenant). Réservé aux comptes de
  rôle "learner" ; un admin/éditeur qui atterrit ici est renvoyé vers son
  propre panel. Même structure rail+topbar que /admin (voir ce layout),
  réduite aux sections de l'espace apprenant.
*/
export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const demoMode = !isSupabaseConfigured();
  const profile = await getCurrentProfile();

  if (!profile) redirect(demoMode ? "/demo" : "/login?mode=login");
  if (profile.role !== "learner") redirect("/admin");

  return (
    <div className="h-svh overflow-hidden bg-cream-50">
      <EspaceNav fullName={profile.full_name} demoMode={demoMode} />
      <main className="ml-[104px] h-svh overflow-y-auto px-8 py-6 transition-[margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-hover/nav:ml-[256px]">
        <EspaceTopBar fullName={profile.full_name} demoMode={demoMode} />
        <div className="mx-auto mt-6 max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
