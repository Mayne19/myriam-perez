import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import SplitHeading from "@/components/SplitHeading";
import FadeIn from "@/components/FadeIn";
import TestimonialsSection from "@/components/TestimonialsSection";
import { PROGRAM } from "@/data/content";

export const metadata: Metadata = {
  title: "À propos de Myriam Perez | Inspire & Impact",
};

export default function AProposMyriamPage() {
  return (
    <main>
      {/* Pourquoi choisir Inspire & Impact */}
      <section className="bg-cream-100 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
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
                  text="Pourquoi choisir Inspire & Impact"
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

          <ul className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAM.why.map((w, i) => (
              <FadeIn key={w.title} delay={i * 0.05}>
                <li className="flex gap-4">
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

      <TestimonialsSection />
    </main>
  );
}
