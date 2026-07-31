import { Check, X } from "lucide-react";
import FadeIn from "./FadeIn";
import SplitHeading from "./SplitHeading";
import { PROGRAM } from "@/data/content";

/*
  « La transformation proposée ».
  Deux colonnes : « Avant », simple et en retrait, et « Après », une carte
  surélevée bien plus large qui domine visuellement — chaque ligne des deux
  colonnes correspond à la même transformation.
  Composant partagé — utilisé à l'identique sur l'accueil et sur la page Formation.
*/
export default function TransformationSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:py-24">
      <FadeIn>
        <SplitHeading
          as="h2"
          text="La transformation proposée"
          muted={["transformation"]}
          className="text-center"
        />
      </FadeIn>

      {/*
        Les deux tableaux sont côte à côte, chacun en largeur `auto` (juste
        ce qu'il faut pour tenir sur une seule ligne, même police, même
        taille), séparés par un vrai espace — jamais de chevauchement — puis
        centrés ensemble sur la page.
      */}
      <div className="mx-auto mt-14 w-full sm:w-fit sm:grid sm:grid-cols-[auto_auto] sm:gap-10">
        {/* Avant : simple, en retrait */}
        <div className="pt-5 sm:pt-6">
          <p className="pb-3 text-xs font-medium uppercase tracking-[0.14em] text-espresso-400">Avant</p>
          <div className="divide-y divide-espresso-900/[0.06]">
            {PROGRAM.transformation.map((row, i) => (
              <FadeIn key={row.before} delay={i * 0.05} className="flex min-h-[3.75rem] items-center gap-3 py-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-espresso-900/5 text-espresso-400">
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <p className="text-base leading-snug text-espresso-400 sm:whitespace-nowrap">{row.before}</p>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Après : la carte principale, mise en valeur mais sans chevaucher l'autre tableau */}
        <FadeIn
          delay={0.1}
          className="relative rounded-3xl border border-espresso-900/[0.06] bg-white p-5 shadow-[0_30px_70px_-30px_rgba(38,34,30,0.3)]"
        >
          <p className="pb-3 text-xs font-medium uppercase tracking-[0.14em] text-accent">Après</p>
          <div className="divide-y divide-espresso-900/[0.06]">
            {PROGRAM.transformation.map((row, i) => (
              <FadeIn
                key={row.after}
                delay={i * 0.05}
                className="flex min-h-[3.75rem] items-center gap-3 py-2.5"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <p className="text-base font-medium leading-snug text-espresso-900 sm:whitespace-nowrap">{row.after}</p>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
