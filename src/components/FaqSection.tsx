import Accordion from "./Accordion";
import FadeIn from "./FadeIn";
import SplitHeading from "./SplitHeading";

type FaqItem = {
  q: string;
  a: string;
};

type FaqSectionProps = {
  title: string;
  /** Mots du titre à mettre en évidence (le reste passe en opacité réduite). */
  titleMuted?: string[];
  subtitle: string;
  items: FaqItem[];
  /** Index de la question ouverte au chargement. `null` pour tout fermer. */
  defaultOpen?: number | null;
};

export default function FaqSection({ title, titleMuted = [], subtitle, items, defaultOpen = 0 }: FaqSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-16">
        {/* Colonne gauche : titre + sous-titre */}
        <FadeIn>
          <SplitHeading as="h2" text={title} muted={titleMuted} />
          <p className="mt-3 text-2xl leading-snug tracking-tight text-espresso-300 sm:text-3xl">{subtitle}</p>
        </FadeIn>

        {/* Colonne droite : accordéon */}
        <Accordion items={items} defaultOpen={defaultOpen} />
      </div>
    </section>
  );
}
