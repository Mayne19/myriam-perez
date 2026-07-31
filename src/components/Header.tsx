"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, CALENDLY_URL } from "@/data/nav";

/**
 * Header transparent qui inverse ses couleurs selon la section placée dessous.
 * Les sections sombres sont marquées avec `data-section-theme="dark"` ;
 * tout le reste est considéré comme clair.
 */
export default function Header() {
  const barRef = useRef<HTMLDivElement>(null);
  const [onDark, setOnDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Le menu déplié se referme dès qu'on change de page.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;

      // On sonde juste sous le milieu de la barre.
      const rect = bar.getBoundingClientRect();
      const probeY = rect.top + rect.height / 2;

      let dark = false;
      document.querySelectorAll<HTMLElement>("[data-section-theme='dark']").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) dark = true;
      });

      setOnDark(dark);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const textColor = onDark ? "text-cream-50" : "text-espresso-900";
  const linkColor = onDark ? "text-cream-100/80" : "text-espresso-700";
  // Verre dépoli : translucide + flou, teinte inversée selon le fond
  const glass = onDark
    ? "bg-cream-50/10 border-cream-50/25"
    : "bg-cream-50/30 border-espresso-900/10";

  return (
    <header className="sticky top-3 z-50 sm:top-5">
      {/*
        Exactement le même conteneur que le Footer (mx-auto max-w-7xl px-6
        lg:px-10), calculé une seule fois contre le bord de l'écran. La
        pilule ci-dessous fait `w-full` de ce conteneur : son bord tombe
        donc pile où le Footer place son contenu, à gauche comme à droite.
      */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div
          ref={barRef}
          className={`w-full overflow-hidden border px-6 py-4 backdrop-blur-md transition-colors duration-300 lg:rounded-full lg:py-3 lg:pl-8 lg:pr-3 ${
            mobileOpen ? "rounded-[2rem]" : "rounded-full"
          } ${glass}`}
        >
          {/* Rangée toujours visible : logo à gauche, nav + boutons (grand écran) ou hamburger (mobile) à droite */}
          <div className="flex w-full items-center justify-between gap-4">
            {/*
              Deux versions du logo, une par fond, comme sur le reste de
              l'en-tête (pas de carte ni de fond derrière — juste le dessin).
              Largeur en `auto` : ne jamais forcer une largeur fixe, ça
              déforme le dessin.
            */}
            <Link href="/" className="flex shrink-0 items-center gap-3 no-underline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={onDark ? "/images/logo-mp-white.png" : "/images/icon-mp.png"}
                alt="Myriam Perez"
                className="h-11 w-auto sm:h-12"
              />
              <span className={`hidden flex-col text-left leading-tight transition-colors duration-300 sm:flex ${textColor}`}>
                <span className="font-bold tracking-tight">Myriam Perez</span>
                <span className="text-sm font-medium opacity-70">Inspire &amp; Impact</span>
              </span>
            </Link>

            <nav
              className={`hidden items-center gap-x-8 text-sm font-medium transition-colors duration-300 lg:flex ${linkColor}`}
            >
              <Link
                href="/"
                className={`no-underline whitespace-nowrap transition-colors hover:text-accent ${
                  isActive("/") ? "font-semibold text-accent" : ""
                }`}
              >
                Accueil
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`no-underline whitespace-nowrap transition-colors hover:text-accent ${
                    isActive(link.href) ? "font-semibold text-accent" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <Link
                href="/login"
                className={`no-underline rounded-full border px-5 py-3 text-sm font-medium transition-colors ${
                  onDark
                    ? "border-cream-50/40 text-cream-50 hover:bg-cream-50 hover:text-espresso-900"
                    : "border-espresso-900/20 text-espresso-900 hover:bg-espresso-900 hover:text-cream-50"
                }`}
              >
                Connexion
              </Link>

              <Link
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline rounded-full bg-accent px-7 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark hover:text-cream-50"
              >
                Réserver
              </Link>
            </div>

            {/* Hamburger — mobile et tablette uniquement */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 lg:hidden ${textColor}`}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Menu déplié — mobile et tablette uniquement */}
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out lg:hidden"
            style={{ gridTemplateRows: mobileOpen ? "1fr" : "0fr" }}
          >
            <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
              <nav className={`flex flex-col gap-1 pt-6 text-base font-medium transition-colors duration-300 ${linkColor}`}>
                <Link
                  href="/"
                  className={`no-underline rounded-xl px-3 py-2.5 transition-colors hover:text-accent ${
                    isActive("/") ? "font-semibold text-accent" : ""
                  }`}
                >
                  Accueil
                </Link>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`no-underline rounded-xl px-3 py-2.5 transition-colors hover:text-accent ${
                      isActive(link.href) ? "font-semibold text-accent" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 flex flex-col gap-3 pb-2">
                <Link
                  href="/login"
                  className={`no-underline rounded-full border px-5 py-3 text-center text-sm font-medium transition-colors ${
                    onDark
                      ? "border-cream-50/40 text-cream-50 hover:bg-cream-50 hover:text-espresso-900"
                      : "border-espresso-900/20 text-espresso-900 hover:bg-espresso-900 hover:text-cream-50"
                  }`}
                >
                  Connexion
                </Link>

                <Link
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline rounded-full bg-accent px-7 py-3 text-center text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark hover:text-cream-50"
                >
                  Réserver
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
