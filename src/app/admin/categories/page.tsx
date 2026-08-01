import type { Metadata } from "next";
import { getAllCategories } from "@/lib/admin/categories";
import { getAllArticlesForAdmin } from "@/lib/admin/articles";
import CategoryBoard from "@/components/admin/CategoryBoard";

export const metadata: Metadata = {
  title: "Catégories | Panel admin — Inspire & Impact",
};

export default async function AdminCategoriesPage() {
  const [categories, articles] = await Promise.all([getAllCategories(), getAllArticlesForAdmin()]);

  return <CategoryBoard categories={categories} articles={articles} />;
}
