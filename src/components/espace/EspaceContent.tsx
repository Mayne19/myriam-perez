"use client";

import { useAdminNavExpanded } from "@/components/admin/AdminNavContext";

/*
  Même conteneur de contenu que AdminContent (marge gauche 104px/208px en
  miroir du rail, même courbe et mêmes délais) — strictement identique au
  panel admin.
*/
export default function EspaceContent({ children }: { children: React.ReactNode }) {
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
