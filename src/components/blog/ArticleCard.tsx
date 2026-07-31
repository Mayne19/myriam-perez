import Link from "next/link";
import { Clock } from "lucide-react";
import type { Article } from "@/data/articles";
import { formatArticleDate } from "@/lib/blog-format";

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group no-underline flex flex-col rounded-3xl border border-espresso-900/10 bg-cream-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_16px_40px_rgba(67,38,29,0.08)]"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide text-accent">{article.category}</span>
        <span className="flex items-center gap-1 text-xs font-medium text-espresso-300">
          <Clock className="h-3.5 w-3.5" />
          {article.readingTime} min
        </span>
      </div>

      <h3 className="line-clamp-2 text-lg font-medium leading-snug text-espresso-900 transition-colors duration-300 group-hover:text-accent">
        {article.title}
      </h3>

      <p className="mt-2 line-clamp-2 flex-1 text-base leading-relaxed text-espresso-500">
        {article.excerpt}
      </p>

      <div className="mt-5 flex items-center gap-1.5 border-t border-espresso-900/10 pt-4 text-xs font-medium text-espresso-300">
        <span className="text-espresso-700">{article.author}</span>
        <span aria-hidden>·</span>
        <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
      </div>
    </Link>
  );
}
