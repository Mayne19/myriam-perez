import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SplitHeading from "@/components/SplitHeading";
import FadeIn from "@/components/FadeIn";
import { TESTIMONIALS } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Témoignages | Myriam Perez — Inspire & Impact",
};

function Group({ title, muted, items }: { title: string; muted: string[]; items: typeof TESTIMONIALS }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <SplitHeading
        as="h2"
        text={title}
        muted={muted}
        className=""
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {items.map((t, i) => (
          <FadeIn
            key={t.name + i}
            delay={(i % 4) * 0.06}
            className="rounded-2xl border border-espresso-900/[0.08] bg-cream-50 p-6"
          >
            <blockquote className="text-espresso-700">“{t.quote}”</blockquote>
            <p className="mt-4 text-sm font-medium text-espresso-900">{t.name}</p>
            {t.role && <p className="text-xs text-espresso-400">{t.role}</p>}
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

export default function TemoignagesPage() {
  const formation = TESTIMONIALS.filter((t) => t.category === "formation");
  const coaching = TESTIMONIALS.filter((t) => t.category === "coaching");

  return (
    <main>
      <PageHeader
        eyebrow="Témoignages"
        title="Des mots de celles et ceux qu'elle a accompagnés"
        muted={["mots", "accompagnés"]}
      />
      <Group title="Témoignages des formations et de l'accompagnement" muted={["formations", "accompagnement"]} items={formation} />
      <Group title="Témoignages du programme de coaching" muted={["programme", "coaching"]} items={coaching} />
    </main>
  );
}
