"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Plus, Redo2, RotateCw, Trash2, Undo2, Upload, X } from "lucide-react";
import { FIELD_CLASSES } from "@/lib/fields";
import { slugify } from "@/lib/slug";
import { saveArticleAction, deleteArticleAction, uploadCoverImage } from "@/app/admin/blog/actions";
import RichTextEditor from "@/components/admin/rich-editor/RichTextEditor";
import EditorToolbar from "@/components/admin/rich-editor/EditorToolbar";
import { useArticleEditor } from "@/components/admin/rich-editor/useArticleEditor";
import { dslToHtml, extractFaqFromDsl, isHtmlContent, adminArticleToArticle, type FaqItem } from "@/lib/article-html";
import ArticleView from "@/components/blog/ArticleView";
import type { AdminArticle } from "@/lib/admin/articles";
import type { BlogCategory } from "@/lib/admin/categories";

type ArticleEditorFormProps = {
  article: AdminArticle | null;
  categories: BlogCategory[];
  /** Pour l'aperçu : sert à retrouver d'autres articles de la même catégorie. */
  allArticles: AdminArticle[];
  /** Catégorie présélectionnée en arrivant depuis "+ Créer un article" d'une colonne. */
  initialCategory?: string;
};

function toDateInputValue(iso: string | null): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return iso.slice(0, 10);
}

export default function ArticleEditorForm({ article, categories, allArticles, initialCategory }: ArticleEditorFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(() => {
    const raw = article?.content ?? "";
    return isHtmlContent(raw) ? raw : dslToHtml(raw);
  });
  const [category, setCategory] = useState(article?.category ?? initialCategory ?? categories[0]?.name ?? "");
  const [readingTime, setReadingTime] = useState(article?.readingTimeMinutes ?? 5);
  const [authorName, setAuthorName] = useState(article?.authorName ?? "Myriam Perez");
  const [publishDate, setPublishDate] = useState(toDateInputValue(article?.publishedAt ?? null));
  const featured = article?.featured ?? false;
  const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl ?? null);
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [faq, setFaq] = useState<FaqItem[]>(() => {
    if (article?.faq && article.faq.length > 0) return article.faq;
    const raw = article?.content ?? "";
    return isHtmlContent(raw) ? [] : extractFaqFromDsl(raw);
  });

  const editor = useArticleEditor(content, setContent);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Génère le slug depuis le titre tant que la personne n'a pas édité le
  // champ elle-même — dès qu'elle y touche, on respecte son choix.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const { url, error: uploadError } = await uploadCoverImage(formData);
    if (url) setCoverImageUrl(url);
    if (uploadError) setError(uploadError);
    setUploading(false);
  }

  function handleUseCoverUrl() {
    if (!coverUrlInput.trim()) return;
    setCoverImageUrl(coverUrlInput.trim());
    setCoverUrlInput("");
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError(null);
    const { id, error: saveError } = await saveArticleAction(article?.id ?? null, {
      title,
      slug,
      excerpt,
      content,
      category,
      coverImageUrl,
      tags: "",
      readingTimeMinutes: readingTime,
      authorName,
      featured,
      publishDate: publish ? publishDate : null,
      faq,
      publish,
    });
    if (saveError || !id) {
      setError(saveError ?? "Impossible d'enregistrer l'article.");
      setSaving(false);
      return;
    }
    router.push(`/admin/blog/${id}`);
    router.refresh();
  }

  async function handleDelete() {
    if (!article) return;
    if (!confirm("Supprimer définitivement cet article ?")) return;
    const { error: deleteError } = await deleteArticleAction(article.id);
    if (deleteError) {
      setError(deleteError);
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  }

  function setFaqItem(index: number, key: "question" | "answer", value: string) {
    setFaq((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  // Aperçu : construit un article "live" à partir de la saisie en cours
  // (pas encore enregistrée) et le rend avec le même composant que le blog
  // public, pour un aperçu réellement identique — pas une approximation.
  const previewArticle = {
    id: article?.id ?? "preview",
    slug: slug || "apercu",
    title: title || "Titre de l'article",
    excerpt,
    content,
    category: category || "Blog",
    author: authorName || "Myriam Perez",
    publishedAt: publishDate ? `${publishDate}T12:00:00.000Z` : new Date().toISOString(),
    readingTime,
    coverImageUrl,
    tags: [] as string[],
    featured,
    faq,
  };
  const relatedArticles = allArticles
    .filter((a) => a.category === category && a.id !== article?.id)
    .slice(0, 2)
    .map(adminArticleToArticle);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="text-sm font-medium text-espresso-400 hover:text-accent"
        >
          ← Articles
        </button>

        <div className="flex items-center gap-1 rounded-full border border-espresso-900/10 bg-white p-1">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "edit" ? "bg-accent-bg text-accent-text" : "text-espresso-500 hover:text-espresso-900"
            }`}
          >
            <Pencil className="h-3.5 w-3.5" /> Rédaction
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "preview" ? "bg-accent-bg text-accent-text" : "text-espresso-500 hover:text-espresso-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> Aperçu
          </button>
        </div>
      </div>

      {mode === "preview" ? (
        <div className="rounded-2xl border border-espresso-900/10 bg-white">
          <ArticleView article={previewArticle} related={relatedArticles} />
        </div>
      ) : (
      <div className="grid items-start gap-6 lg:grid-cols-[auto_minmax(0,1fr)_300px]">
        {/* Barre d'outils — verticale, sticky : toujours atteignable, ne défile jamais avec l'article. */}
        <EditorToolbar editor={editor} />

        {/* Colonne du milieu : titre, contenu puis FAQ */}
        <div className="min-w-0 flex flex-col gap-6">
          {/* Bloc 1 — titre + méta description */}
          <div className="flex flex-col gap-4 rounded-2xl border border-espresso-900/10 bg-white p-5">
            <label className="text-sm font-medium text-espresso-900">
              Titre
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'article"
                className={`${FIELD_CLASSES} mt-1.5 text-base font-medium`}
              />
            </label>

            <label className="text-sm font-medium text-espresso-900">
              Slug
              <div className="mt-1.5 flex gap-2">
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugTouched(true);
                  }}
                  placeholder="titre-de-l-article"
                  className={`${FIELD_CLASSES} text-base font-mono !text-sm`}
                />
                <button
                  type="button"
                  title="Régénérer depuis le titre"
                  aria-label="Régénérer depuis le titre"
                  onClick={() => {
                    setSlug(slugify(title));
                    setSlugTouched(false);
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-espresso-900/15 text-espresso-500 transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>
            </label>

            <label className="text-sm font-medium text-espresso-900">
              Description
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Résumé (affiché dans la liste du blog)"
                rows={2}
                className={`${FIELD_CLASSES} mt-1.5 text-base`}
              />
            </label>
          </div>

          {/* Bloc 2 — contenu : même carte blanche que Titre/Description, le
              libellé "Contenu" joue le rôle des labels "Titre"/"Description"
              et l'éditeur (fond crème) celui de leurs champs. */}
          <div className="flex flex-col gap-2 rounded-2xl border border-espresso-900/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-espresso-900">Contenu</span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  title="Annuler"
                  aria-label="Annuler"
                  disabled={!editor?.can().undo()}
                  onClick={() => editor?.chain().focus().undo().run()}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-espresso-500 transition-colors hover:bg-cream-100 hover:text-espresso-900 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Rétablir"
                  aria-label="Rétablir"
                  disabled={!editor?.can().redo()}
                  onClick={() => editor?.chain().focus().redo().run()}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-espresso-500 transition-colors hover:bg-cream-100 hover:text-espresso-900 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Redo2 className="h-4 w-4" />
                </button>
                {article && (
                  <>
                    <span className="mx-1 h-5 w-px bg-espresso-900/10" aria-hidden />
                    <button
                      type="button"
                      title="Supprimer l'article"
                      aria-label="Supprimer l'article"
                      onClick={handleDelete}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <RichTextEditor editor={editor} />
          </div>

          {/* Bloc 3 — FAQ */}
          <div className="rounded-2xl border border-espresso-900/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-espresso-900">Questions fréquentes</p>
              <button
                type="button"
                onClick={() => setFaq((prev) => [...prev, { question: "", answer: "" }])}
                className="flex items-center gap-1 rounded-full border border-espresso-900/15 px-3 py-1.5 text-xs font-medium text-espresso-700 transition-colors hover:border-accent/40 hover:text-accent"
              >
                <Plus className="h-3.5 w-3.5" /> Ajouter
              </button>
            </div>
            <p className="mt-1 text-xs text-espresso-400">
              Affichées en bas de l&apos;article, uniquement si au moins une question existe.
            </p>

            <div className="mt-3 flex flex-col gap-3">
              {faq.map((item, index) => (
                <div key={index} className="rounded-xl border border-espresso-900/10 bg-cream-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-espresso-300">
                      Question {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFaq((prev) => prev.filter((_, i) => i !== index))}
                      className="text-red-600 transition-colors hover:text-red-700"
                      aria-label="Supprimer la question"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    value={item.question}
                    onChange={(e) => setFaqItem(index, "question", e.target.value)}
                    placeholder="Question"
                    className={`${FIELD_CLASSES} mt-2 !px-3 !py-2 text-base`}
                  />
                  <textarea
                    value={item.answer}
                    onChange={(e) => setFaqItem(index, "answer", e.target.value)}
                    placeholder="Réponse"
                    rows={2}
                    className={`${FIELD_CLASSES} mt-2 !px-3 !py-2 text-base`}
                  />
                </div>
              ))}
              {faq.length === 0 && (
                <p className="rounded-xl bg-cream-50 p-3 text-xs text-espresso-400">
                  Aucune question. L&apos;article sera publié sans section FAQ.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Panneau de configuration (droite) — épinglé comme la barre de navigation, ne défile pas avec la page. */}
        <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-6">
          <div className="rounded-2xl border border-espresso-900/10 bg-white p-5">
            <p className="text-sm font-medium text-espresso-900">Image de couverture</p>
            {coverImageUrl ? (
              <div className="relative mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImageUrl} alt="" className="aspect-video w-full rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl(null)}
                  aria-label="Retirer l'image"
                  title="Retirer l'image"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-espresso-900/70 text-cream-50 transition-colors hover:bg-espresso-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mt-3 flex aspect-video w-full items-center justify-center rounded-xl bg-accent-bg text-sm text-accent-text">
                Aucune image
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-espresso-900/15 py-2.5 text-sm font-medium text-espresso-700 transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-60"
            >
              <Upload className="h-4 w-4" /> {uploading ? "Envoi…" : "Téléverser"}
            </button>

            <div className="my-1 flex items-center gap-3">
              <span className="h-px flex-1 bg-espresso-900/10" />
              <span className="text-xs text-espresso-400">ou</span>
              <span className="h-px flex-1 bg-espresso-900/10" />
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={coverUrlInput}
                onChange={(e) => setCoverUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUseCoverUrl())}
                placeholder="URL d'une image hébergée ailleurs"
                className={`${FIELD_CLASSES} !py-2 text-sm`}
              />
              <button
                type="button"
                onClick={handleUseCoverUrl}
                disabled={!coverUrlInput.trim()}
                className="shrink-0 rounded-xl border border-espresso-900/15 px-3 text-sm font-medium text-espresso-700 transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-40"
              >
                Utiliser
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-espresso-900/10 bg-white p-5">
            <label className="text-sm font-medium text-espresso-900">
              Catégorie
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${FIELD_CLASSES} mt-1.5 text-base`}
              >
                {categories.length === 0 && <option value="">Aucune catégorie</option>}
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-espresso-900">
              Auteure
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Myriam Perez"
                className={`${FIELD_CLASSES} mt-1.5 text-base`}
              />
            </label>

            <div className="grid grid-cols-[3fr_2fr] gap-3">
              <label className="text-sm font-medium text-espresso-900">
                Publication
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className={`${FIELD_CLASSES} mt-1.5 !px-2.5 text-base`}
                />
              </label>

              <label className="text-sm font-medium text-espresso-900">
                Lecture
                <input
                  type="number"
                  min={1}
                  value={readingTime}
                  onChange={(e) => setReadingTime(Number(e.target.value))}
                  className={`${FIELD_CLASSES} mt-1.5 !px-2.5 text-base`}
                />
              </label>
            </div>
          </div>

          {error && <p className="rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm text-espresso-700">{error}</p>}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {article?.publishedAt ? "Mettre à jour (publié)" : "Publier"}
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full rounded-full border border-espresso-900/15 px-6 py-3 text-sm font-medium text-espresso-700 transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-60"
            >
              Enregistrer comme brouillon
            </button>
          </div>
        </aside>
      </div>
      )}
    </div>
  );
}
