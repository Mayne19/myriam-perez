"use client";

import { CreditCard, GraduationCap, HelpCircle, Settings, User } from "lucide-react";
import ProfileMenu, { type ProfileMenuItem } from "@/components/ProfileMenu";

const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  { label: "Mon profil", href: "/espace/profil", icon: User },
  { label: "Mes formations", href: "/espace", icon: GraduationCap },
  { label: "Abonnement", href: "/espace/abonnement", icon: CreditCard },
  { label: "Aide & support", href: "/espace/aide", icon: HelpCircle },
  { label: "Paramètres", href: "/espace/parametres", icon: Settings },
];

export default function EspaceTopBar({ fullName, demoMode = false }: { fullName: string | null; demoMode?: boolean }) {
  return (
    <div className="flex items-center justify-end gap-4">
      <ProfileMenu fullName={fullName} items={PROFILE_MENU_ITEMS} demoMode={demoMode} />
    </div>
  );
}
