"use client";

import { Bell, CreditCard, GraduationCap, HelpCircle, Search, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ProfileMenu, { type ProfileMenuItem } from "@/components/ProfileMenu";

const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  { label: "Mon profil", href: "/espace/profil", icon: User },
  { label: "Mes formations", href: "/espace", icon: GraduationCap },
  { label: "Abonnement", href: "/espace/abonnement", icon: CreditCard },
  { label: "Aide & support", href: "/espace/aide", icon: HelpCircle },
  { label: "Paramètres", href: "/espace/parametres", icon: Settings },
];

function NotificationBell({ hasNotification = false }: { hasNotification?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/10 bg-white text-espresso-600 ${
          open ? "border-accent/40 text-accent" : ""
        }`}
      >
        <Bell className="h-[18px] w-[18px]" />
        {hasNotification && <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-accent" />}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl bg-white p-4 shadow-2xl shadow-espresso-900/10 ring-1 ring-espresso-900/5">
          <p className="text-sm font-medium text-espresso-900">Notifications</p>
          <p className="mt-2 text-sm text-espresso-400">Rien de nouveau pour l&apos;instant.</p>
        </div>
      )}
    </div>
  );
}

export default function EspaceTopBar({ fullName, demoMode = false, hasNotification = false }: { fullName: string | null; demoMode?: boolean; hasNotification?: boolean }) {
  return (
    <div className="flex items-center justify-end gap-4">
      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-400" />
        <input
          type="text"
          placeholder="Rechercher…"
          className="h-10 w-56 rounded-full border border-espresso-900/10 bg-white pl-9 pr-4 text-sm text-espresso-900 placeholder:text-espresso-400 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
      </div>

      <NotificationBell hasNotification={hasNotification} />

      <div className="h-6 w-px bg-espresso-900/10" />

      <ProfileMenu fullName={fullName} items={PROFILE_MENU_ITEMS} demoMode={demoMode} />
    </div>
  );
}
