"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BLOG_CATEGORIES, type Article } from "@/data/articles";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterBanner from "@/components/blog/NewsletterBanner";
import { FIELD_CLASSES } from "@/lib/fields";
import { cn } from "@/lib/utils";

type BlogClientProps = {
  articles: Article[];
};

const PER_PAGE = 9;

export default function BlogClient({ articles }: BlogClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const present = new Set(articles.map((a) => a.category));
    return BLOG_CATEGORIES.filter((c) => present.has(c));
  }, [articles]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles.filter((a) => {
      if (activeCategory !== null && a.category !== activeCategory) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [articles, activeCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  function selectCategory(category: string | null) {
    setActiveCategory(category);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20">
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2" aria-label="Catégories">
          <button
            onClick={() => selectCategory(null)}
            className={
              activeCategory === null
                ? "inline-flex h-11 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-cream-50 transition-colors"
                : "inline-flex h-11 items-center justify-center rounded-full border border-espresso-900/15 bg-transparent px-4 text-sm font-medium text-espresso-500 transition-colors hover:border-accent/50 hover:text-accent"
            }
          >
            Tous
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => selectCategory(category)}
              className={
                activeCategory === category
                  ? "inline-flex h-11 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-cream-50 transition-colors"
                  : "inline-flex h-11 items-center justify-center rounded-full border border-espresso-900/15 bg-transparent px-4 text-sm font-medium text-espresso-500 transition-colors hover:border-accent/50 hover:text-accent"
              }
            >
              {category}
            </button>
          ))}
        </div>

        {/* Recherche */}
        <div className="relative w-full max-w-md lg:w-72 lg:shrink-0">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-300" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un article…"
            aria-label="Rechercher un article"
            className={cn(FIELD_CLASSES, "h-11 rounded-full pl-11 pr-5 text-sm")}
          />
        </div>
      </div>

      {/* Grille d'articles */}
      {paginated.length > 0 ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-base text-espresso-300">
          Aucun article ne correspond à votre recherche.
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/15 text-espresso-500 transition-colors hover:border-accent/50 hover:text-accent disabled:cursor-default disabled:opacity-30 disabled:hover:border-espresso-900/15 disabled:hover:text-espresso-500"
            aria-label="Page précédente"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={
                n === currentPage
                  ? "flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-medium text-cream-50"
                  : "flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/15 text-sm font-medium text-espresso-500 transition-colors hover:border-accent/50 hover:text-accent"
              }
              aria-label={`Page ${n}`}
              aria-current={n === currentPage ? "page" : undefined}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/15 text-espresso-500 transition-colors hover:border-accent/50 hover:text-accent disabled:cursor-default disabled:opacity-30 disabled:hover:border-espresso-900/15 disabled:hover:text-espresso-500"
            aria-label="Page suivante"
          >
            →
          </button>
        </nav>
      )}

      <div className="mt-16">
        <NewsletterBanner />
      </div>
    </div>
  );
}
