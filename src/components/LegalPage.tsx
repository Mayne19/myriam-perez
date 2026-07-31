"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BadgeCheck,
  Calendar,
  Copyright,
  FileCheck2,
  FileText,
  FolderOpen,
  LifeBuoy,
  Lightbulb,
  Mail,
  Shield,
  ShieldCheck,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { LegalSection } from "@/data/legal";
import SplitHeading from "./SplitHeading";

const SECTION_ICONS: Record<string, LucideIcon> = {
  "formations-reconnues": BadgeCheck,
  "engagement-confidentialite": ShieldCheck,
  "utilisation-renseignements": FolderOpen,
  "exactitude-informations": FileCheck2,
  "restriction-age": Users,
  "securite-donnees": Shield,
  "support-client": LifeBuoy,
  "avertissement-medical-legal": Lightbulb,
  "droits-auteur": Copyright,
  "entente-confidentialite": Video,
  "politique-remboursement": Calendar,
  "informations-complementaires": Mail,
};

type LegalPageProps = {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  sections: LegalSection[];
  children?: ReactNode;
};

export default function LegalPage({ title, subtitle, lastUpdated, sections, children }: LegalPageProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const clicking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (clicking.current) return;
      const elements = sections
        .map((s) => document.getElementById(s.id))
        .filter((el): el is HTMLElement => Boolean(el));
      const offset = 140;
      let current = elements[0]?.id ?? "";
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= offset) current = el.id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:pb-32 md:pt-24 lg:px-10">
      <header className="mx-auto mb-12 max-w-4xl text-center md:mb-16">
        <SplitHeading
          as="h1"
          text={title}
          muted={["et", "responsabilité", "du", "client"]}
          className="text-balance"
        />
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-espresso-500">{subtitle}</p>
        )}
        {lastUpdated && <p className="mt-3 text-sm text-espresso-400">{lastUpdated}</p>}
      </header>

      <div className="grid items-start gap-6 md:grid-cols-[280px_minmax(0,1fr)] md:gap-12">
        {/* Sommaire : sticky à gauche sur desktop, simple rangée scrollable sur mobile */}
        <aside className="flex gap-x-5 overflow-x-auto pb-2 md:sticky md:top-28 md:flex-col md:gap-0 md:overflow-visible md:pb-0">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              data-active={section.id === activeId ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setActiveId(section.id);
                clicking.current = true;
                document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                setTimeout(() => {
                  clicking.current = false;
                }, 1200);
              }}
              className="no-underline whitespace-nowrap text-sm font-medium leading-relaxed text-espresso-400 transition-colors hover:text-espresso-900 data-[active=true]:font-semibold data-[active=true]:text-accent md:w-full md:whitespace-normal md:border-l-2 md:border-espresso-900/10 md:py-[7px] md:pl-3 md:hover:border-accent md:hover:text-espresso-900 md:data-[active=true]:border-accent md:data-[active=true]:text-espresso-900"
            >
              {section.title}
            </a>
          ))}
        </aside>

        {/* Cartes blanches empilées */}
        <div className="space-y-2.5">
          {sections.map((section) => {
            const Icon = SECTION_ICONS[section.id] ?? FileText;
            return (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-32 rounded-2xl border border-espresso-900/[0.06] bg-white px-6 py-7 md:px-7"
              >
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center text-accent" aria-hidden="true">
                  <Icon size={32} strokeWidth={1.4} />
                </span>
                <h2 className="mb-5 text-espresso-900">{section.title}</h2>
                {section.intro && (
                  <p className="mb-5 text-lg leading-relaxed text-espresso-500">{section.intro}</p>
                )}
                {section.paragraphs?.map((p) => (
                  <p key={p} className="mb-2.5 text-base leading-relaxed text-espresso-600">
                    {p}
                  </p>
                ))}
                {section.email && (
                  <a
                    href={`mailto:${section.email}`}
                    className="inline-block transition-colors"
                  >
                    {section.email}
                  </a>
                )}
                {section.items?.length ? (
                  <ul className="mt-2 list-disc space-y-1.5 pl-[22px] text-base leading-relaxed text-espresso-600 marker:text-accent">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.subsections?.map((subsection) => (
                  <section key={subsection.id} className="py-4">
                    <h3 className="mb-2 text-espresso-900">{subsection.title}</h3>
                    {subsection.paragraphs?.map((p) => (
                      <p key={p} className="mb-2.5 text-base leading-relaxed text-espresso-600">
                        {p}
                      </p>
                    ))}
                    {subsection.items?.length ? (
                      <ul className="mt-2 list-disc space-y-1.5 pl-[22px] text-base leading-relaxed text-espresso-600 marker:text-accent">
                        {subsection.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </article>
            );
          })}

          {children}
        </div>
      </div>
    </div>
  );
}
