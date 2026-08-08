"use client";

import { Search } from "lucide-react";

/*
  Champ de recherche générique pour les topbars (admin pour l'instant). Pas
  de logique de filtrage ici : chaque page qui l'utilise branche `onChange`
  sur son propre state de filtrage (ex. la liste des apprenants).
*/
export default function TopBarSearch({
  value,
  onChange,
  placeholder = "Rechercher…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative flex w-full max-w-sm items-center">
      <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-espresso-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-espresso-900/10 bg-white py-2.5 pl-10 pr-4 text-sm text-espresso-900 outline-none placeholder:text-espresso-400 focus:border-accent/40"
      />
    </label>
  );
}
