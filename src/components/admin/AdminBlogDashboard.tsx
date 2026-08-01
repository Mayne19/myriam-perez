"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { formatArticleDate } from "@/lib/blog-format";
import { deleteArticleAction, togglePublishAction } from "@/app/admin/blog/actions";
import type { AdminArticle } from "@/lib/admin/articles";

type Filter = "all" | "published" | "draft";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "published", label: "Publiés" },
  { value: "draft", label: "Brouillons" },
];

export default function AdminBlogDashboard({ articles }: { articles: AdminArticle[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = articles.filter((article) => {
    if (filter === "published") return Boolean(article.publishedAt);
    if (filter === "draft") return !article.publishedAt;
    return true;
  });

  const count = (value: Filter) =>
    value === "all" ? articles.length : articles.filter((a) => (value === "published" ? Boolean(a.publishedAt) : !a.publishedAt)).length;

  async function handleToggle(article: AdminArticle) {
    setBusyId(article.id);
    await togglePublishAction(article.id, !article.publishedAt);
    router.refresh();
    setBusyId(null);
  }

  async function handleDelete(article: AdminArticle) {
    if (!confirm(`Supprimer définitivement « ${article.title || "cet article"} » ?`)) return;
    setBusyId(article.id);
    await deleteArticleAction(article.id);
    router.refresh();
    setBusyId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-accent text-cream-50"
                : "border border-espresso-900/15 bg-white text-espresso-600 hover:border-accent/40"
            }`}
          >
            {f.label}
            <span className={`ml-1.5 text-xs ${filter === f.value ? "text-cream-50/70" : "text-espresso-300"}`}>{count(f.value)}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-espresso-900/10 bg-white p-6 text-sm text-espresso-400">
          {filter === "draft"
            ? "Aucun brouillon pour l'instant."
            : filter === "published"
              ? "Aucun article publié pour l'instant."
              : "Aucun article pour l'instant. Le blog public affiche les articles de démonstration en attendant."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-espresso-900/10 bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-cream-100">
                <th className="px-5 py-3 font-semibold text-espresso-700">Titre</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Catégorie</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Date</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Statut</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article) => (
                <tr key={article.id} className="border-t border-espresso-900/10">
                  <td className="px-5 py-3">
                    <Link href={`/admin/blog/${article.id}`} className="font-medium text-espresso-900 hover:text-accent">
                      {article.title || "(sans titre)"}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-espresso-600">{article.category || "—"}</td>
                  <td className="px-5 py-3 text-espresso-600">
                    {article.publishedAt ? formatArticleDate(article.publishedAt) : ""}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        article.publishedAt ? "bg-accent-bg text-accent-text" : "bg-cream-200 text-espresso-500"
                      }`}
                    >
                      {article.publishedAt ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title={article.publishedAt ? "Repasser en brouillon" : "Publier"}
                        aria-label={article.publishedAt ? "Repasser en brouillon" : "Publier"}
                        disabled={busyId === article.id}
                        onClick={() => handleToggle(article)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-espresso-500 transition-colors hover:bg-cream-100 hover:text-espresso-900 disabled:opacity-40"
                      >
                        {article.publishedAt ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        title="Supprimer"
                        aria-label="Supprimer"
                        disabled={busyId === article.id}
                        onClick={() => handleDelete(article)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
