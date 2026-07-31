"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FIELD_CLASSES } from "@/lib/fields";

type Mode = "login" | "signup";

// Seuls ces messages précis (saisis par l'utilisateur, pas un problème
// technique) sont montrés tels quels. Tout le reste — configuration
// manquante, erreur réseau, exception inattendue — ne doit JAMAIS s'afficher
// littéralement : on retombe sur un message générique poli.
const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Courriel ou mot de passe incorrect.",
  "User already registered": "Un compte existe déjà avec ce courriel.",
  "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caractères.",
};

const GENERIC_ERROR = "Ce service n'est pas encore disponible. Merci de réessayer plus tard.";

function friendlyError(err: unknown): string {
  if (err instanceof Error && err.message in ERROR_MESSAGES) {
    return ERROR_MESSAGES[err.message];
  }
  // Détail technique conservé uniquement dans la console, jamais à l'écran.
  console.error(err);
  return GENERIC_ERROR;
}

function AppleIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" fill="currentColor" className={props.className}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function GoogleIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={props.className}>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.1 5.6-5.7 7.3l6.6 5.6C39.7 38.8 44 32.9 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

/*
  Formulaire de connexion / inscription. Utilisé sur la page /login et,
  sous une forme identique, dans l'étape de création de compte du panneau
  de paiement (voir PaymentDrawer).

  Sur la page /login, le mode initial vient de l'URL (?mode=login|signup) et
  la bascule utilise de vrais hyperliens. Dans le panneau de paiement
  (onAuthenticated fourni), la bascule reste en place, en boutons.
*/
type AuthFormProps = {
  onAuthenticated?: () => void;
  initialMode?: Mode;
};

export default function AuthForm({ onAuthenticated, initialMode = "signup" }: AuthFormProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function finish() {
    if (onAuthenticated) {
      onAuthenticated();
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleOAuth(provider: "apple" | "google") {
    setError(null);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(friendlyError(err));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: `${firstName} ${lastName}`.trim() } },
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }

      finish();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-accent">Inspire &amp; Impact</p>
        <h1 className="mt-3 text-3xl font-medium leading-tight text-espresso-900">
          {mode === "signup" ? (
            <>
              Créez votre
              <br />
              espace formation
            </>
          ) : (
            <>
              Ravie de vous
              <br />
              revoir
            </>
          )}
        </h1>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => handleOAuth("apple")}
          aria-label="Continuer avec Apple"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-espresso-900/15 bg-white text-espresso-900 shadow-sm transition-colors hover:border-espresso-900/25 hover:bg-cream-100"
        >
          <AppleIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          aria-label="Continuer avec Google"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-espresso-900/15 bg-white shadow-sm transition-colors hover:border-espresso-900/25 hover:bg-cream-100"
        >
          <GoogleIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-espresso-900/10" />
        <span className="text-sm text-espresso-400">ou</span>
        <span className="h-px flex-1 bg-espresso-900/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" && (
          <div className="flex gap-3">
            <input
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={FIELD_CLASSES}
              placeholder="Prénom"
            />
            <input
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={FIELD_CLASSES}
              placeholder="Nom"
            />
          </div>
        )}

        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={FIELD_CLASSES}
          placeholder="Courriel"
        />

        <input
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={FIELD_CLASSES}
          placeholder="Mot de passe"
        />

        {error && (
          <p className="rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm text-espresso-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          {loading ? "Un instant…" : mode === "signup" ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-espresso-500">
        {mode === "signup" ? (
          <>
            Déjà un compte ?{" "}
            {onAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="font-medium text-espresso-900 transition-colors"
              >
                Se connecter
              </button>
            ) : (
              <Link
                href="/login?mode=login"
                className="font-medium text-espresso-900 transition-colors"
              >
                Se connecter
              </Link>
            )}
          </>
        ) : (
          <>
            Pas encore de compte ?{" "}
            {onAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className="font-medium text-espresso-900 transition-colors"
              >
                S&apos;inscrire
              </button>
            ) : (
              <Link
                href="/login?mode=signup"
                className="font-medium text-espresso-900 transition-colors"
              >
                S&apos;inscrire
              </Link>
            )}
          </>
        )}
      </p>
    </div>
  );
}
