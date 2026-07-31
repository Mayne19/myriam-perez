import { Quote } from "lucide-react";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";
import SplitHeading from "./SplitHeading";

/*
  Point de départ de la chaîne défilante.
  L'ordre d'origine est conservé : on fait simplement pivoter la liste pour
  qu'elle commence par ce témoignage, les précédents repassant à la fin.
  Pour changer le départ, il suffit de remplacer ce nom.
*/
const START_WITH = "Rosie Nathan Benharroch";

const startIndex = Math.max(
  0,
  TESTIMONIALS.findIndex((t) => t.name === START_WITH),
);

const ORDERED = [...TESTIMONIALS.slice(startIndex), ...TESTIMONIALS.slice(0, startIndex)];

function initials(name: string) {
  return name
    .split(" ")
    .filter((w) => /^[A-ZÉÈÀÂÊÎÔÛÇ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function Card({ t }: { t: Testimonial }) {
  return (
    // Au survol, la carte s'inverse : fond orange, tous les textes en crème
    <figure className="group mr-5 flex w-[300px] shrink-0 flex-col rounded-3xl border border-espresso-900/[0.06] bg-cream-50 p-7 shadow-[0_10px_30px_-16px_rgba(18,13,11,0.25)] transition-colors duration-300 hover:border-accent hover:bg-accent">
      <Quote className="h-6 w-6 text-accent transition-colors duration-300 group-hover:text-cream-50" />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-espresso-700 transition-colors duration-300 group-hover:text-cream-50">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-espresso-900 text-xs font-medium text-cream-50 transition-colors duration-300 group-hover:bg-cream-50 group-hover:text-accent">
          {initials(t.name)}
        </span>
        <span>
          <span className="block text-sm font-medium text-espresso-900 transition-colors duration-300 group-hover:text-cream-50">
            {t.name}
          </span>
          {t.role && (
            <span className="block text-xs text-espresso-400 transition-colors duration-300 group-hover:text-cream-50/75">
              {t.role}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="bg-cream-100 py-10 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <SplitHeading
            as="h2"
            text="Ce que les clients de Myriam en disent"
            muted={["clients", "Myriam"]}
            className=""
          />
          <p className="mt-4 text-espresso-500">
            Témoignages recueillis auprès de participants aux formations et au programme de coaching de Myriam Perez.
          </p>
        </div>

      </div>

      {/* Bande défilante : pleine largeur, en dehors du conteneur centré */}
      <div className="marquee mt-12">
        <div className="marquee-track">
          {/* Les deux moitiés sont structurellement identiques : -50 % tombe
              donc exactement sur le début de la seconde copie. */}
          <div className="flex">
            {ORDERED.map((t, i) => (
              <Card key={`a-${t.name}-${i}`} t={t} />
            ))}
          </div>
          <div className="flex" aria-hidden>
            {ORDERED.map((t, i) => (
              <Card key={`b-${t.name}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
