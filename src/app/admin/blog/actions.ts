"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/demo";
import { createArticle, updateArticle, deleteArticle, getArticleForAdmin, type ArticleInput } from "@/lib/admin/articles";
import type { FaqItem } from "@/lib/article-html";
import { slugify } from "@/lib/slug";

export type ArticleFormState = { id: string | null; error: string | null };

export async function saveArticleAction(
  articleId: string | null,
  input: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    coverImageUrl: string | null;
    tags: string;
    readingTimeMinutes: number;
    authorName: string;
    featured: boolean;
    /** Date de publication choisie (YYYY-MM-DD) ou null pour "maintenant". */
    publishDate: string | null;
    faq: FaqItem[];
    publish: boolean;
  },
): Promise<ArticleFormState> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    return { id: null, error: "Action réservée à l'équipe éditoriale." };
  }
  if (!input.title.trim()) return { id: null, error: "Le titre est requis." };

  const payload: ArticleInput = {
    // Sanitisé côté serveur même si le client l'a déjà généré/édité : jamais
    // de slug corrompu (accents, espaces, casse) écrit en base.
    slug: slugify(input.slug) || slugify(input.title),
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    content: input.content,
    category: input.category,
    coverImageUrl: input.coverImageUrl,
    tags: input.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    readingTimeMinutes: input.readingTimeMinutes,
    featured: input.featured,
    authorName: input.authorName.trim() || "Myriam Perez",
    publishedAt: input.publish
      ? input.publishDate
        ? new Date(`${input.publishDate}T12:00:00.000Z`).toISOString()
        : new Date().toISOString()
      : null,
    faqJson: input.faq
      .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }))
      .filter((item) => item.question !== ""),
  };

  let id = articleId;
  try {
    if (id) {
      await updateArticle(id, payload);
    } else {
      id = await createArticle(payload);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    if (message.includes("duplicate key")) return { id: null, error: "Un article avec un titre (URL) identique existe déjà." };
    return { id: null, error: "Impossible d'enregistrer l'article." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  // Pas de redirect() ici : cette action est appelée directement depuis un
  // gestionnaire client (pas un <form action>), et redirect() lancé dans ce
  // contexte remonte comme une exception non interceptée côté client. Le
  // composant fait la navigation lui-même avec l'id renvoyé.
  return { id, error: null };
}

export async function deleteArticleAction(articleId: string): Promise<{ error: string | null }> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    return { error: "Action réservée à l'équipe éditoriale." };
  }

  await deleteArticle(articleId);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { error: null };
}

/*
  Bascule publié/brouillon depuis la liste, sans repasser par le formulaire
  complet — un article publié peut ainsi redevenir brouillon (dépublié) et
  inversement, en un clic.
*/
export async function togglePublishAction(articleId: string, publish: boolean): Promise<{ error: string | null }> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    return { error: "Action réservée à l'équipe éditoriale." };
  }

  const article = await getArticleForAdmin(articleId);
  if (!article) return { error: "Article introuvable." };

  await updateArticle(articleId, {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    coverImageUrl: article.coverImageUrl,
    tags: article.tags,
    readingTimeMinutes: article.readingTimeMinutes,
    featured: article.featured,
    authorName: article.authorName,
    publishedAt: publish ? new Date().toISOString() : null,
    faqJson: article.faq,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  return { error: null };
}

export async function uploadCoverImage(formData: FormData): Promise<{ url: string | null; error: string | null }> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    return { url: null, error: "Action réservée à l'équipe éditoriale." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return { url: null, error: "Fichier manquant." };

  if (!isSupabaseConfigured()) {
    // Mode démo : pas de bucket Supabase à écrire — on ré-encode l'image
    // choisie en data URL pour que l'aperçu reste fidèle malgré tout.
    const buffer = Buffer.from(await file.arrayBuffer());
    return { url: `data:${file.type};base64,${buffer.toString("base64")}`, error: null };
  }

  const supabase = await createClient();
  const path = `covers/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}${file.name.match(/\.[^.]+$/)?.[0] ?? ""}`;

  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) return { url: null, error: "Le téléversement a échoué." };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
