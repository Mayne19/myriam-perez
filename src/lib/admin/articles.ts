import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/demo";
import { parseFaqJson, type FaqItem } from "@/lib/article-html";
import { getMockArticles, getMockArticle, createMockArticle, updateMockArticle, deleteMockArticle } from "@/lib/mock/data";

export type AdminArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImageUrl: string | null;
  tags: string[];
  readingTimeMinutes: number;
  featured: boolean;
  authorName: string;
  /** `null` = brouillon, non visible sur le blog public (voir src/lib/blog.ts). */
  publishedAt: string | null;
  faq: FaqItem[];
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  reading_time_minutes: number | null;
  featured: boolean | null;
  author_name: string | null;
  published_at: string | null;
  faq_json: unknown;
};

function mapRow(row: ArticleRow): AdminArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content,
    category: row.category ?? "",
    coverImageUrl: row.cover_image_url,
    tags: row.tags ?? [],
    readingTimeMinutes: row.reading_time_minutes ?? 0,
    featured: row.featured ?? false,
    authorName: row.author_name ?? "Myriam Perez",
    publishedAt: row.published_at,
    faq: parseFaqJson(row.faq_json),
  };
}

export async function getAllArticlesForAdmin(): Promise<AdminArticle[]> {
  if (!isSupabaseConfigured()) return getMockArticles();

  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as ArticleRow[]).map(mapRow);
}

export async function getArticleForAdmin(id: string): Promise<AdminArticle | null> {
  if (!isSupabaseConfigured()) return getMockArticle(id);

  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return mapRow(data as ArticleRow);
}

export type ArticleInput = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImageUrl: string | null;
  tags: string[];
  readingTimeMinutes: number;
  featured: boolean;
  authorName: string;
  publishedAt: string | null;
  faqJson: FaqItem[];
};

export async function createArticle(input: ArticleInput) {
  if (!isSupabaseConfigured()) return createMockArticle(input);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .insert({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      cover_image_url: input.coverImageUrl,
      tags: input.tags,
      reading_time_minutes: input.readingTimeMinutes,
      featured: input.featured,
      author_name: input.authorName,
      published_at: input.publishedAt,
      faq_json: input.faqJson,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateArticle(id: string, input: ArticleInput) {
  if (!isSupabaseConfigured()) return updateMockArticle(id, input);

  const supabase = await createClient();
  const { error } = await supabase
    .from("articles")
    .update({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      cover_image_url: input.coverImageUrl,
      tags: input.tags,
      reading_time_minutes: input.readingTimeMinutes,
      featured: input.featured,
      author_name: input.authorName,
      published_at: input.publishedAt,
      faq_json: input.faqJson,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteArticle(id: string) {
  if (!isSupabaseConfigured()) return deleteMockArticle(id);

  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}
