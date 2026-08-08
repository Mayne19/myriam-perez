"use client";

import { useState } from "react";

const OPTIONS = [
  {
    key: "newCourses",
    label: "Nouvelles formations",
    description: "Recevez un courriel lorsqu'une nouvelle formation est publiée.",
  },
  {
    key: "progress",
    label: "Rappels de progression",
    description: "Une relance si vous n'avez pas ouvert vos formations depuis un moment.",
  },
  {
    key: "newsletter",
    label: "Lettres d'inspiration",
    description: "Conseils, témoignages et contenus exclusifs de Myriam.",
  },
] as const;

const STORAGE_KEY = "mp-notification-preferences";

function load(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export default function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => load());
  const [saved, setSaved] = useState(false);

  function save() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {OPTIONS.map((option) => {
        const checked = prefs[option.key] ?? true;
        return (
          <div
            key={option.key}
            className="flex items-start justify-between gap-4 rounded-xl border border-espresso-900/10 p-4"
          >
            <div>
              <p className="text-sm font-medium text-espresso-900">{option.label}</p>
              <p className="mt-0.5 text-xs text-espresso-500">{option.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              onClick={() => setPrefs((p) => ({ ...p, [option.key]: !checked }))}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                checked ? "bg-accent" : "bg-espresso-900/10"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  checked ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        );
      })}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark"
        >
          Enregistrer
        </button>
        {saved && <span className="text-sm text-emerald-600">Préférences enregistrées.</span>}
      </div>
    </div>
  );
}
