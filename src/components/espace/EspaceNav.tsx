"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { exitDemo } from "@/app/demo/actions";

const LINKS = [
  { label: "Mes formations", href: "/espace" },
  { label: "Profil", href: "/espace/profil" },
];

export default function EspaceNav({ fullName, demoMode = false }: { fullName: string | null; demoMode?: boolean }) {
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

        <div className="flex items-center gap-3">
          {fullName && <span className="hidden text-sm text-espresso-500 md:inline">{fullName}</span>}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Se déconnecter"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/15 text-espresso-700 transition-colors hover:border-accent/40 hover:text-accent"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
