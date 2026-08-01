"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FIELD_CLASSES } from "@/lib/fields";

export default function InvitationForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      // /espace redirige lui-même vers /admin si le compte est admin/éditeur.
      router.push("/espace");
      router.refresh();
    } catch {
      setError("Impossible de définir le mot de passe. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-accent">Inspire &amp; Impact</p>
        <h1 className="mt-3 text-3xl font-medium leading-tight text-espresso-900">
          Bienvenue dans
          <br />
          l&apos;équipe
        </h1>
        <p className="mt-3 text-sm text-espresso-400">Choisissez votre mot de passe pour accéder à votre espace.</p>
      </div>

      <div className="mt-8 space-y-3">
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

        {error && <p className="rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm text-espresso-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          {loading ? "Un instant…" : "Accéder à mon espace"}
        </button>
      </div>
    </form>
  );
}
