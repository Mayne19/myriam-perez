import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/demo";
import AdminNav from "@/components/admin/AdminNav";
import AdminContent from "@/components/admin/AdminContent";
import { AdminNavProvider } from "@/components/admin/AdminNavContext";
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
        AdminTopBar occupe la bande du haut ; AdminNav flotte en "fixed"
        juste sous elle (top-28, voir le composant) pour démarrer au même
        niveau que le contenu. Le rail est ancré à left-8 (32px), la même
        marge que le padding droit du contenu (px-8) : gauche et droite de
        la page sont donc visuellement égales. `AdminContent` réserve sa
        marge gauche repliée (104px) et la fait grandir en miroir (256px)
        au survol du rail via AdminNavContext — menu et contenu partagent
        réellement la largeur de la page.
      */}
      <AdminTopBarProvider>
        <AdminNavProvider>
          <AdminNav role={profile.role} fullName={profile.full_name} demoMode={demoMode} />
          <AdminContent>
            <AdminTopBar fullName={profile.full_name} demoMode={demoMode} />
            <div className="mt-6">{children}</div>
          </AdminContent>
        </AdminNavProvider>
      </AdminTopBarProvider>
    </div>
  );
}
