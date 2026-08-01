/*
  Accès aux articles du blog.
  Les articles sont stockés dans Supabase (table `articles`, voir
  supabase/articles.sql). Tant que la table est absente, vide ou que les
  variables d'environnement Supabase ne sont pas configurées, le site se
  replie sur les articles de démonstration (src/data/articles.ts).
*/

import { createClient } from "@/lib/supabase/server";
import { SEED_ARTICLES, type Article } from "@/data/articles";
import { parseFaqJson, adminArticleToArticle } from "@/lib/article-html";
import { isSupabaseConfigured } from "@/lib/demo";
import { getMockArticles } from "@/lib/mock/data";

function publishedMockArticles(): Article[] {
  const now = new Date().toISOString();
  return getMockArticles()
    .filter((a) => a.publishedAt && a.publishedAt <= now)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .map(adminArticleToArticle);
}

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  author_name: string | null;
  published_at: string | null;
  reading_time_minutes: number | null;
  cover_image_url: string | null;
  tags: string[] | null;
  featured: boolean | null;
  faq_json: unknown;
};

function mapRow(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content,
    category: row.category ?? "Blog",
    author: row.author_name ?? "Myriam Perez",
    publishedAt: row.published_at ?? new Date().toISOString(),
    readingTime: row.reading_time_minutes ?? 0,
    coverImageUrl: row.cover_image_url,
    tags: row.tags ?? [],
    featured: row.featured ?? false,
    faq: parseFaqJson(row.faq_json),
  };
}

export async function getAllArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured()) {
    const mock = publishedMockArticles();
    return mock.length > 0 ? mock : SEED_ARTICLES;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      // Un article créé par l'éditeur admin sans date de publication (ou
      // programmé dans le futur) reste un brouillon : invisible ici.
      .select("*")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return SEED_ARTICLES;
    return (data as ArticleRow[]).map(mapRow);
  } catch {
    return SEED_ARTICLES;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!isSupabaseConfigured()) {
    return publishedMockArticles().find((a) => a.slug === slug) ?? SEED_ARTICLES.find((a) => a.slug === slug) ?? null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    if (error) throw error;
    if (data) return mapRow(data as ArticleRow);
  } catch {
    // Repli sur les données de démonstration.
  }
  return SEED_ARTICLES.find((a) => a.slug === slug) ?? null;
}
