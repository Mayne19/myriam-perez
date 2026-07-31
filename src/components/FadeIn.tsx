"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  /** Délai en secondes, arrondi aux paliers CSS disponibles (0 à 0.4s). */
  delay?: number;
  className?: string;
  /** "dark" pour signaler au header qu'il passe au-dessus d'un fond sombre. */
  sectionTheme?: "dark";
};

const DELAY_CLASS = ["", "reveal-d1", "reveal-d2", "reveal-d3", "reveal-d4"];

/*
  L'état "static" (rendu serveur, sans classe) reste pleinement visible : si le
  JS ne se charge pas, le contenu ne dépend jamais de lui. Une fois monté côté
  client, on bascule en "hidden" avant la peinture (useLayoutEffect, pas de
  flash), puis un IntersectionObserver déclenche "visible" (l'animation) au
  moment où la section entre réellement dans l'écran — pas seulement au
  chargement de la page, ce qui la faisait jouer une seule fois tout en haut.
*/
export default function FadeIn({ children, delay = 0, className = "", sectionTheme }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"static" | "hidden" | "visible">("static");
  const step = Math.min(4, Math.max(0, Math.round(delay * 10)));

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("hidden");
  }, []);

  useEffect(() => {
    if (phase !== "hidden") return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [phase]);

  const revealClass = phase === "visible" ? `reveal ${DELAY_CLASS[step]}` : phase === "hidden" ? "opacity-0" : "";

  return (
    <div ref={ref} className={`${revealClass} ${className}`.trim()} data-section-theme={sectionTheme}>
      {children}
    </div>
  );
}
