"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { exitDemo } from "@/app/demo/actions";

const LINKS = [
  { label: "Mes formations", href: "/espace", icon: GraduationCap, exact: true },
  { label: "Profil", href: "/espace/profil", icon: User, exact: false },
] as const;

/*
  Même rail que AdminNav (voir ce composant pour le détail de l'anti-rebond
  et du hover) mais réduit aux seules sections de l'espace apprenant. Pas
  de découpage en blocs ici : juste deux liens + déconnexion, un seul
  groupe suffit.
*/
export default function EspaceNav({ demoMode = false }: { fullName: string | null; demoMode?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

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
    <div className="peer/nav group fixed left-4 top-28 bottom-4 z-30 w-16 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100 hover:w-56 hover:delay-0">
      <div className="flex h-full flex-col justify-between">
        <nav className="flex flex-col gap-1 overflow-hidden rounded-[24px] bg-white p-1.5 shadow-lg shadow-espresso-900/10 ring-1 ring-espresso-900/5">
          {LINKS.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={`flex h-11 items-center gap-3 overflow-hidden whitespace-nowrap rounded-full px-3.5 no-underline transition-colors ${
                  active ? "bg-accent text-cream-50" : "text-espresso-600 hover:bg-cream-100"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="text-sm font-medium opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-150">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-1 overflow-hidden rounded-[24px] bg-white p-1.5 shadow-lg shadow-espresso-900/10 ring-1 ring-espresso-900/5">
          <button
            type="button"
            onClick={handleLogout}
            title="Se déconnecter"
            className="flex h-11 items-center gap-3 overflow-hidden whitespace-nowrap rounded-full px-3.5 text-espresso-600 transition-colors hover:bg-cream-100"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span className="text-sm font-medium opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-150">
              Se déconnecter
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
