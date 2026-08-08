"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { exitDemo } from "@/app/demo/actions";

export type ProfileMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

function initials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/*
  Avatar cliquable (initiales, pas de photo en base pour l'instant) qui
  ouvre un menu déroulant — utilisé à la fois dans la topbar admin et dans
  la nav de l'espace apprenant. `items` porte les sections propres à chaque
  contexte ; la déconnexion est toujours en dernier, séparée par un trait.
*/
export default function ProfileMenu({
  fullName,
  items,
  demoMode = false,
}: {
  fullName: string | null;
  items: ProfileMenuItem[];
  demoMode?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu du profil"
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-cream-50 transition-shadow ${
          open ? "ring-2 ring-accent/30 ring-offset-2 ring-offset-cream-50" : ""
        }`}
      >
        {initials(fullName)}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl bg-white p-2 shadow-2xl shadow-espresso-900/10 ring-1 ring-espresso-900/5">
          <div className="flex flex-col gap-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-espresso-700 no-underline transition-colors hover:bg-cream-100"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-1 border-t border-espresso-900/10 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-espresso-700 transition-colors hover:bg-cream-100 hover:text-accent"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
