/*
  Parseur du format de contenu maison des articles.
  Le contenu est du markdown étendu :
  - ## / ### / #### / ##### : titres
  - - : liste à puces, 1. : liste numérotée
  - > : citation, > [!tip|info|warning|danger] : encadré
  - ```lang : bloc de code
  - | a | b | : tableau
  - FAQ: question | réponse : bloc FAQ (rendu en bas d'article)
  - [CTA: libellé → url] : appel à l'action
  - ![alt](src) [légende] : image avec source
  - [embed: url] : contenu intégré (YouTube, X, Spotify…)
  - **gras** et [texte](url) : mise en forme en ligne
*/

import type { ReactNode } from "react";

export type ParsedBlock =
  | { type: "h2" | "h3" | "h4" | "h5"; text: string; id: string }
  | { type: "p"; text: string; id: "" }
  | { type: "blockquote"; text: string; id: "" }
  | { type: "callout"; variant: "tip" | "info" | "warning" | "danger"; text: string; id: "" }
  | { type: "ul" | "ol"; items: string[]; id: "" }
  | { type: "code"; lang: string; text: string; id: "" }
  | { type: "table"; headers: string[]; rows: string[][]; id: "" }
  | { type: "faq"; items: { q: string; a: string }[]; id: "" }
  | { type: "cta"; label: string; href: string; id: "" }
  | { type: "image"; src: string; alt: string; caption: string; id: "" }
  | { type: "embed"; src: string; id: "" };

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      const isExternal = m[2].startsWith("http");
      return (
        <a
          key={i}
          href={m[2]}
          className="underline decoration-accent decoration-2 underline-offset-[3px] transition-colors hover:text-accent/60 hover:decoration-accent/60"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {m[1]}
        </a>
      );
    }
    return part;
  });
}

export function parseArticleBlocks(content: string): ParsedBlock[] {
  const lines = content.split("\n").map((l) => l.trim());
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line) {
      i++;
      continue;
    }

    if (line.startsWith("##### ")) {
      blocks.push({ type: "h5", text: line.slice(6), id: slugifyHeading(line.slice(6)) });
      i++;
      continue;
    }
    if (line.startsWith("#### ")) {
      blocks.push({ type: "h4", text: line.slice(5), id: slugifyHeading(line.slice(5)) });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4), id: slugifyHeading(line.slice(4)) });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3), id: slugifyHeading(line.slice(3)) });
      i++;
      continue;
    }

    const calloutMatch = line.match(/^> \[!(tip|info|warning|danger)\] (.+)/);
    if (calloutMatch) {
      blocks.push({
        type: "callout",
        variant: calloutMatch[1] as "tip" | "info" | "warning" | "danger",
        text: calloutMatch[2],
        id: "",
      });
      i++;
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push({ type: "blockquote", text: line.slice(2), id: "" });
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "ul", items, id: "" });
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      blocks.push({ type: "ol", items, id: "" });
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", lang, text: codeLines.join("\n"), id: "" });
      i++;
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter((r) => !r.match(/^\|[-| ]+\|$/));
      const parsed = rows.map((r) => r.split("|").slice(1, -1).map((c) => c.trim()));
      if (parsed.length > 0) {
        blocks.push({ type: "table", headers: parsed[0], rows: parsed.slice(1), id: "" });
      }
      continue;
    }

    if (line.startsWith("FAQ: ")) {
      const faqItems: { q: string; a: string }[] = [];
      while (i < lines.length && lines[i].startsWith("FAQ: ")) {
        const parts = lines[i].slice(5).split(" | ");
        if (parts.length >= 2) {
          faqItems.push({ q: parts[0], a: parts.slice(1).join(" | ") });
        }
        i++;
      }
      if (faqItems.length > 0) {
        blocks.push({ type: "faq", items: faqItems, id: "" });
      }
      continue;
    }

    const ctaMatch = line.match(/^\[CTA: (.+?) → (.+?)\]$/);
    if (ctaMatch) {
      blocks.push({ type: "cta", label: ctaMatch[1], href: ctaMatch[2], id: "" });
      i++;
      continue;
    }

    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)(.*)$/);
    if (imgMatch) {
      blocks.push({
        type: "image",
        alt: imgMatch[1],
        src: imgMatch[2],
        caption: imgMatch[3].trim(),
        id: "",
      });
      i++;
      continue;
    }

    const embedMatch = line.match(/^\[embed: (.+)\]$/);
    if (embedMatch) {
      blocks.push({ type: "embed", src: embedMatch[1], id: "" });
      i++;
      continue;
    }

    blocks.push({ type: "p", text: line, id: "" });
    i++;
  }

  return blocks;
}

type EmbedResolution = {
  url: string;
  type: "video" | "tweet" | "podcast" | "reddit" | "generic";
};

export function resolveEmbedUrl(src: string): EmbedResolution {
  const ytMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return { url: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`, type: "video" };

  const xMatch = src.match(/(?:twitter\.com|x\.com)\/\w+\/status\/\d+/);
  if (xMatch) return { url: `https://twitframe.com/show?url=${encodeURIComponent(src)}`, type: "tweet" };

  const redditMatch = src.match(/reddit\.com\/(r\/[^?#]+)/);
  if (redditMatch)
    return {
      url: `https://www.redditmedia.com/${redditMatch[1]}?ref_source=embed&ref=share&embed=true`,
      type: "reddit",
    };

  const spotifyMatch = src.match(/open\.spotify\.com\/(episode|show|track|playlist)\/([a-zA-Z0-9]+)/);
  if (spotifyMatch)
    return {
      url: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`,
      type: "podcast",
    };

  if (src.includes("podcasts.apple.com"))
    return { url: src.replace("podcasts.apple.com", "embed.podcasts.apple.com"), type: "podcast" };

  return { url: src, type: "generic" };
}

export function formatArticleDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" });
}
