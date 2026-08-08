"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type SearchConfig = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type AdminTopBarContextValue = {
  search: SearchConfig | null;
  setSearch: (config: SearchConfig | null) => void;
};

const AdminTopBarContext = createContext<AdminTopBarContextValue | null>(null);

/*
  Permet à n'importe quelle page admin de brancher sa propre recherche sur
  la topbar globale (posée une fois dans AdminLayout) sans que le layout
  ait besoin de connaître le state de chaque page. Une page qui n'appelle
  pas useAdminTopBarSearch laisse simplement la recherche vide.
*/
export function AdminTopBarProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<SearchConfig | null>(null);
  const value = useMemo(() => ({ search, setSearch }), [search]);
  return <AdminTopBarContext.Provider value={value}>{children}</AdminTopBarContext.Provider>;
}

export function useAdminTopBarContext() {
  const ctx = useContext(AdminTopBarContext);
  if (!ctx) throw new Error("useAdminTopBarContext doit être utilisé sous AdminTopBarProvider");
  return ctx;
}

/*
  À appeler depuis une page admin pour brancher son propre champ de
  recherche sur la topbar globale. Se désabonne au démontage (changement
  de page) pour que la recherche ne "fuite" pas vers une page qui n'en a
  pas.
*/
export function useAdminTopBarSearch(config: SearchConfig | null) {
  const { setSearch } = useAdminTopBarContext();

  useEffect(() => {
    setSearch(config);
    return () => setSearch(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.value, config?.onChange, config?.placeholder]);
}
