"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FolderOpen, LogOut, Newspaper, Settings, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { exitDemo } from "@/app/demo/actions";

const ALL_LINKS = [
  { label: "Articles", href: "/admin/blog", icon: Newspaper, roles: ["admin", "editor"] },
  { label: "Catégories", href: "/admin/categories", icon: FolderOpen, roles: ["admin", "editor"] },
  { label: "Apprenants", href: "/admin/apprenants", icon: Users, roles: ["admin"] },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings, roles: ["admin"] },
] as const;

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
    <aside className="flex h-full w-56 shrink-0 flex-col justify-between overflow-y-auto border-r border-espresso-900/10 bg-white px-3 py-6">
      <div>
        <Link href="/admin" className="flex items-center gap-3 px-2 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/icon-mp.png" alt="Myriam Perez" className="h-9 w-auto" />
          <span className="flex flex-col leading-tight text-espresso-900">
            <span className="font-bold tracking-tight">Panel admin</span>
            <span className="text-xs font-medium text-espresso-400">Inspire &amp; Impact</span>
          </span>
        </Link>

        <nav className="mt-8 flex flex-col gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                  active ? "bg-accent-bg text-accent-text" : "text-espresso-700 hover:bg-cream-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-3 px-2">
        {fullName && <span className="text-sm text-espresso-500">{fullName}</span>}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-espresso-700 transition-colors hover:bg-cream-100 hover:text-accent"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
