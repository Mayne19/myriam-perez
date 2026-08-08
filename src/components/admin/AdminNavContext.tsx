"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type NavExpandContextValue = {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
};

const NavExpandContext = createContext<NavExpandContextValue | null>(null);

/*
  Fait partager au layout admin l'état « rail déployé ou non » : le survol
  du rail (AdminNav) met à jour cet état, et le conteneur du contenu
  (AdminContent) ajuste sa marge gauche en miroir. Le menu et le contenu se
  partagent ainsi réellement la largeur de la page, avec la même courbe et
  les mêmes délais de transition que la largeur du rail.
*/
export function AdminNavProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const value = useMemo(() => ({ expanded, setExpanded }), [expanded]);
  return <NavExpandContext.Provider value={value}>{children}</NavExpandContext.Provider>;
}

export function useAdminNavExpanded() {
  const ctx = useContext(NavExpandContext);
  if (!ctx) throw new Error("useAdminNavExpanded doit être utilisé sous AdminNavProvider");
  return ctx;
}
