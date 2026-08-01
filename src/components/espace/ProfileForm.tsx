"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateFullName } from "@/app/espace/actions";
import { FIELD_CLASSES } from "@/lib/fields";

export default function ProfileForm({
  initialFullName,
  demoMode = false,
}: {
  initialFullName: string | null;
  demoMode?: boolean;
}) {
  const [fullName, setFullName] = useState(initialFullName ?? "");
  const [nameStatus, setNameStatus] = useState<string | null>(null);
  const [nameSaving, setNameSaving] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  async function handleNameSubmit(e: FormEvent) {
    e.preventDefault();
    setNameSaving(true);
    setNameStatus(null);
    const { error } = await updateFullName(fullName);
    setNameStatus(error ?? "Nom mis à jour.");
    setNameSaving(false);
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordStatus(null);

    if (demoMode) {
      setPassword("");
      setPasswordStatus("Mode démo : connectez Supabase pour changer réellement le mot de passe.");
      setPasswordSaving(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setPasswordStatus("Mot de passe mis à jour.");
    } catch {
      setPasswordStatus("Impossible de mettre à jour le mot de passe.");
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleNameSubmit} className="rounded-2xl border border-espresso-900/10 bg-white p-6">
        <h2 className="font-medium text-espresso-900">Nom</h2>
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
            disabled={nameSaving}
            className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark disabled:opacity-60"
          >
            {nameSaving ? "…" : "Enregistrer"}
          </button>
        </div>
        {nameStatus && <p className="mt-2 text-sm text-espresso-500">{nameStatus}</p>}
      </form>

      <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-espresso-900/10 bg-white p-6">
        <h2 className="font-medium text-espresso-900">Mot de passe</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={FIELD_CLASSES}
            placeholder="Nouveau mot de passe"
          />
          <button
            type="submit"
            disabled={passwordSaving}
            className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark disabled:opacity-60"
          >
            {passwordSaving ? "…" : "Mettre à jour"}
          </button>
        </div>
        {passwordStatus && <p className="mt-2 text-sm text-espresso-500">{passwordStatus}</p>}
      </form>
    </div>
  );
}
