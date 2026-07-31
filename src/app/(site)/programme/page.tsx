import type { Metadata } from "next";
import Image from "next/image";
import {
  Lightbulb,
  LayoutGrid,
  MessagesSquare,
  Target,
  Mic,
  ClipboardList,
  Users,
  TrendingUp,
  Sparkles,
  BadgeCheck,
  Briefcase,
  Compass,
  MonitorPlay,
  RefreshCw,
  Handshake,
  Check,
  X,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SplitHeading from "@/components/SplitHeading";
import FadeIn from "@/components/FadeIn";
import FaqSection from "@/components/FaqSection";
import Button from "@/components/Button";
import PaymentDrawer from "@/components/PaymentDrawer";
import RecognizeSection from "@/components/RecognizeSection";
import TransformationSection from "@/components/TransformationSection";
import { PROGRAM, PROGRAM_DETAIL } from "@/data/content";
import { CALENDLY_URL } from "@/data/nav";

export const metadata: Metadata = {
  title: PROGRAM.metaTitle,
};

// Mots à estomper pour chacun des deux titres de PROGRAM.structure.formats.
const FORMAT_TITLE_MUTED = [["5"], ["des", "en", "dès"]];

/*
  Habillage des 4 étapes de la méthode : une carte claire, une orange,
  une sombre, une claire — pour créer le contraste des références sans
  saturer la page de couleur.
*/
const METHOD_STYLES = [
  {
    Icon: Lightbulb,
    card: "border border-espresso-900/[0.06] bg-cream-50 shadow-[0_12px_32px_-18px_rgba(38,34,30,0.22)]",
    number: "text-accent",
    iconColor: "text-accent",
    title: "text-espresso-900",
    desc: "text-espresso-500",
    dark: false,
  },
  {
    Icon: LayoutGrid,
    card: "bg-accent",
    number: "text-cream-50",
    iconColor: "text-cream-50/70",
    title: "text-cream-50",
    desc: "text-cream-50/80",
    dark: false,
  },
  {
    Icon: MessagesSquare,
    card: "bg-espresso-900",
    number: "text-accent",
    iconColor: "text-cream-50/50",
    title: "text-cream-50",
    desc: "text-cream-100/70",
    dark: true,
  },
  {
    Icon: Target,
    card: "border border-espresso-900/[0.06] bg-white shadow-[0_12px_32px_-18px_rgba(38,34,30,0.22)]",
    number: "text-accent",
    iconColor: "text-accent",
    title: "text-espresso-900",
    desc: "text-espresso-500",
    dark: false,
  },
] as const;

/* Une icône par formation, dans l'ordre du parcours */
const FORMATION_ICONS = [Mic, ClipboardList, Users, TrendingUp, Sparkles] as const;

/* Une icône par profil, dans l'ordre de la liste « À qui s'adresse » */
const FIT_FOR_ICONS = [Briefcase, Users, Compass, MonitorPlay, RefreshCw, Handshake] as const;

export default function ProgrammePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Programme de formation — 135 h"
        title={PROGRAM.hook}
        muted={["expertise", "formation", "professionnelle"]}
        subtitle={PROGRAM.intro}
      />

      <div className="flex justify-center pb-16">
        <Button href={CALENDLY_URL} external variant="primary">
          Réserver un appel
        </Button>
      </div>

      <RecognizeSection />

      {/* Le problème : l'absence de structure */}
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <FadeIn>
          <SplitHeading
            as="h2"
            text={PROGRAM_DETAIL.problem.title}
            muted={["réelle,", "transmettre"]}
            className=""
          />
          <p className="mt-6 text-lg leading-relaxed text-espresso-600">{PROGRAM_DETAIL.problem.intro}</p>
        </FadeIn>
      </section>


      <TransformationSection />


      {/* Méthode Inspire & Impact */}
      <section className="bg-cream-100 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn>
            <SplitHeading
              as="h2"
              text="La méthode Inspire & Impact"
              muted={["méthode", "Inspire", "Impact"]}
              className="text-center"
            />
          </FadeIn>
          {/* Grille 2 × 2 : gros numéro, icône, titre, description */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {PROGRAM.method.map((m, i) => {
              const s = METHOD_STYLES[i];
              const Icon = s.Icon;
              return (
                <FadeIn
                  key={m.step}
                  delay={i * 0.08}
                  className={`rounded-3xl p-8 sm:p-10 ${s.card}`}
                  sectionTheme={s.dark ? "dark" : undefined}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`text-6xl font-medium leading-none tracking-tight sm:text-7xl ${s.number}`}>
                      0{i + 1}
                    </span>
                    <Icon className={`h-8 w-8 shrink-0 ${s.iconColor}`} strokeWidth={1.5} />
                  </div>
                  <p className={`mt-10 text-xl font-medium ${s.title}`}>{m.step}</p>
                  <p className={`mt-2 text-base leading-relaxed ${s.desc}`}>{m.desc}</p>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>


      {/* À qui s'adresse — titre 25 % / mosaïque décalée 75 % */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-24">
          {/* Colonne titre — 25 % */}
          <FadeIn className="lg:sticky lg:top-28 lg:self-start">
            <SplitHeading
              as="h2"
              text="À qui s'adresse l'accompagnement"
              muted={["s'adresse", "accompagnement"]}
              className=""
            />
          </FadeIn>

          {/*
            Colonne mosaïque — 75 %.
            Trois colonnes indépendantes de deux blocs chacune : la hauteur des
            six blocs est identique et l'écart interne aussi. Seule la colonne
            du milieu démarre plus bas — les colonnes 1 et 3 restent alignées
            entre elles, en haut comme en bas.
          */}
          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((col) => (
              <div key={col} className={`flex flex-col gap-5 ${col === 1 ? "lg:mt-16" : ""}`}>
                {PROGRAM.fitFor.slice(col * 2, col * 2 + 2).map((item, j) => {
                  const index = col * 2 + j;
                  const Icon = FIT_FOR_ICONS[index];
                  return (
                    <FadeIn
                      key={item}
                      delay={index * 0.06}
                      className="rounded-3xl border border-espresso-900/[0.08] bg-cream-50 p-7 shadow-[0_10px_30px_-22px_rgba(38,34,30,0.4)] lg:h-[300px]"
                    >
                      {/* Pastille d'icône, comme sur la référence */}
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-bg">
                        <Icon className="h-6 w-6 text-accent" strokeWidth={1.75} />
                      </span>
                      <p className="mt-6 text-base leading-relaxed text-espresso-700">{item}</p>
                    </FadeIn>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ce programme n'est pas pour vous si */}
      <section className="mx-auto max-w-3xl px-6 pb-16 sm:pb-24">
        <FadeIn className="rounded-3xl border border-espresso-900/[0.08] bg-cream-100 p-8 sm:p-10">
          <SplitHeading as="h3" text={PROGRAM_DETAIL.notForYou.title} muted={["ce", "pas", "pour", "vous", "si"]} />
          <ul className="mt-6 space-y-3">
            {PROGRAM_DETAIL.notForYou.items.map((item) => (
              <li key={item} className="flex gap-3 text-espresso-600">
                <X className="mt-1 h-4 w-4 shrink-0 text-espresso-300" strokeWidth={2.5} />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>

      {/* Les 5 formations — grille de cartes, titre intégré dans la première case */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Première case : titre + bouton, comme dans la référence */}
          <FadeIn className="flex flex-col justify-center px-2 py-4 sm:px-4">
            <SplitHeading
              as="h2"
              text="Le parcours complet — 135 heures"
              muted={["parcours", "complet"]}
              className=""
            />
            <div className="mt-8">
              <Button href={CALENDLY_URL} external variant="primary">
                Réserver un appel
              </Button>
            </div>
          </FadeIn>

          {PROGRAM.formations.map((f, i) => {
            // "Formation 1 — Prise de parole…" → étiquette + intitulé
            const [label, ...rest] = f.title.split(" — ");
            const name = rest.join(" — ");
            const Icon = FORMATION_ICONS[i];
            // La première carte est mise en avant, comme la carte sombre de la référence
            const featured = i === 0;

            return (
              <FadeIn
                key={f.title}
                delay={i * 0.06}
                sectionTheme={featured ? "dark" : undefined}
                className={`flex flex-col rounded-3xl p-7 ${
                  featured
                    ? // Carte mise en avant : légèrement inclinée, comme dans la référence
                      "bg-espresso-900 shadow-[0_18px_40px_-20px_rgba(38,34,30,0.55)] sm:-rotate-2"
                    : "border border-espresso-900/[0.08] bg-cream-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 shrink-0 ${featured ? "text-accent" : "text-accent"}`}
                    strokeWidth={1.75}
                  />
                  <span
                    className={`text-xs font-medium tracking-[0.12em] ${
                      featured ? "text-cream-100/60" : "text-espresso-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>

                <p className={`mt-4 text-lg font-medium ${featured ? "text-cream-50" : "text-espresso-900"}`}>
                  {name}
                </p>
                <p
                  className={`mt-3 text-base leading-relaxed ${
                    featured ? "text-cream-100/70" : "text-espresso-500"
                  }`}
                >
                  {f.desc}
                </p>
              </FadeIn>
            );
          })}
        </div>
      </section>


      {/* Ce que comprend le programme + résultats à la fin */}
      <section className="bg-cream-100 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <FadeIn>
              <SplitHeading
                as="h2"
                text={PROGRAM_DETAIL.includes.title}
                muted={["comprend", "complet"]}
                className=""
              />
            </FadeIn>
            <ul className="mt-8 space-y-3">
              {PROGRAM_DETAIL.includes.items.map((item, i) => (
                <FadeIn key={item} delay={i * 0.04}>
                  <li className="flex gap-3 text-espresso-600">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                </FadeIn>
              ))}
            </ul>
            <FadeIn delay={0.3}>
              <p className="mt-8 text-lg leading-relaxed text-espresso-900">
                {PROGRAM_DETAIL.includes.closing}
              </p>
            </FadeIn>
          </div>

          <div>
            <FadeIn>
              <SplitHeading
                as="h2"
                text={PROGRAM_DETAIL.outcomes.title}
                muted={["mesure"]}
                className=""
              />
            </FadeIn>
            <ul className="mt-8 space-y-3">
              {PROGRAM_DETAIL.outcomes.items.map((item, i) => (
                <FadeIn key={item} delay={i * 0.04}>
                  <li className="flex gap-4">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <span className="leading-relaxed text-espresso-600">{item}</span>
                  </li>
                </FadeIn>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Comment se déroule le programme */}
      <section data-section-theme="dark" className="bg-espresso-900 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn>
            <SplitHeading
              as="h2"
              text="Comment se déroule le programme"
              muted={["déroule", "programme"]}
              className="text-center text-cream-50"
              boldClassName="text-cream-50"
              mutedOpacity={0.4}
            />
          </FadeIn>

          {/* Photo (formation en direct) + bloc dégradé avec repère factuel (agrément CPMT) */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <FadeIn className="min-h-[320px] overflow-hidden rounded-3xl">
              <Image
                src="/images/formation-en-direct.jpg"
                alt="Une formatrice animant une session en direct devant un groupe"
                width={1900}
                height={1268}
                className="h-full w-full object-cover"
              />
            </FadeIn>

            <FadeIn
              delay={0.08}
              className="relative min-h-[320px] overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#F07020_0%,#D8B15B_55%,#C05A18_100%)] p-8"
            >
              {/* max-w en "ch" (largeur de caractère) : tient sur 2 lignes quelle que soit la taille h3 */}
              <SplitHeading
                as="h3"
                text="Un parcours structuré, du premier module à la certification."
                muted={["un", "du", "premier", "module", "à", "la"]}
                boldClassName="text-cream-50"
                className="text-balance max-w-[27ch]"
              />

              {/* Repère factuel, comme le badge flottant de la référence */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-2xl bg-cream-50 px-4 py-3 shadow-[0_10px_30px_-12px_rgba(38,34,30,0.5)]">
                <BadgeCheck className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.75} />
                <p className="text-sm font-medium text-espresso-900">Organisme de formation agréé CPMT</p>
              </div>
            </FadeIn>
          </div>

          {/*
            Sous-titre court à gauche, tous les détails à droite —
            aucune redite entre les deux colonnes.
          */}
          <div className="mt-14 grid gap-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-16">
            <FadeIn delay={0.15}>
              <SplitHeading
                as="h3"
                text={PROGRAM.structure.subtitle}
                muted={["deux", "complémentaires", "la"]}
                boldClassName="text-cream-50"
              />
            </FadeIn>

            <div className="space-y-8">
              {PROGRAM.structure.formats.map((f, i) => (
                <FadeIn key={f.title} delay={0.2 + i * 0.06}>
                  <SplitHeading
                    as="h3"
                    text={f.title}
                    muted={FORMAT_TITLE_MUTED[i] ?? []}
                    boldClassName="text-cream-50"
                  />
                  <div className="mt-2 space-y-6">
                    {f.desc.map((p) => (
                      <p key={p} className="text-base leading-relaxed text-cream-100/70">
                        {p}
                      </p>
                    ))}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi maintenant ? */}
      <section data-section-theme="dark" className="bg-espresso-900 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <FadeIn>
            <SplitHeading
              as="h2"
              text={PROGRAM_DETAIL.whyNow.title}
              muted={["maintenant"]}
              className="text-cream-50"
              boldClassName="text-cream-50"
              mutedOpacity={0.4}
            />
          </FadeIn>
          <div className="mt-8 space-y-6">
            {PROGRAM_DETAIL.whyNow.paragraphs.map((p, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <p className="text-lg leading-relaxed text-cream-100/80">{p}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Comparaison : rester au statu quo, ou investir dans le programme */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <FadeIn>
          <SplitHeading
            as="h2"
            text="Deux chemins possibles"
            muted={["chemins"]}
            className="text-center"
          />
        </FadeIn>

        <div className="mt-12 grid items-start gap-5 lg:grid-cols-2">
          {/* Carte statu quo — fond clair, sans appel à l'action. Hauteur libre : elle s'arrête où son contenu s'arrête. */}
          <FadeIn className="flex flex-col rounded-3xl border border-espresso-900/[0.08] bg-cream-50 p-8">
            <SplitHeading as="h3" text={PROGRAM.comparison.stayPut.title} muted={["avec", "ce", "que", "vous", "avez"]} />
            <p className="mt-6 text-4xl font-medium tracking-tight text-espresso-900">
              {PROGRAM.comparison.stayPut.amount}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-espresso-500">{PROGRAM.comparison.stayPut.note}</p>

            <ul className="mt-8 space-y-3">
              {PROGRAM.comparison.stayPut.items.map((item) => (
                <li key={item} className="flex gap-3 text-espresso-500">
                  <X className="mt-1 h-4 w-4 shrink-0 text-espresso-300" strokeWidth={2.5} />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Carte investissement — dégradé orange déjà utilisé ailleurs sur le site */}
          <FadeIn
            delay={0.08}
            sectionTheme="dark"
            className="flex flex-col rounded-3xl bg-[linear-gradient(135deg,#F07020_0%,#C05A18_100%)] p-8"
          >
            <SplitHeading
              as="h3"
              text={PROGRAM.comparison.invest.title}
              muted={["votre", "enfin"]}
              boldClassName="text-cream-50"
            />
            <p className="mt-6 text-4xl font-medium tracking-tight text-cream-50">
              {PROGRAM.comparison.invest.amount}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream-50/80">{PROGRAM.comparison.invest.note}</p>

            <ul className="mt-8 space-y-3">
              {PROGRAM.comparison.invest.items.map((item) => (
                <li key={item} className="flex gap-3 text-cream-50">
                  <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={2.5} />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <PaymentDrawer
                label={PROGRAM.comparison.invest.cta}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-cream-50/50 px-6 py-3.5 text-sm font-medium text-cream-50 transition-colors duration-300 hover:bg-cream-50 hover:text-accent"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection
        title="Questions fréquentes"
        titleMuted={["fréquentes"]}
        subtitle="Tout ce qu'il faut savoir sur le programme et la certification."
        items={PROGRAM.faq}
      />

      {/* Prochaine étape */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <FadeIn className="rounded-[40px] bg-espresso-900 px-8 py-12 text-center sm:px-16" sectionTheme="dark">
          <SplitHeading
            as="h2"
            text={PROGRAM.nextStep.title}
            muted={["projet", "formation"]}
            className=""
            boldClassName="text-cream-50"
          />
          <p className="mx-auto mt-4 max-w-xl text-cream-100/70">{PROGRAM.nextStep.desc}</p>
          <ul className="mx-auto mt-6 max-w-xl space-y-2 text-left text-cream-100/80">
            {PROGRAM.nextStep.points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={CALENDLY_URL} external variant="primary">
              Réserver un appel
            </Button>
          </div>
          <p className="mt-4 text-xs text-cream-100/40">{PROGRAM.nextStep.note}</p>
        </FadeIn>
      </section>
    </main>
  );
}

