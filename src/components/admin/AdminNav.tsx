"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, FolderOpen, GraduationCap, LayoutDashboard, LogOut, Newspaper, Settings, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { exitDemo } from "@/app/demo/actions";

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

function RailLink({ link, active }: { link: NavLink; active: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      title={link.label}
      className={`flex h-11 items-center overflow-hidden whitespace-nowrap rounded-full no-underline transition-colors ${
        active ? "bg-accent text-cream-50" : "text-espresso-600 hover:bg-cream-100"
      }`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="pr-4 text-sm font-medium opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-150">
        {link.label}
      </span>
    </Link>
  );
}

/*
  Rail flottant ancré à un point fixe (left-4, top-28) qui ne se déplace
  JAMAIS pendant le survol — seule sa largeur s'étend (comme un bras qui se
  tend), exactement comme au repos. Pour garantir zéro "rebond" :
  - Une seule couche de contenu (pas de cross-fade opacity entre deux vues,
    qui provoquait un reflow temporaire de largeur avant que `width` ait
    fini sa transition). Les icônes restent toujours montées, centrées
    dans un carré 44×44 fixe ; seuls les libellés apparaissent/disparaissent
    (fondu, dans un conteneur `overflow-hidden` qui n'affecte pas la
    largeur de l'icône).
  - `AdminLayout` mire la même transition sur `<main>` via `peer-hover/nav`.
  - Chaque capsule porte SON PROPRE `group/rail-N` : le survol de l'espace
    vide entre deux capsules (qui appartient au conteneur racine mais à
    aucune capsule) ne déclenche donc plus l'élargissement.
*/
export default function AdminNav({ role, demoMode = false }: { role: "admin" | "editor"; fullName: string | null; demoMode?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
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

  const capsuleClass =
    "peer/nav group w-14 overflow-hidden rounded-[22px] bg-white p-1.5 shadow-lg shadow-espresso-900/10 ring-1 ring-espresso-900/5 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100 hover:w-56 hover:delay-0";

  return (
    <div className="fixed left-8 top-28 bottom-4 z-30 flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        {group1.length > 0 && (
          <nav className={`flex flex-col gap-1 ${capsuleClass}`}>
            {group1.map((link) => (
              <RailLink key={link.href} link={link} active={isActive(link)} />
            ))}
          </nav>
        )}
        {group2.length > 0 && (
          <nav className={`flex flex-col gap-1 ${capsuleClass}`}>
            {group2.map((link) => (
              <RailLink key={link.href} link={link} active={isActive(link)} />
            ))}
          </nav>
        )}
      </div>

      <div className={`flex flex-col gap-1 ${capsuleClass}`}>
        {group3.map((link) => (
          <RailLink key={link.href} link={link} active={isActive(link)} />
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
          <span className="pr-4 text-sm font-medium opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-150">
            Se déconnecter
          </span>
        </button>
      </div>
    </div>
  );
}
