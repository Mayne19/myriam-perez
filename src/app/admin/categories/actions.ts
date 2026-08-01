"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { createCategory, deleteCategory } from "@/lib/admin/categories";

export type CategoriesActionState = { error: string | null };

export async function createCategoryAction(name: string): Promise<CategoriesActionState> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    return { error: "Action réservée à l'équipe éditoriale." };
  }
  if (!name.trim()) return { error: "Le nom de la catégorie est requis." };

  const { error } = await createCategory(name);
  revalidatePath("/admin/categories");
  revalidatePath("/admin/blog/nouveau");
  revalidatePath("/admin/blog");
  return { error };
}

export async function deleteCategoryAction(id: string): Promise<CategoriesActionState> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    return { error: "Action réservée à l'équipe éditoriale." };
  }

  const { error } = await deleteCategory(id);
  revalidatePath("/admin/categories");
  revalidatePath("/admin/blog/nouveau");
  revalidatePath("/admin/blog");
  return { error };
}
