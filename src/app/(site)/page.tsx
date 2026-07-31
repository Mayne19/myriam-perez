import Hero from "@/components/Hero";
import SplitHeading from "@/components/SplitHeading";
import Button from "@/components/Button";
import FadeIn from "@/components/FadeIn";
import RecognizeSection from "@/components/RecognizeSection";
import TransformationSection from "@/components/TransformationSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { HOME, STATS, PROGRAM } from "@/data/content";
import { CALENDLY_URL } from "@/data/nav";
import { Lightbulb, LayoutGrid, MessagesSquare, Target } from "lucide-react";

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

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Preuves sociales */}
      <section className="bg-cream-50 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <FadeIn>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-12">
              <SplitHeading
                as="h2"
                text="Formation de formateurs certifiés au Québec"
                muted={["Formation", "formateurs", "certifiés"]}
                className="pt-1 text-[1.75rem] font-medium leading-snug lg:text-4xl"
              />
              <div>
                <p className="text-lg leading-relaxed text-espresso-600">
                  Vous êtes coach, consultant, expert ou responsable RH. Vous avez accumulé des années d&apos;expérience et des résultats concrets, mais transformer cette expertise en formation claire, crédible et vendable reste difficile. Inspire &amp; Impact vous accompagne avec une méthode éprouvée, une posture de formateur assumée et un accès direct au marché corporatif québécois.
                </p>
                <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-10 sm:mt-12 lg:grid-cols-4">
                  {STATS.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-3xl font-medium tracking-tight text-espresso-900 sm:text-4xl">{stat.value}</p>
                      <p className="mt-3 text-sm font-medium text-accent">{stat.label}</p>
                      <p className="mt-1 text-base leading-relaxed text-espresso-400">{stat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <RecognizeSection />

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

      <TestimonialsSection />

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <FadeIn className="rounded-[40px] bg-espresso-900 px-8 py-12 text-center sm:px-16 sm:py-16" sectionTheme="dark">
          <SplitHeading
            as="h2"
            text="Parlons de votre projet de formation"
            muted={["projet", "formation"]}
            className="mx-auto max-w-2xl text-cream-50"
            boldClassName="text-cream-50"
            mutedOpacity={0.4}
          />
          <p className="mx-auto mt-5 max-w-xl text-cream-100/70">
            Réservez une rencontre exploratoire de 15 minutes, sans engagement, pour clarifier votre projet et le
            parcours qui vous correspond.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href={CALENDLY_URL} external variant="primary">
              {HOME.ctaMeeting}
            </Button>
            <Button href="/programme" variant="secondary">
              {HOME.ctaProgram}
            </Button>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
