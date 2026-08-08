"use client";

import { useState, type FormEvent } from "react";
import { updateFullName } from "@/app/espace/actions";
import { FIELD_CLASSES } from "@/lib/fields";

export default function NameForm({ initialFullName }: { initialFullName: string | null }) {
  const [fullName, setFullName] = useState(initialFullName ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const { error } = await updateFullName(fullName);
    setStatus(error ?? "Nom mis à jour.");
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-espresso-900/10 bg-white p-6">
      <h2 className="font-medium text-espresso-900">Modifier le nom</h2>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={FIELD_CLASSES}
          placeholder="Nom complet"
        />
        <button
          type="submit"
          disabled={saving}
          className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          {saving ? "…" : "Enregistrer"}
        </button>
      </div>
      {status && <p className="mt-2 text-sm text-espresso-500">{status}</p>}
    </form>
  );
}
