"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { FIELD_CLASSES } from "@/lib/fields";
import { createCategoryAction, deleteCategoryAction } from "@/app/admin/categories/actions";
import type { BlogCategory } from "@/lib/admin/categories";
import type { AdminArticle } from "@/lib/admin/articles";

/*
  Quatre variantes de couleur qui restent dans la palette de la marque
  (accent / doré / neutres crème-espresso) plutôt que d'importer des teintes
  arbitraires (bleu, vert, violet…) qui jureraient avec le reste du site —
  elles tournent simplement d'une colonne à l'autre, comme des étiquettes de
  tableau, pas comme un encodage de données à préserver à tout prix.
*/
const PALETTE = [
  { bg: "bg-accent-bg", dot: "bg-accent" },
  { bg: "bg-gold-400/15", dot: "bg-gold-500" },
  { bg: "bg-cream-200", dot: "bg-espresso-700" },
  { bg: "bg-espresso-100", dot: "bg-espresso-800" },
] as const;

export default function CategoryBoard({ categories, articles }: { categories: BlogCategory[]; articles: AdminArticle[] }) {
  const router = useRouter();
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: actionError } = await createCategoryAction(newCategoryName);
    if (actionError) {
      setError(actionError);
    } else {
      setNewCategoryName("");
      setAddingCategory(false);
      router.refresh();
    }
    setBusy(false);
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (!confirm(`Supprimer la catégorie « ${name} » ? Les articles existants ne seront pas supprimés.`)) return;
    setError(null);
    const { error: actionError } = await deleteCategoryAction(id);
    if (actionError) setError(actionError);
    else router.refresh();
  }

  const columns = categories.map((category) => ({
    category,
    items: articles.filter((a) => a.category === category.name),
  }));

  // Filet de sécurité : un article dont la catégorie ne correspond plus à
  // rien (catégorie supprimée depuis) ne doit pas disparaître silencieusement.
  const knownNames = new Set(categories.map((c) => c.name));
  const orphanArticles = articles.filter((a) => !knownNames.has(a.category));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-espresso-900">Catégories</h1>
          <p className="mt-1 text-sm text-espresso-400">Organisez vos articles par thématique.</p>
        </div>
        <button
          type="button"
          onClick={() => setAddingCategory((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark"
        >
          <Plus className="h-4 w-4" /> Nouvelle catégorie
        </button>
      </div>

      {addingCategory && (
        <form onSubmit={handleAddCategory} className="flex items-end gap-3 rounded-2xl border border-espresso-900/10 bg-white p-4">
          <label className="flex-1">
            <span className="text-sm font-medium text-espresso-900">Nom de la catégorie</span>
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ex. Stratégie de formation"
              autoFocus
              className={`${FIELD_CLASSES} mt-1.5 text-base`}
            />
          </label>
          <button
            type="submit"
            disabled={busy || !newCategoryName.trim()}
            className="rounded-full bg-espresso-900 px-5 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-espresso-800 disabled:opacity-60"
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={() => setAddingCategory(false)}
            className="rounded-full border border-espresso-900/15 px-5 py-3 text-sm font-medium text-espresso-700 transition-colors hover:border-accent/40"
          >
            Annuler
          </button>
        </form>
      )}

      {error && <p className="rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm text-espresso-700">{error}</p>}

      {columns.length === 0 ? (
        <p className="rounded-2xl border border-espresso-900/10 bg-white p-6 text-sm text-espresso-400">
          Aucune catégorie pour l&apos;instant.
        </p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {columns.map(({ category, items }, index) => {
            const colors = PALETTE[index % PALETTE.length];
            return (
              <div key={category.id} className="flex w-72 shrink-0 flex-col gap-3">
                <div className={`flex items-center justify-between rounded-2xl border border-espresso-900/10 ${colors.bg} px-4 py-3`}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors.dot}`} />
                    <span className="font-medium text-espresso-900">{category.name}</span>
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium text-espresso-700">{items.length}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    aria-label={`Supprimer la catégorie ${category.name}`}
                    title="Supprimer la catégorie"
                    className="text-espresso-500 transition-colors hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {items.map((article) => (
                    <Link
                      key={article.id}
                      href={`/admin/blog/${article.id}`}
                      className="flex flex-col gap-2 rounded-2xl border border-espresso-900/10 bg-white p-4 no-underline transition-colors hover:border-accent/30"
                    >
                      <p className="text-sm font-medium leading-snug text-espresso-900">{article.title || "(sans titre)"}</p>
                      <span
                        className={`self-start rounded-full px-2.5 py-1 text-xs font-medium ${
                          article.publishedAt ? "bg-accent-bg text-accent-text" : "bg-cream-200 text-espresso-500"
                        }`}
                      >
                        {article.publishedAt ? "Publié" : "Brouillon"}
                      </span>
                    </Link>
                  ))}

                  <Link
                    href={`/admin/blog/nouveau?categorie=${encodeURIComponent(category.name)}`}
                    className="flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-espresso-900/15 px-4 py-3 text-sm font-medium text-espresso-500 no-underline transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <Plus className="h-4 w-4" /> Créer un article
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {orphanArticles.length > 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-espresso-900/10 bg-white p-5">
          <p className="text-sm font-medium text-espresso-900">Sans catégorie reconnue</p>
          <p className="text-xs text-espresso-400">
            La catégorie de ces articles ne correspond plus à une catégorie existante.
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {orphanArticles.map((article) => (
              <Link
                key={article.id}
                href={`/admin/blog/${article.id}`}
                className="rounded-xl border border-espresso-900/10 bg-cream-50 p-3 text-sm text-espresso-700 no-underline hover:border-accent/30"
              >
                {article.title || "(sans titre)"} <span className="text-espresso-400">— {article.category || "aucune"}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
