"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

/*
  Cloche de notifications. Il n'existe pas encore de modèle de notifications
  en base — on affiche donc l'état vide plutôt que d'inventer des données.
  Le composant reste prêt à recevoir une vraie liste plus tard (props
  `items` à ajouter) sans changer l'UI du bouton/popover.
*/
export default function NotificationsButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/10 text-espresso-600 transition-colors hover:border-accent/40 hover:text-accent ${
          open ? "border-accent/40 text-accent" : ""
        }`}
      >
        <Bell className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl bg-white p-4 shadow-2xl shadow-espresso-900/10 ring-1 ring-espresso-900/5">
          <p className="text-sm font-medium text-espresso-900">Notifications</p>
          <p className="mt-2 text-sm text-espresso-400">Rien de nouveau pour l&apos;instant.</p>
        </div>
      )}
    </div>
  );
}
