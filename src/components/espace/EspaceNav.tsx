"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, GraduationCap, HelpCircle, Settings, User } from "lucide-react";
import ProfileMenu, { type ProfileMenuItem } from "@/components/ProfileMenu";

const LINKS = [
  { label: "Mes formations", href: "/espace" },
  { label: "Profil", href: "/espace/profil" },
];

const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  { label: "Mon profil", href: "/espace/profil", icon: User },
  { label: "Mes formations", href: "/espace", icon: GraduationCap },
  { label: "Abonnement", href: "/espace/abonnement", icon: CreditCard },
  { label: "Aide & support", href: "/espace/aide", icon: HelpCircle },
  { label: "Paramètres", href: "/espace/profil", icon: Settings },
];

export default function EspaceNav({ fullName, demoMode = false }: { fullName: string | null; demoMode?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-espresso-900/10 bg-cream-50/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/espace" className="flex items-center gap-3 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/icon-mp.png" alt="Myriam Perez" className="h-10 w-auto" />
          <span className="hidden flex-col leading-tight text-espresso-900 sm:flex">
            <span className="font-bold tracking-tight">Espace apprenant</span>
            <span className="text-xs font-medium text-espresso-400">Inspire &amp; Impact</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium text-espresso-700">
          {LINKS.map((link) => {
            const active = link.href === "/espace" ? pathname === "/espace" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`no-underline rounded-full px-4 py-2 transition-colors hover:text-accent ${
                  active ? "bg-accent-bg font-semibold text-accent-text" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <ProfileMenu fullName={fullName} items={PROFILE_MENU_ITEMS} demoMode={demoMode} />
      </div>
    </header>
  );
}
