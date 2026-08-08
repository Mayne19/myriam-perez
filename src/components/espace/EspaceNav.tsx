"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { GraduationCap, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { exitDemo } from "@/app/demo/actions";
import { useAdminNavExpanded } from "@/components/admin/AdminNavContext";

const TOP_LINKS = [
  { label: "Dashboard", href: "/espace", icon: LayoutDashboard, exact: true },
  { label: "Formations", href: "/espace/formations", icon: GraduationCap, exact: false },
] as const;

const BOTTOM_LINKS = [
  { label: "Paramètres", href: "/espace/parametres", icon: Settings, exact: false },
] as const;

type EspaceLink = (typeof TOP_LINKS)[number] | (typeof BOTTOM_LINKS)[number];

function RailLink({ link, active, expanded }: { link: EspaceLink; active: boolean; expanded: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      title={link.label}
      className={`flex h-11 items-center overflow-hidden whitespace-nowrap rounded-full no-underline transition-colors ${
        active ? "bg-accent text-cream-50 hover:text-cream-50" : "text-espresso-600 hover:bg-cream-100 hover:text-espresso-600"
      }`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span
        className={`pr-4 text-sm font-medium transition-opacity duration-150 ${
          expanded ? "opacity-100 delay-150" : "opacity-0"
        }`}
      >
        {link.label}
      </span>
    </Link>
  );
}

/*
  Même rail que AdminNav (même structure, mêmes dimensions, mêmes courbes et
  délais, état partagé via AdminNavContext) — seuls les liens changent pour
  l'espace apprenant. La capsule logo, les groupes et la capsule du bas
  (mb-8) sont strictement identiques au panel admin.
*/
export default function EspaceNav({ demoMode = false }: { fullName: string | null; demoMode?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { expanded, setExpanded } = useAdminNavExpanded();
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActive = (link: EspaceLink) => (link.exact ? pathname === link.href : pathname.startsWith(link.href));

  async function handleLogout() {
    if (!confirm("Se déconnecter ?")) return;
    if (demoMode) {
      await exitDemo();
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login?mode=login");
    router.refresh();
  }

  function handleEnter() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setExpanded(true);
  }

  function handleLeave() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setExpanded(false), 150);
  }

  const capsuleClass = `flex flex-col gap-1 overflow-hidden bg-white p-1.5 shadow-lg shadow-espresso-900/10 ring-1 ring-espresso-900/5 transition-[width,border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
    expanded ? "w-44 rounded-[28px] delay-0" : "w-14 rounded-[34px] delay-100"
  }`;

  return (
    <>
      <nav className="fixed left-[38px] top-[88px] z-30" aria-label="Myriam Perez">
        <Link href="/espace" className="flex h-11 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full no-underline">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icon-mp.png" alt="Myriam Perez" className="h-7 w-auto" />
          </span>
          <span
            className={`flex flex-col pr-4 text-left leading-none transition-opacity duration-150 ${
              expanded ? "opacity-100 delay-150" : "opacity-0"
            }`}
          >
            <span className="text-sm font-bold tracking-tight text-espresso-900">Myriam Perez</span>
            <span className="text-xs font-medium opacity-70 text-espresso-600">Inspire &amp; Impact</span>
          </span>
        </Link>
      </nav>

      <div className="fixed left-8 top-[168px] bottom-4 z-30 flex flex-col justify-between">
        <nav className={capsuleClass} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          {TOP_LINKS.map((link) => (
            <RailLink key={link.href} link={link} active={isActive(link)} expanded={expanded} />
          ))}
        </nav>

        <div className={`mb-8 ${capsuleClass}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          {BOTTOM_LINKS.map((link) => (
            <RailLink key={link.href} link={link} active={isActive(link)} expanded={expanded} />
          ))}
          <button
            type="button"
            onClick={handleLogout}
            title="Se déconnecter"
            className="flex h-11 items-center overflow-hidden whitespace-nowrap rounded-full text-espresso-600 transition-colors hover:bg-cream-100"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center">
              <LogOut className="h-[18px] w-[18px]" />
            </span>
            <span
              className={`pr-4 text-sm font-medium transition-opacity duration-150 ${
                expanded ? "opacity-100 delay-150" : "opacity-0"
              }`}
            >
              Se déconnecter
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
