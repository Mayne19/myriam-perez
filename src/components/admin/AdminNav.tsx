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

function CircleLink({ link, active }: { link: NavLink; active: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      title={link.label}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full no-underline transition-colors ${
        active ? "bg-accent text-cream-50" : "text-espresso-600 hover:bg-cream-100"
      }`}
    >
      <Icon className="h-[18px] w-[18px]" />
    </Link>
  );
}

function RowLink({ link, active }: { link: NavLink; active: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      className={`flex items-center gap-3 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
        active ? "bg-accent text-cream-50" : "text-espresso-700 hover:bg-cream-100"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {link.label}
    </Link>
  );
}

/*
  Rail flottant à deux visages qui partagent le même conteneur (largeur
  animée de 64 à 256px, le reste suit en `absolute inset-0`) :
  - Au repos : icônes seules, réparties en 3 capsules qui regroupent ce qui
    va ensemble — vue d'ensemble/business (Dashboard, Formations,
    Apprenants, Abonnements), éditorial (Articles, Catégories), compte
    (Paramètres, Déconnexion).
  - Au survol : bascule (fondu) vers un panneau unique qui révèle les
    libellés, avec les mêmes regroupements (un peu d'air entre chaque bloc).
    Le survol NE superpose pas le contenu : `AdminLayout` observe la même
    classe `group` via un sélecteur miroir sur `<main>` pour réduire sa
    largeur en même temps (voir layout.tsx) — les deux se partagent la page.
*/
export default function AdminNav({
  role,
  fullName,
  demoMode = false,
}: {
  role: "admin" | "editor";
  fullName: string | null;
  demoMode?: boolean;
}) {
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

  return (
    <div className="peer/nav group fixed left-4 top-4 bottom-4 z-30 w-16 transition-[width] duration-500 ease-in-out hover:w-64">
      {/* Repos : capsules séparées, icônes seules */}
      <div className="absolute inset-0 flex flex-col items-center justify-between opacity-100 transition-opacity duration-300 group-hover:pointer-events-none group-hover:opacity-0">
        <div className="flex flex-col items-center gap-3">
          {group1.length > 0 && (
            <div className="flex flex-col items-center gap-1 rounded-full bg-white p-1.5 shadow-lg shadow-espresso-900/10 ring-1 ring-espresso-900/5">
              {group1.map((link) => (
                <CircleLink key={link.href} link={link} active={isActive(link)} />
              ))}
            </div>
          )}
          {group2.length > 0 && (
            <div className="flex flex-col items-center gap-1 rounded-full bg-white p-1.5 shadow-lg shadow-espresso-900/10 ring-1 ring-espresso-900/5">
              {group2.map((link) => (
                <CircleLink key={link.href} link={link} active={isActive(link)} />
              ))}
            </div>
          )}
        </div>

        {/* Bloc compte : Paramètres (si présent) + Déconnexion, toujours ensemble en bas. */}
        <div className="flex flex-col items-center gap-1 rounded-full bg-white p-1.5 shadow-lg shadow-espresso-900/10 ring-1 ring-espresso-900/5">
          {group3.map((link) => (
            <CircleLink key={link.href} link={link} active={isActive(link)} />
          ))}
          <button
            type="button"
            onClick={handleLogout}
            title="Se déconnecter"
            className="flex h-11 w-11 items-center justify-center rounded-full text-espresso-600 transition-colors hover:bg-cream-100"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Survol : même rail, mais chaque capsule s'élargit et révèle ses libellés — toujours trois blocs distincts, jamais fondus en une seule liste. */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <div className="flex flex-col gap-3">
          {group1.length > 0 && (
            <nav className="flex flex-col gap-1 rounded-[24px] bg-white p-2 shadow-2xl shadow-espresso-900/10 ring-1 ring-espresso-900/5">
              {group1.map((link) => (
                <RowLink key={link.href} link={link} active={isActive(link)} />
              ))}
            </nav>
          )}
          {group2.length > 0 && (
            <nav className="flex flex-col gap-1 rounded-[24px] bg-white p-2 shadow-2xl shadow-espresso-900/10 ring-1 ring-espresso-900/5">
              {group2.map((link) => (
                <RowLink key={link.href} link={link} active={isActive(link)} />
              ))}
            </nav>
          )}
        </div>

        <div className="flex flex-col gap-1 rounded-[24px] bg-white p-2 shadow-2xl shadow-espresso-900/10 ring-1 ring-espresso-900/5">
          {fullName && <span className="truncate px-3 pt-1 text-sm text-espresso-500">{fullName}</span>}
          {group3.map((link) => (
            <RowLink key={link.href} link={link} active={isActive(link)} />
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-medium text-espresso-700 transition-colors hover:bg-cream-100 hover:text-accent"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
