"use client";

import { Settings, User } from "lucide-react";
import TopBarSearch from "@/components/TopBarSearch";
import NotificationsButton from "@/components/NotificationsButton";
import ProfileMenu, { type ProfileMenuItem } from "@/components/ProfileMenu";
import { useAdminTopBarContext } from "@/components/admin/AdminTopBarContext";

const ADMIN_MENU_ITEMS: ProfileMenuItem[] = [
  { label: "Mon profil", href: "/admin/parametres", icon: User },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings },
];

/*
  Topbar globale du panel admin (posée une fois dans AdminLayout). La
  recherche est branchée par la page courante via useAdminTopBarSearch
  (voir AdminTopBarContext) — une page qui ne l'appelle pas laisse la
  recherche vide, notifications+profil restent toujours affichés.
*/
export default function AdminTopBar({ fullName, demoMode = false }: { fullName: string | null; demoMode?: boolean }) {
  const { search } = useAdminTopBarContext();

  return (
    <div className="flex items-center justify-between gap-4">
      {search ? (
        <TopBarSearch value={search.value} onChange={search.onChange} placeholder={search.placeholder} />
      ) : (
        <div />
      )}
      <div className="flex items-center gap-3">
        <NotificationsButton />
        <ProfileMenu fullName={fullName} items={ADMIN_MENU_ITEMS} demoMode={demoMode} />
      </div>
    </div>
  );
}
