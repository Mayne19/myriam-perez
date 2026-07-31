"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { PAYMENT_OPTIONS } from "@/data/content";
import { createClient } from "@/lib/supabase/client";
import AuthForm from "@/components/AuthForm";

type PaymentDrawerProps = {
  /** Libellé du bouton qui ouvre le panneau. */
  label: string;
  /** Classes appliquées au bouton déclencheur. */
  className?: string;
};

type Step = "account" | "payment";

export default function PaymentDrawer({ label, className = "" }: PaymentDrawerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(PAYMENT_OPTIONS[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // "payment" par défaut : si Supabase n'est pas encore configuré, ou que la
  // session est déjà connue, on ne bloque jamais l'accès au paiement.
  const [step, setStep] = useState<Step>("payment");
  // Le panneau est monté dans document.body (voir portal plus bas) : sur le
  // serveur, document n'existe pas, d'où cette garde avant le premier rendu
  // client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // À l'ouverture, vérifie s'il y a déjà une session ; sinon, propose de
  // créer un compte avant de choisir le mode de paiement.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        setStep(user ? "payment" : "account");
      } catch {
        // Supabase pas encore configuré : on ne bloque pas le paiement.
        setStep("payment");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  // La page reste visible mais figée derrière le panneau.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleAccountCreated() {
    setStep("payment");
  }

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option: selected }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        // Le détail (clé Stripe manquante, erreur Stripe, etc.) reste dans la
        // console — jamais affiché tel quel à l'utilisateur.
        console.error("Échec du paiement :", data);
        throw new Error("checkout_failed");
      }
      window.location.href = data.url;
    } catch (e) {
      if (!(e instanceof Error && e.message === "checkout_failed")) console.error(e);
      setError("Le paiement n'est pas disponible pour le moment. Merci de réessayer plus tard ou de nous contacter.");
      setLoading(false);
    }
  }

  // Rendu hors de l'arbre du bouton déclencheur : si celui-ci se trouve
  // dans une carte animée (FadeIn), un `transform` actif pendant l'entrée
  // crée un nouveau repère de positionnement et casse le `fixed` du panneau
  // (il se retrouve coincé, rétréci, dans la carte au lieu de tenir tout
  // l'écran). Le portail vers document.body évite ce problème.
  const overlayAndDrawer = (
    <>
      {/* Voile semi-transparent sur le reste de la page */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-espresso-900/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panneau : un tiers de l'écran sur grand écran, pleine largeur sur mobile */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Choisissez votre mode de paiement"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-cream-50 shadow-2xl transition-transform duration-300 ease-out lg:w-1/3 lg:max-w-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-espresso-900/10 p-6">
          <h3 className="text-espresso-900">
            {step === "account" ? "Créez votre compte" : "Choisissez votre mode de paiement"}
          </h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="shrink-0 rounded-full p-2 text-espresso-500 transition-colors hover:bg-espresso-900/5 hover:text-espresso-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "account" ? (
          <div className="flex-1 overflow-y-auto p-6">
            <p className="mb-6 text-sm text-espresso-500">
              Un compte est nécessaire avant de finaliser le paiement. Une fois créé, vous
              enchaînez directement sur le choix du mode de paiement.
            </p>
            <AuthForm onAuthenticated={handleAccountCreated} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {PAYMENT_OPTIONS.map((opt) => {
                  const isSelected = selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelected(opt.id)}
                      className={`flex w-full items-start gap-3 rounded-2xl border p-5 text-left transition-colors ${
                        isSelected
                          ? "border-accent bg-accent-bg"
                          : "border-espresso-900/[0.12] bg-cream-50 hover:border-espresso-900/25"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? "border-accent bg-accent" : "border-espresso-900/25"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-cream-50" strokeWidth={3} />}
                      </span>
                      <span>
                        <span className="block font-medium text-espresso-900">{opt.label}</span>
                        <span className="mt-1 block text-sm text-espresso-500">{opt.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {error && (
                <p className="mt-6 rounded-xl border border-accent/40 bg-accent/5 p-4 text-sm text-espresso-700">
                  {error}
                </p>
              )}
            </div>

            <div className="border-t border-espresso-900/10 p-6">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark disabled:opacity-60"
              >
                {loading ? "Redirection…" : "Confirmer et payer"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>

      {mounted && createPortal(overlayAndDrawer, document.body)}
    </>
  );
}
