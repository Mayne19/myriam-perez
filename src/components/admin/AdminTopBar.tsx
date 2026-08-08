"use client";

import { Settings, User } from "lucide-react";
import TopBarSearch from "@/components/TopBarSearch";
import NotificationsButton from "@/components/NotificationsButton";
import ProfileMenu, { type ProfileMenuItem } from "@/components/ProfileMenu";

const ADMIN_MENU_ITEMS: ProfileMenuItem[] = [
  { label: "Mon profil", href: "/admin/parametres", icon: User },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings },
];

export default function AdminTopBar({
  fullName,
  demoMode = false,
  search,
  onSearchChange,
  searchPlaceholder,
}: {
  fullName: string | null;
  demoMode?: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <TopBarSearch value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />
      <div className="flex items-center gap-3">
        <NotificationsButton />
        <ProfileMenu fullName={fullName} items={ADMIN_MENU_ITEMS} demoMode={demoMode} />
      </div>
    </div>
  );
}
