import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/demo";
import EspaceNav from "@/components/espace/EspaceNav";
import EspaceContent from "@/components/espace/EspaceContent";
import EspaceTopBar from "@/components/espace/EspaceTopBar";
import { AdminNavProvider } from "@/components/admin/AdminNavContext";

/*
  Layout du groupe /espace (dashboard apprenant). Réservé aux comptes de
  rôle "learner" ; un admin/éditeur qui atterrit ici est renvoyé vers son
  propre panel. Même structure rail+topbar que /admin : le rail (EspaceNav)
  partage l'état d'expansion via AdminNavContext, et EspaceContent réserve
  sa marge gauche en miroir, exactement comme dans le panel admin.
*/
export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const demoMode = !isSupabaseConfigured();
  const profile = await getCurrentProfile();

  if (!profile) redirect(demoMode ? "/demo" : "/login?mode=login");
  if (profile.role !== "learner") redirect("/admin");

  return (
    <div className="h-svh overflow-hidden bg-cream-50">
      <AdminNavProvider>
        <EspaceNav fullName={profile.full_name} demoMode={demoMode} />
        <EspaceContent>
          <EspaceTopBar fullName={profile.full_name} demoMode={demoMode} />
          <div className="mt-6">{children}</div>
        </EspaceContent>
      </AdminNavProvider>
    </div>
  );
}
