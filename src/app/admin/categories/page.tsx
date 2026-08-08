import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories } from "@/lib/admin/categories";
import { getAllArticlesForAdmin } from "@/lib/admin/articles";
import CategoryBoard from "@/components/admin/CategoryBoard";

export const metadata: Metadata = {
  title: "Catégories | Panel admin — Inspire & Impact",
};

export default async function AdminCategoriesPage() {
  const [categories, articles] = await Promise.all([getAllCategories(), getAllArticlesForAdmin()]);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin" className="text-sm font-medium text-espresso-400 no-underline hover:text-accent">
        ← Retour
      </Link>
      <CategoryBoard categories={categories} articles={articles} />
    </div>
  );
}
