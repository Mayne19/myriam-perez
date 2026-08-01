/*
  Gestion des catégories du blog. La table `blog_categories` (voir
  supabase/articles.sql) remplace la constante statique BLOG_CATEGORIES :
  les catégories de démonstration restent les quatre valeurs de départ,
  mais l'administratrice peut en ajouter ou en retirer depuis /admin/categories.
*/

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/demo";
import {
  getMockCategories,
  createMockCategory,
  deleteMockCategory,
} from "@/lib/mock/data";

export type BlogCategory = { id: string; name: string; slug: string; position: number };

type CategoryRow = { id: string; name: string; slug: string; position: number };

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getAllCategories(): Promise<BlogCategory[]> {
  if (!isSupabaseConfigured()) return getMockCategories();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("position", { ascending: true });
  if (error || !data) return [];
  return (data as CategoryRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    position: row.position,
  }));
}

export async function createCategory(name: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    const result = createMockCategory(name);
    return { error: result.error };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_categories")
    .insert({ name: name.trim(), slug: slugify(name) })
    .select("id")
    .single();
  if (error) {
    if (error.message.includes("duplicate")) return { error: "Cette catégorie existe déjà." };
    return { error: "Impossible de créer la catégorie." };
  }
  return { error: null };
}

export async function deleteCategory(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return deleteMockCategory(id);

  const supabase = await createClient();
  const { error } = await supabase.from("blog_categories").delete().eq("id", id);
  if (error) return { error: "Impossible de supprimer la catégorie." };
  return { error: null };
}
