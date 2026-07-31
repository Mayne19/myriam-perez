import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import FadeIn from "@/components/FadeIn";
import { CONTACT } from "@/data/content";
import { FIELD_CLASSES } from "@/lib/fields";

export const metadata: Metadata = {
  title: "Contact | Myriam Perez — Inspire & Impact",
};

export default function ContactPage() {
  return (
    <main>
      <PageHeader eyebrow="Contact" title={CONTACT.title} muted={["myriam"]} subtitle={CONTACT.intro} />

      <section className="mx-auto max-w-2xl px-6 pb-20">
        <FadeIn>
          <form className="space-y-5 rounded-3xl border border-espresso-900/[0.08] bg-cream-100 p-8">
            <div className="flex gap-4">
              <div className="w-full">
                <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-espresso-700">
                  Prénom <span className="text-accent">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className={FIELD_CLASSES}
                  placeholder="Votre prénom"
                />
              </div>
              <div className="w-full">
                <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-espresso-700">
                  Nom <span className="text-accent">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className={FIELD_CLASSES}
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-espresso-700">
                Courriel <span className="text-accent">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={FIELD_CLASSES}
                placeholder="vous@courriel.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-espresso-700">
                Message <span className="text-accent">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className={`resize-none ${FIELD_CLASSES}`}
                placeholder="Parlez-moi de votre parcours ou de votre projet de formation"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark"
            >
              {CONTACT.submit}
            </button>

            <p className="text-xs text-espresso-400">
              <span className="text-accent">*</span> Champs obligatoires
            </p>
            <p className="text-base text-espresso-500">{CONTACT.followUp}</p>
          </form>
        </FadeIn>

        <FadeIn delay={0.15} sectionTheme="dark" className="mt-8 rounded-2xl bg-espresso-900 p-6 text-center text-sm text-cream-100/70">
          {CONTACT.agrement}
        </FadeIn>
      </section>
    </main>
  );
}
