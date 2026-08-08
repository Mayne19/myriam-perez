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
  Même rail que AdminNav (voir ce composant pour le détail de l'anti-rebond,
  du centrage des icônes et de l'arrondi) mais réduit aux seules sections
  de l'espace apprenant. Pas de découpage en blocs ici : juste deux liens +
  déconnexion, un seul groupe suffit.
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

  const capsuleClass =
    "peer/nav group w-14 overflow-hidden rounded-[22px] bg-white p-1.5 shadow-lg shadow-espresso-900/10 ring-1 ring-espresso-900/5 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100 hover:w-56 hover:delay-0";

  return (
    <div className="fixed left-8 top-28 bottom-4 z-30 flex flex-col justify-between">
      <nav className={`flex flex-col gap-1 ${capsuleClass}`}>
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
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
        })}
      </nav>

      <div className={`flex flex-col gap-1 ${capsuleClass}`}>
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
