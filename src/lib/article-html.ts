/*
  Unification du contenu des articles autour du HTML.

  Les nouveaux articles (éditeur WYSIWYG, voir RichTextEditor.tsx) sont
  stockés en HTML. Les articles historiques (format markdown maison décrit
  dans blog-format.ts) sont convertis en HTML à la volée par dslToHtml(),
  pour que le rendu public et l'éditeur passent toujours par le même HTML.

  La FAQ est soit stockée à part (faq_json) pour les nouveaux articles, soit
  extraite du DSL historique (lignes "FAQ: …"). Elle n'apparaît sur le site
  que si elle contient des entrées — jamais sinon.
*/

import { parseArticleBlocks, resolveEmbedUrl } from "@/lib/blog-format";
import type { Article } from "@/data/articles";
import type { AdminArticle } from "@/lib/admin/articles";

export type FaqItem = { question: string; answer: string };
export type HeadingItem = { id: string; text: string; level: 2 | 3 | 4 };

const CALLOUT_LABELS: Record<string, string> = {
  tip: "Conseil",
  info: "À noter",
  warning: "Attention",
  danger: "Important",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convertit la mise en forme en ligne du DSL (gras, liens) en HTML. */
export function inlineToHtml(text: string): string {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts
    .map((part) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        return `<strong>${escapeHtml(part.slice(2, -2))}</strong>`;
      }
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        const label = escapeHtml(m[1]);
        const href = escapeHtml(m[2]);
        const external = /^https?:/i.test(m[2]);
        return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`;
      }
      return escapeHtml(part);
    })
    .join("");
}

/**
  Convertit un contenu au format historique (markdown maison) en HTML
  structuré identique à celui que produit l'éditeur WYSIWYG. Les blocs FAQ
  sont ignorés ici : ils sont gérés à part (voir buildArticleBody).
*/
export function dslToHtml(content: string): string {
  const blocks = parseArticleBlocks(content);
  return blocks
    .map((block) => {
      switch (block.type) {
        case "h2":
          return `<h2>${inlineToHtml(block.text)}</h2>`;
        case "h3":
          return `<h3>${inlineToHtml(block.text)}</h3>`;
        case "h4":
          return `<h4>${inlineToHtml(block.text)}</h4>`;
        case "h5":
          return `<h5>${inlineToHtml(block.text)}</h5>`;
        case "p":
          return `<p>${inlineToHtml(block.text)}</p>`;
        case "blockquote":
          return `<blockquote>${inlineToHtml(block.text)}</blockquote>`;
        case "callout": {
          const label = CALLOUT_LABELS[block.variant] ?? "Conseil";
          return `<div data-block-type="callout" data-callout-style="${block.variant}"><span class="callout-badge">${label}</span><div class="callout-body"><p>${inlineToHtml(block.text)}</p></div></div>`;
        }
        case "ul":
          return `<ul>${block.items.map((item) => `<li>${inlineToHtml(item)}</li>`).join("")}</ul>`;
        case "ol":
          return `<ol>${block.items.map((item) => `<li>${inlineToHtml(item)}</li>`).join("")}</ol>`;
        case "code":
          return `<pre><code>${escapeHtml(block.text)}</code></pre>`;
        case "table":
          return `<table><thead><tr>${block.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead><tbody>${block.rows
            .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
            .join("")}</tbody></table>`;
        case "image": {
          const alt = block.alt ? ` alt="${escapeHtml(block.alt)}"` : "";
          const caption = block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : "";
          return `<figure><img src="${escapeHtml(block.src)}"${alt} loading="lazy" />${caption}</figure>`;
        }
        case "embed": {
          const { url, type } = resolveEmbedUrl(block.src);
          return `<div data-block-type="embed"><div class="embed-frame" data-embed-type="${type}"><iframe src="${escapeHtml(url)}" loading="lazy" allowfullscreen title="Contenu intégré"></iframe></div></div>`;
        }
        case "cta": {
          const external = /^https?:/i.test(block.href);
          return `<div data-block-type="cta"><a class="article-cta" href="${escapeHtml(block.href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(block.label)}</a></div>`;
        }
        default:
          return "";
      }
    })
    .join("\n");
}

/** Extrait les entrées FAQ d'un contenu historique (lignes "FAQ: …"). */
export function extractFaqFromDsl(content: string): FaqItem[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("FAQ: "))
    .map((line) => {
      const parts = line.slice(5).split(" | ");
      if (parts.length < 2) return null;
      return { question: parts[0].trim(), answer: parts.slice(1).join(" | ").trim() };
    })
    .filter((item): item is FaqItem => item !== null && item.question !== "");
}

/** Type d'intégration d'un iframe (pour dimensionner le rendu en CSS). */
export type EmbedType = "video" | "tweet" | "podcast" | "reddit" | "generic";

export function isHtmlContent(content: string): boolean {
  return /<(?:p|h[1-6]|div|ul|ol|blockquote|table|pre|figure|section|hr)\b/i.test(content.trim());
}

/** Normalise une colonne `faq_json` (JSON d'articles) en liste d'entrées FAQ. */
export function parseFaqJson(json: unknown): FaqItem[] {
  if (!Array.isArray(json)) return [];
  const items = json.filter(
    (item): item is FaqItem =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as FaqItem).question === "string" &&
      typeof (item as FaqItem).answer === "string",
  );
  return items.map((item) => ({ question: item.question.trim(), answer: item.answer.trim() })).filter((i) => i.question !== "");
}

export function slugifyHeading(text: string): string {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || "section";
}

/**
  Ajoute un `id` stable aux titres (H2–H4) et renvoie le plan de l'article
  (utilisé par la barre latérale du blog public et par l'ancrage).
*/
export function processArticleHtml(html: string): { html: string; headings: HeadingItem[] } {
  const used = new Set<string>();
  const headings: HeadingItem[] = [];
  const withIds = html.replace(/<(h2|h3|h4)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
    const level = parseInt(tag.slice(1), 10) as HeadingItem["level"];
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (!text) return match;
    const id = slugifyHeading(text);
    let unique = id;
    let n = 2;
    while (used.has(unique)) {
      unique = `${id}-${n++}`;
    }
    used.add(unique);
    headings.push({ id: unique, text, level });
    return `<${tag}${attrs ?? ""} id="${unique}">${inner}</${tag}>`;
  });
  return { html: withIds, headings };
}

/**
  Point d'entrée unique pour afficher le corps d'un article (public ET
  éditeur) : renvoie le HTML prêt à l'emploi, la FAQ éventuelle et le plan.
*/
export function buildArticleBody(
  content: string,
  faqJson: FaqItem[] | null,
): { html: string; faq: FaqItem[]; headings: HeadingItem[] } {
  const trimmed = content?.trim() ?? "";
  const isHtml = isHtmlContent(trimmed);
  const html = isHtml ? trimmed : dslToHtml(trimmed);
  const faq = faqJson && faqJson.length > 0 ? faqJson : isHtml ? [] : extractFaqFromDsl(trimmed);
  const processed = processArticleHtml(html);
  return { html: processed.html, faq, headings: processed.headings };
}

/**
  Convertit un article du panel admin (AdminArticle) vers le type public
  Article — utilisé à la fois par le blog public en mode démo (src/lib/blog.ts)
  et par l'aperçu de l'éditeur (ArticleEditorForm). Vit ici plutôt que dans
  src/lib/admin/articles.ts, qui importe du code serveur uniquement
  (`next/headers`) : un composant client ne peut pas l'importer sans faire
  échouer le build.
*/
export function adminArticleToArticle(a: AdminArticle): Article {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    category: a.category || "Blog",
    author: a.authorName || "Myriam Perez",
    publishedAt: a.publishedAt ?? new Date().toISOString(),
    readingTime: a.readingTimeMinutes,
    coverImageUrl: a.coverImageUrl,
    tags: a.tags,
    featured: a.featured,
    faq: a.faq,
  };
}
