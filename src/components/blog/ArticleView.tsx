"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Link as LinkIcon,
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
import {
  parseArticleBlocks,
  renderInline,
  resolveEmbedUrl,
  formatArticleDate,
} from "@/lib/blog-format";
import Accordion from "@/components/Accordion";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterBanner from "@/components/blog/NewsletterBanner";
import Button from "@/components/Button";
import SplitHeading from "@/components/SplitHeading";
import { PROGRAM } from "@/data/content";

type ArticleViewProps = {
  article: Article;
  related: Article[];
};

const CALLOUT_VARIANTS = {
  tip: { label: "Conseil", box: "border-accent/40 bg-accent/[0.08] text-espresso-800", badge: "bg-accent" },
  info: { label: "À noter", box: "border-espresso-900/15 bg-espresso-900/[0.06] text-espresso-700", badge: "bg-espresso-700" },
  warning: { label: "Attention", box: "border-gold-500/40 bg-gold-500/[0.12] text-espresso-800", badge: "bg-gold-500" },
  danger: { label: "Important", box: "border-red-400/50 bg-red-500/[0.08] text-red-900", badge: "bg-red-500" },
} as const;

export default function ArticleView({ article, related }: ArticleViewProps) {
  const blocks = useMemo(() => parseArticleBlocks(article.content), [article.content]);
  const headings = useMemo(
    () =>
      blocks
        .filter((b): b is { type: "h2" | "h3"; text: string; id: string } => b.type === "h2" || b.type === "h3")
        .map((b) => ({ id: b.id, text: b.text, level: b.type === "h3" ? 3 : 2 })),
    [blocks],
  );
  const faqItems = useMemo(
    () => blocks.flatMap((b) => (b.type === "faq" ? b.items : [])),
    [blocks],
  );
  const [activeHeading, setActiveHeading] = useState("");
  const [copiedAnchor, setCopiedAnchor] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  function copyAnchor(id: string) {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedAnchor(id);
    setTimeout(() => setCopiedAnchor(null), 2000);
  }

  function copyPageLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function copyCode(index: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
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

            <div className="mt-8 space-y-6 text-espresso-600">
              {blocks.map((block, i) => {
                switch (block.type) {
                  case "h2":
                  case "h3":
                  case "h4": {
                    const Tag = block.type;
                    return (
                      <Tag
                        key={i}
                        id={block.id}
                        className="group relative scroll-mt-28 text-espresso-900"
                      >
                        {block.text}
                        <a
                          href={`#${block.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            copyAnchor(block.id);
                          }}
                          aria-label={`Lien vers la section ${block.text}`}
                          className="no-underline ml-2 inline-flex translate-y-[-2px] items-center opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          {copiedAnchor === block.id ? (
                            <Check className="h-4 w-4 text-accent" />
                          ) : (
                            <LinkIcon className="h-4 w-4 text-espresso-300 hover:text-accent" />
                          )}
                        </a>
                      </Tag>
                    );
                  }
                  case "h5":
                    return (
                      <h5 key={i} id={block.id} className="scroll-mt-28 font-semibold uppercase tracking-wide text-espresso-400">
                        {block.text}
                      </h5>
                    );
                  case "p":
                    return <p key={i}>{renderInline(block.text)}</p>;
                  case "blockquote":
                    return (
                      // `overflow-hidden` contient le grand guillemet d\u00E9coratif \u00E0 l'int\u00E9rieur
                      // du bloc quelle que soit la longueur du texte : sur une citation d'une
                      // seule ligne, le bas du guillemet se fait simplement rogner par le bord
                      // arrondi au lieu de d\u00E9border. Le bloc garde la hauteur de son contenu \u2014
                      // jamais agrandi artificiellement, jamais d'espace vide.
                      <blockquote
                        key={i}
                        className="relative my-8 overflow-hidden rounded-2xl bg-accent/[0.08] py-6 pl-[clamp(132px,16%,168px)] pr-7 text-lg font-medium italic leading-relaxed text-espresso-500 max-[860px]:px-5 max-[860px]:py-[18px]"
                      >
                        <span
                          aria-hidden
                          className="pointer-events-none absolute left-7 top-6 select-none rotate-[8deg] font-serif text-[160px] leading-[0.8] text-accent opacity-10"
                        >
                          {"\u275E"}
                        </span>
                        {block.text}
                      </blockquote>
                    );
                  case "callout": {
                    const variant = CALLOUT_VARIANTS[block.variant];
                    return (
                      <div key={i} className={`relative my-8 rounded-2xl border px-6 py-5 ${variant.box}`}>
                        <span className={`absolute -top-3 left-4 rounded-full px-3 py-1 text-xs font-semibold text-cream-50 ${variant.badge}`}>
                          {variant.label}
                        </span>
                        <p className="text-lg leading-relaxed">{block.text}</p>
                      </div>
                    );
                  }
                  case "ul":
                    return (
                      <ul key={i} className="my-5 ml-4 list-disc space-y-2 pl-6 marker:text-accent">
                        {block.items.map((item, j) => (
                          <li key={j}>{renderInline(item)}</li>
                        ))}
                      </ul>
                    );
                  case "ol":
                    return (
                      <ol key={i} className="my-5 ml-4 list-decimal space-y-2 pl-6 marker:font-medium marker:text-accent">
                        {block.items.map((item, j) => (
                          <li key={j}>{renderInline(item)}</li>
                        ))}
                      </ol>
                    );
                  case "code":
                    return (
                      <div key={i} data-section-theme="dark" className="my-8 overflow-hidden rounded-2xl bg-espresso-900">
                        <div className="flex items-center justify-between border-b border-cream-50/10 px-5 py-3">
                          <span className="font-mono text-xs uppercase tracking-wider text-cream-50/40">
                            {block.lang}
                          </span>
                          <button
                            onClick={() => copyCode(i, block.text)}
                            className="flex items-center gap-1.5 text-xs text-cream-50/40 transition-colors hover:text-cream-50"
                          >
                            {copiedCode === i ? (
                              <>
                                <Check className="h-3.5 w-3.5" /> Copié
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" /> Copier
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="overflow-x-auto p-5">
                          <code className="font-mono text-sm leading-relaxed text-cream-100">{block.text}</code>
                        </pre>
                      </div>
                    );
                  case "table":
                    return (
                      <div key={i} className="my-8 overflow-x-auto rounded-2xl border border-espresso-900/10">
                        <table className="w-full min-w-[520px] border-collapse text-left text-base">
                          <thead>
                            <tr className="bg-cream-100">
                              {block.headers.map((h, j) => (
                                <th key={j} className="px-5 py-3 text-sm font-semibold text-espresso-700">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.map((row, j) => (
                              <tr key={j} className={j % 2 ? "bg-cream-50/60" : ""}>
                                {row.map((cell, k) => (
                                  <td key={k} className="border-t border-espresso-900/10 px-5 py-3 text-espresso-600">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  case "image":
                    return (
                      <figure key={i} className="my-8">
                        <img src={block.src} alt={block.alt} className="w-full rounded-3xl" />
                        {(block.caption || block.alt) && (
                          <figcaption className="mt-2 text-center text-sm text-espresso-400">
                            {block.caption && <span className="italic">{block.caption}</span>}
                            {block.caption && block.alt && <span aria-hidden> · </span>}
                            {block.alt && <span>Source : {block.alt}</span>}
                          </figcaption>
                        )}
                      </figure>
                    );
                  case "embed": {
                    const { url, type } = resolveEmbedUrl(block.src);
                    const isTall = type === "tweet" || type === "reddit";
                    const isPodcast = type === "podcast";
                    return (
                      <div
                        key={i}
                        className={`my-8 overflow-hidden rounded-2xl ${isTall ? "" : "aspect-video"}`}
                      >
                        <iframe
                          src={url}
                          title="Contenu intégré"
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                          className="h-full w-full border-0"
                          style={isPodcast ? { height: 152 } : isTall ? { height: 500 } : undefined}
                        />
                      </div>
                    );
                  }
                  case "cta":
                    return (
                      <div key={i} className="flex justify-center pt-2">
                        <Button href={block.href} external={block.href.startsWith("http")}>
                          {block.label}
                        </Button>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>

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

        {/* FAQ */}
        {faqItems.length > 0 && (
          <section className="py-16">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-16">
              <div>
                <SplitHeading as="h2" text="Questions fréquentes" muted={["fréquentes"]} />
                <p className="mt-3 text-base leading-relaxed text-espresso-400">
                  Réponses claires aux questions fréquentes sur ce sujet.
                </p>
              </div>
              <Accordion items={faqItems} />
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
