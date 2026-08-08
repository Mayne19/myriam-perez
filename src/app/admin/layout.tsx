import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/demo";
import AdminNav from "@/components/admin/AdminNav";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { AdminTopBarProvider } from "@/components/admin/AdminTopBarContext";

/*
  Layout du groupe /admin. Réservé aux rôles "admin" et "editor" — un
  apprenant qui atterrit ici est renvoyé vers son dashboard. La restriction
  plus fine (editor limité au blog) se fait page par page, voir
  /admin/apprenants et /admin/parametres.
*/
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const demoMode = !isSupabaseConfigured();
  const profile = await getCurrentProfile();

  if (!profile) redirect(demoMode ? "/demo" : "/login?mode=login");
  if (profile.role === "learner") redirect("/espace");

  return (
    <div className="h-svh overflow-hidden bg-cream-50">
      {/*
        AdminTopBar occupe la bande du haut sur toute la largeur ; AdminNav
        flotte en "fixed" juste sous elle (top-28, voir le composant) pour
        démarrer au même niveau que le contenu plutôt qu'en haut de la page.
        `main` réserve sa marge + largeur repliée (16px + 64px + 16px de
        respiration) par défaut. La nav pose `peer/nav` sur elle-même : au
        survol, `main` grandit sa marge en miroir via `peer-hover/nav:ml-*`
        — les deux se partagent vraiment la largeur de la page.
      */}
      <AdminTopBarProvider>
        <AdminNav role={profile.role} fullName={profile.full_name} demoMode={demoMode} />
        <main className="ml-24 h-svh overflow-y-auto px-8 py-6 transition-[margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-hover/nav:ml-64">
          <AdminTopBar fullName={profile.full_name} demoMode={demoMode} />
          <div className="mt-6">{children}</div>
        </main>
      </AdminTopBarProvider>
    </div>
  );
}
