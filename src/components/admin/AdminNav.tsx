"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { CreditCard, FolderOpen, GraduationCap, LayoutDashboard, LogOut, Newspaper, Settings, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { exitDemo } from "@/app/demo/actions";
import { useAdminNavExpanded } from "@/components/admin/AdminNavContext";

// `group` détermine la capsule dans laquelle le lien tombe (voir le rendu
// plus bas) : 1 = vue d'ensemble/business, 2 = éditorial (blog), 3 = compte.
const ALL_LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["admin"], exact: true, group: 1 },
  { label: "Formations", href: "/admin/formations", icon: GraduationCap, roles: ["admin"], exact: false, group: 1 },
  { label: "Apprenants", href: "/admin/apprenants", icon: Users, roles: ["admin"], exact: false, group: 1 },
  { label: "Abonnements", href: "/admin/abonnements", icon: CreditCard, roles: ["admin"], exact: false, group: 1 },
  { label: "Articles", href: "/admin/blog", icon: Newspaper, roles: ["admin", "editor"], exact: false, group: 2 },
  { label: "Catégories", href: "/admin/categories", icon: FolderOpen, roles: ["admin", "editor"], exact: false, group: 2 },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings, roles: ["admin"], exact: false, group: 3 },
] as const;

type NavLink = (typeof ALL_LINKS)[number];

function RailLink({ link, active, expanded }: { link: NavLink; active: boolean; expanded: boolean }) {
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
  Rail flottant ancré à un point fixe (left-8, top-[168px]) qui ne se déplace
  JAMAIS pendant le survol — seule sa largeur s'étend (comme un bras qui se
  tend). L'élargissement est GROUPÉ : survoler une seule capsule déploie
  tout le rail d'un bloc (largeur, arrondi et libellés pilotés par l'état
  partagé AdminNavContext), et `AdminContent` fait grandir sa marge gauche
  en miroir avec la même courbe et le même délai.

  Pour que l'espace vide du rail ne réagisse pas :
  - Les handlers ne sont posés que sur les capsules (jamais sur le conteneur).
  - Un délai de grâce de 150ms au `mouseleave` évite tout clignotement quand
    on passe d'une capsule à l'autre ; si l'on s'arrête dans le vide, au bout
    de 150ms le rail se replie.
*/
export default function AdminNav({ role, demoMode = false }: { role: "admin" | "editor"; fullName: string | null; demoMode?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { expanded, setExpanded } = useAdminNavExpanded();
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const links = ALL_LINKS.filter((l) => (l.roles as readonly string[]).includes(role));
  const isActive = (link: NavLink) => (link.exact ? pathname === link.href : pathname.startsWith(link.href));

  const group1 = links.filter((l) => l.group === 1);
  const group2 = links.filter((l) => l.group === 2);
  const group3 = links.filter((l) => l.group === 3);

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

  // Repos : 56px, arrondi 34px, repli après 100ms. Déployé : 176px, arrondi
  // 30px, sans délai. Largeur ET arrondi transitent ensemble.
  const capsuleClass = `flex flex-col gap-1 overflow-hidden bg-white p-1.5 shadow-lg shadow-espresso-900/10 ring-1 ring-espresso-900/5 transition-[width,border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
    expanded ? "w-44 rounded-[28px] delay-0" : "w-14 rounded-[34px] delay-100"
  }`;

  return (
    <>
      <nav className="fixed left-[38px] top-[88px] z-30" aria-label="Myriam Perez">
        <Link href="/admin" className="flex h-11 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full no-underline">
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
      <div className="flex flex-col gap-3">
        {group1.length > 0 && (
          <nav className={capsuleClass} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            {group1.map((link) => (
              <RailLink key={link.href} link={link} active={isActive(link)} expanded={expanded} />
            ))}
          </nav>
        )}
        {group2.length > 0 && (
          <nav className={capsuleClass} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            {group2.map((link) => (
              <RailLink key={link.href} link={link} active={isActive(link)} expanded={expanded} />
            ))}
          </nav>
        )}
      </div>

      <div className={`mb-8 ${capsuleClass}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        {group3.map((link) => (
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
