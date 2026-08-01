"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  ThumbsUp,
  Meh,
  ThumbsDown,
  User,
  Clock,
  Calendar,
  ArrowRight,
} from "lucide-react";
import type { Article } from "@/data/articles";
import { formatArticleDate } from "@/lib/blog-format";
import { buildArticleBody } from "@/lib/article-html";
import Accordion from "@/components/Accordion";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterBanner from "@/components/blog/NewsletterBanner";
import SplitHeading from "@/components/SplitHeading";
import { PROGRAM } from "@/data/content";

type ArticleViewProps = {
  article: Article;
  related: Article[];
};

export default function ArticleView({ article, related }: ArticleViewProps) {
  const { html, faq, headings } = useMemo(
    () => buildArticleBody(article.content, article.faq ?? null),
    [article.content, article.faq],
  );
  const bodyRef = useRef<HTMLDivElement>(null);
  const [activeHeading, setActiveHeading] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Boutons « copier » sur chaque bloc de code, ajoutés côté client.
  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    const pres = root.querySelectorAll("pre");
    pres.forEach((pre) => {
      if (pre.querySelector(".copy-code")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-code";
      button.textContent = "Copier";
      button.addEventListener("click", () => {
        const code = pre.querySelector("code");
        if (!code) return;
        navigator.clipboard.writeText(code.textContent ?? "");
        button.textContent = "Copié";
        setTimeout(() => (button.textContent = "Copier"), 2000);
      });
      pre.appendChild(button);
    });
  }, [html]);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHeading(entry.target.id);
        }
      },
      { rootMargin: "-100px 0px -75% 0px", threshold: 0 },
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const enc = encodeURIComponent;

  function copyPageLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[210px_minmax(0,1fr)_44px]">
          {/* Outline + carte infolettre */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-140px)] space-y-6 overflow-y-auto pr-2">
              {headings.length > 0 && (
                <nav>
                  <ul className="space-y-1 border-l border-espresso-900/10">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className={`no-underline block border-l-2 py-1 pl-4 text-sm leading-snug transition-colors ${
                            h.level === 3 ? "pl-8" : ""
                          } ${
                            activeHeading === h.id
                              ? "border-accent font-medium text-accent"
                              : "-ml-0.5 border-transparent text-espresso-400 hover:text-espresso-700"
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Pub pour la formation, à la place de la carte infolettre */}
              <div className="rounded-2xl bg-accent p-5">
                <p className="text-sm font-semibold leading-snug text-cream-50">
                  Formation de formateurs certifiés
                </p>
                <p className="mt-2 text-xs leading-relaxed text-cream-50/80">{PROGRAM.hook}</p>
                {/* Bouton propre à cette carte : peu arrondi, plein espresso, texte clair */}
                <Link
                  href="/programme"
                  className="no-underline group mt-4 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-espresso-900 px-4 py-2.5 text-center text-xs font-medium text-cream-50 transition-colors hover:bg-espresso-800 hover:text-cream-50"
                >
                  Voir le programme
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Article */}
          <article className="min-w-0">
            <Link
              href="/blog"
              className="no-underline inline-flex items-center gap-2 text-sm text-espresso-400 transition-colors hover:text-accent"
            >
              ← Blog
            </Link>

            <header className="mt-6">
              <span className="rounded-full bg-accent px-3 py-1 text-xs text-cream-50">
                {article.category}
              </span>
              <h1 className="mt-4 text-balance font-semibold text-espresso-900">{article.title}</h1>
              <p className="mt-4 text-xl leading-relaxed text-espresso-400">{article.excerpt}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-espresso-400">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-accent" />
                  <span className="text-espresso-700">{article.author}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-accent" />
                  <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-accent" />
                  {article.readingTime} min de lecture
                </span>
              </div>
            </header>

            {article.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="mt-10 aspect-video w-full rounded-3xl object-cover"
              />
            ) : (
              <div className="mt-10 flex aspect-video w-full items-center justify-center rounded-3xl bg-gradient-to-br from-accent/15 via-accent-bg to-cream-200">
                <span className="rounded-full border border-accent/30 bg-cream-50/80 px-4 py-1.5 text-xs text-accent">
                  {article.category}
                </span>
              </div>
            )}

            <div ref={bodyRef} className="article-body mt-8" dangerouslySetInnerHTML={{ __html: html }} />

            {/* Retour sur l'article — sobre mais avec un fond qui se distingue vraiment de la page */}
            <section className="mt-12 rounded-3xl border border-espresso-900/[0.08] bg-cream-200 px-6 py-10 text-center">
              <p className="text-sm font-medium text-espresso-700">
                Cet article vous a-t-il été utile ?
              </p>
              <div className="mt-4 flex items-center justify-center gap-6">
                {[
                  { value: "low", label: "Pas utile", Icon: ThumbsDown },
                  { value: "neutral", label: "Correct", Icon: Meh },
                  { value: "high", label: "Utile", Icon: ThumbsUp },
                ].map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    onClick={() => setFeedback(feedback === value ? null : value)}
                    aria-label={label}
                    className={`transition-all duration-200 ${
                      feedback === value
                        ? "scale-110 text-accent"
                        : feedback !== null
                          ? "opacity-30"
                          : "text-espresso-300 hover:scale-110 hover:text-accent"
                    }`}
                  >
                    <Icon className="h-8 w-8" strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </section>
          </article>

          {/* Partage */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col items-center gap-2">
              <span
                className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-espresso-300"
                style={{ writingMode: "vertical-lr" }}
              >
                Partager
              </span>
              <button
                onClick={copyPageLink}
                aria-label="Copier le lien"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/15 text-espresso-400 transition-colors hover:border-accent/50 hover:text-accent"
              >
                {copiedLink ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <a
                href={`https://x.com/intent/tweet?text=${enc(article.title)}&url=${enc(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Partager sur X"
                className="no-underline flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/15 text-espresso-400 transition-colors hover:border-accent/50 hover:text-accent"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Partager sur LinkedIn"
                className="no-underline flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/15 text-espresso-400 transition-colors hover:border-accent/50 hover:text-accent"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5.12 7.73H1.28v14.01h3.84V7.73ZM3.2 1.25C1.97 1.25.98 2.24.98 3.46s.99 2.22 2.22 2.22 2.22-.99 2.22-2.22S4.43 1.25 3.2 1.25Zm19.82 12.45c0-4.3-2.29-6.3-5.35-6.3-2.47 0-3.57 1.36-4.18 2.31h-.06V7.73H9.75v14.01h3.84v-6.93c0-1.83.35-3.6 2.61-3.6 2.23 0 2.26 2.08 2.26 3.72v6.81h3.84v-8.04Z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Partager sur Facebook"
                className="no-underline flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/15 text-espresso-400 transition-colors hover:border-accent/50 hover:text-accent"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.12 8.1h2.34V4.3c-.4-.05-1.79-.17-3.41-.17-3.38 0-5.69 2.06-5.69 5.85v3.29H4.54v4.25h3.82V24h4.62v-6.48h3.62l.57-4.25h-4.19v-2.87c0-1.23.33-2.3 2.14-2.3Z" />
                </svg>
              </a>
            </div>
          </aside>
        </div>

        {/* FAQ — en fin d'article */}
        {/* FAQ */}
        {faq.length > 0 && (
          <section className="py-16">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-16">
              <div>
                <SplitHeading as="h2" text="Questions fréquentes" muted={["fréquentes"]} />
                <p className="mt-3 text-base leading-relaxed text-espresso-400">
                  Réponses claires aux questions fréquentes sur ce sujet.
                </p>
              </div>
              <Accordion items={faq.map((f) => ({ q: f.question, a: f.answer }))} />
            </div>
          </section>
        )}

        <div className="pb-4 pt-4">
          <NewsletterBanner />
        </div>

        {/* Articles similaires */}
        {related.length > 0 && (
          <section className="py-16">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-16">
              <div>
                <SplitHeading as="h2" text="Articles similaires" muted={["similaires"]} />
                <p className="mt-3 text-base leading-relaxed text-espresso-400">
                  Poursuivre la lecture dans la catégorie {article.category}.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {related.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
  );
}
