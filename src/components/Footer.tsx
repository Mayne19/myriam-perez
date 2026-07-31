import Link from "next/link";
import { NAV_LINKS, CALENDLY_URL } from "@/data/nav";

export default function Footer() {
  return (
    <footer data-section-theme="dark" className="border-t border-espresso-900/[0.08] bg-espresso-900">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            {/* Version claire du logo, faite pour ce fond sombre — pas de carte, pas de largeur forcée. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-mp-white.png" alt="Myriam Perez" className="h-11 w-auto sm:h-12" />
            <div className="text-left leading-tight">
              <p className="font-bold tracking-tight text-cream-50">Myriam Perez</p>
              <p className="text-sm text-cream-100/60">Inspire &amp; Impact — Formateur certifié au Québec</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream-100/70">
            <Link href="/" className="no-underline transition-colors hover:text-accent">
              Accueil
            </Link>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="no-underline transition-colors hover:text-accent">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mêmes actions que dans l'en-tête, sous forme de boutons côte à côte */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/login"
            className="no-underline rounded-full border border-cream-50/40 px-5 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-cream-50 hover:text-espresso-900"
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

        <div className="mt-10 flex flex-col gap-2 border-t border-cream-50/10 pt-8 text-xs text-cream-100/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Myriam Perez Inc</p>
          <Link href="/politique-de-confidentialite" className="no-underline transition-colors hover:text-accent">
            Politique de confidentialité
          </Link>
        </div>
      </div>

      {/*
        Signature géante en pied de page, dans le style du grand nom du hero :
        très grand, faible contraste. Deux lignes — « Inspire » à gauche,
        « Impact » à droite — et l'esperluette au centre, à cheval sur la couture
        entre les deux. Le bas des lettres est rogné par le bord du footer.
      */}
      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden font-sans text-[clamp(2.25rem,11vw,10.5rem)] font-bold leading-[0.95] tracking-tight text-cream-50/[0.07]"
      >
        {/*
          Même conteneur que le reste du site — max-w-7xl avec le padding à
          l'intérieur — pour que le texte s'arrête exactement sur les marges de
          la page. La marge négative est portée par ce conteneur (et non par
          « Impact ») afin que son centre reste précisément la couture.
        */}
        <div className="relative mx-auto -mb-[0.18em] max-w-7xl px-6 lg:px-10">
          <span className="block text-left">Inspire</span>
          <span className="block text-right">Impact</span>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">&amp;</span>
        </div>
      </div>
    </footer>
  );
}
