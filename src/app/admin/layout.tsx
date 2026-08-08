import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/demo";
import AdminNav from "@/components/admin/AdminNav";

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
        AdminNav flotte en "fixed" (voir le composant), détachée du bord ;
        `main` réserve sa marge + largeur repliée (16px + 64px + 16px de
        respiration) par défaut. La nav pose `peer/nav` sur elle-même : au
        survol, `main` grandit sa marge en miroir via `peer-hover/nav:ml-*`
        — les deux se partagent vraiment la largeur de la page, aucun des
        deux ne se contente de superposer l'autre.
      */}
      <AdminNav role={profile.role} fullName={profile.full_name} demoMode={demoMode} />
      <main className="ml-24 h-svh overflow-y-auto px-8 py-10 transition-[margin] duration-500 ease-in-out peer-hover/nav:ml-72">
        {children}
      </main>
    </div>
  );
}
