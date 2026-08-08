"use client";

import { useAdminNavExpanded } from "@/components/admin/AdminNavContext";

/*
  Le contenu de l'admin partage la page avec le rail de navigation. Sa marge
  gauche suit l'état du rail via AdminNavContext : replié (104px) par défaut,
  déployé (256px) au survol — même durée, même courbe et même délai que la
  transition de largeur du rail, pour un mouvement parfaitement synchronisé.
*/
export default function AdminContent({ children }: { children: React.ReactNode }) {
  const { expanded } = useAdminNavExpanded();

  return (
    <main
      className={`h-svh overflow-y-auto px-8 py-6 transition-[margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        expanded ? "ml-[208px] delay-0" : "ml-[104px] delay-100"
      }`}
    >
      {children}
    </main>
  );
}
