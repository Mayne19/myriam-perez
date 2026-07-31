import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles, Clock, BadgeCheck, Building2, BookOpen } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SplitHeading from "@/components/SplitHeading";
import FadeIn from "@/components/FadeIn";
import Button from "@/components/Button";
import { ABOUT, PROGRAM, PROGRAM_DETAIL } from "@/data/content";
import { CALENDLY_URL } from "@/data/nav";

export const metadata: Metadata = {
  title: "À propos de Myriam Perez | Inspire & Impact",
};

/* Mosaïque de la section formatrice : chaque tuile a sa propre teinte */
const TRAINER_TILES = [
  {
    Icon: Clock,
    // Même couleur que le fond de la page : la bordure et l'ombre suffisent
    // à la détacher comme une carte, sans lui donner de teinte propre.
    card: "border border-espresso-900/[0.06] bg-cream-50 shadow-[0_20px_50px_-26px_rgba(38,34,30,0.3)]",
    iconColor: "text-espresso-700",
    text: "text-espresso-900",
    dark: false,
  },
  {
    Icon: BadgeCheck,
    card: "bg-espresso-900",
    iconColor: "text-accent",
    text: "text-cream-50",
    dark: true,
  },
  {
    Icon: Building2,
    card: "bg-accent",
    iconColor: "text-cream-50/80",
    text: "text-cream-50",
    dark: false,
  },
  {
    Icon: BookOpen,
    card: "border border-espresso-900/[0.06] bg-white shadow-[0_30px_70px_-30px_rgba(38,34,30,0.3)]",
    iconColor: "text-accent",
    text: "text-espresso-900",
    dark: false,
  },
] as const;

export default function AProposPage() {
  return (
    <main>
      <PageHeader eyebrow="À propos" title={ABOUT.title} muted={["de", "myriam"]} />

      {/*
        Colonne unique : un premier paragraphe d'introduction, puis la photo,
        grande et centrée, puis tout le reste (paragraphes, citation, bouton).
      */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <FadeIn>
          <p className="text-xl leading-relaxed text-espresso-700">{ABOUT.paragraphs[0]}</p>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-10">
          {/* Pas de padding en bas : la photo doit toucher le bas du bloc, comme partout ailleurs sur le site. */}
          <div data-section-theme="dark" className="overflow-hidden rounded-[32px] bg-espresso-900 px-6 pt-6">
            <Image
              src="/images/myriam.png"
              alt="Myriam Perez"
              width={680}
              height={840}
              sizes="(min-width: 640px) 384px, 90vw"
              className="portrait-fade mx-auto block h-auto w-full max-w-sm object-cover object-top"
            />
          </div>
        </FadeIn>

        <div className="mt-12 space-y-6">
          {ABOUT.paragraphs.slice(1).map((p, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <p className="text-xl leading-relaxed text-espresso-700">{p}</p>
            </FadeIn>
          ))}

          <FadeIn delay={0.35}>
            <blockquote className="relative overflow-hidden rounded-2xl bg-accent/[0.08] py-6 pl-[clamp(132px,16%,168px)] pr-7 text-lg font-medium italic leading-relaxed text-espresso-500 max-[860px]:px-5 max-[860px]:py-[18px]">
              <span
                aria-hidden
                className="pointer-events-none absolute left-7 top-6 select-none rotate-[8deg] font-serif text-[160px] leading-[0.8] text-accent opacity-10"
              >
                {"\u275E"}
              </span>
              « {ABOUT.closing} »
            </blockquote>
          </FadeIn>

          <FadeIn delay={0.45} className="pt-4 text-center">
            <Button href={CALENDLY_URL} external variant="primary">
              Réserver un appel
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Formatrice — composition en mosaïque */}
      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-24">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* Colonne gauche : titre, texte, puis visuel */}
          <div className="flex flex-col gap-5">
            <FadeIn>
              <SplitHeading
                as="h2"
                text={PROGRAM.trainer.lead}
                muted={["est", "formatrice", "agréée", "coach", "auteure", "entrepreneure", "et", "fondatrice"]}
              />
              <p className="mt-5 text-lg leading-relaxed text-espresso-500">{PROGRAM.trainer.desc}</p>
            </FadeIn>

            <FadeIn
              delay={0.1}
              sectionTheme="dark"
              className="flex-1 overflow-hidden rounded-3xl bg-espresso-900"
            >
              <Image
                src="/images/myriam.png"
                alt="Myriam Perez"
                width={2400}
                height={1600}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-full w-full object-cover"
              />
            </FadeIn>
          </div>

          {/* Colonne droite : mosaïque des qualifications */}
          <div className="grid gap-5 sm:grid-cols-2">
            {PROGRAM.trainer.qualifications.map((q, i) => {
              const s = TRAINER_TILES[i];
              const Icon = s.Icon;
              return (
                <FadeIn
                  key={q}
                  delay={i * 0.06}
                  sectionTheme={s.dark ? "dark" : undefined}
                  className={`flex flex-col justify-between rounded-3xl p-7 ${s.card}`}
                >
                  <Icon className={`h-8 w-8 ${s.iconColor}`} strokeWidth={1.5} />
                  <p className={`mt-10 text-lg font-medium leading-snug ${s.text}`}>{q}</p>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pourquoi choisir Myriam Perez Inc. */}
      <section className="mx-auto max-w-3xl px-6">
        <FadeIn>
          <SplitHeading
            as="h2"
            text={PROGRAM_DETAIL.whyHer.title}
            muted={["choisir"]}
            className=""
          />
        </FadeIn>
        <div className="mt-8 space-y-6">
          {PROGRAM_DETAIL.whyHer.paragraphs.map((p, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <p className="text-lg leading-relaxed text-espresso-600">{p}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Pourquoi Inspire & Impact — bloc coloré + image, puis liste à puces */}
      <section className="bg-cream-100 py-10 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* Bloc orange étroit à gauche, image large à droite */}
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
            <FadeIn
              className="flex min-h-[340px] flex-col justify-between rounded-3xl bg-accent p-8 sm:p-10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-50/20">
                <Sparkles className="h-6 w-6 text-cream-50" strokeWidth={1.75} />
              </span>
              <div className="mt-12">
                <p className="text-xs font-medium tracking-[0.2em] text-cream-50/80">
                  Ce qui fait la différence
                </p>
                <SplitHeading
                  as="h2"
                  text="Pourquoi me choisir"
                  muted={["Inspire", "Impact"]}
                  className="mt-4"
                  boldClassName="text-cream-50"
                  mutedOpacity={0.55}
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.08} className="min-h-[340px] overflow-hidden rounded-3xl">
              <Image
                src="/images/pourquoi-choisir.jpg"
                alt="Une formatrice animant une séance auprès d'un groupe de professionnels"
                width={1916}
                height={821}
                sizes="(min-width: 1024px) 700px, 100vw"
                className="h-full w-full object-cover"
              />
            </FadeIn>
          </div>

          {/* Les six raisons, en liste à puces sur toute la largeur : 3 par ligne */}
          <ul className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAM.why.map((w, i) => (
              <FadeIn key={w.title} delay={i * 0.05}>
                <li className="flex gap-4">
                  {/* Centré sur la première ligne : (24 px de hauteur de ligne − 8 px de puce) / 2 */}
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="block font-medium leading-6 text-espresso-900">{w.title}</span>
                    <span className="mt-1 block text-base leading-relaxed text-espresso-500">{w.desc}</span>
                  </span>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
