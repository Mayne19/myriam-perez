import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/demo";
import AdminNav from "@/components/admin/AdminNav";
import DemoBanner from "@/components/DemoBanner";

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
    <div className="flex h-svh overflow-hidden bg-cream-50">
      <AdminNav role={profile.role} fullName={profile.full_name} demoMode={demoMode} />
      <main className="flex-1 overflow-y-auto px-8 py-10">
        {demoMode && <DemoBanner />}
        {children}
      </main>
    </div>
  );
}
