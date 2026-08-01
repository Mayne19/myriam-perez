import type { Metadata } from "next";
import ArticleEditorForm from "@/components/admin/ArticleEditorForm";
import { getAllCategories } from "@/lib/admin/categories";
import { getAllArticlesForAdmin } from "@/lib/admin/articles";

export const metadata: Metadata = {
  title: "Nouvel article | Panel admin — Inspire & Impact",
};

export default async function NewArticlePage({ searchParams }: { searchParams?: { categorie?: string } }) {
  const [categories, allArticles] = await Promise.all([getAllCategories(), getAllArticlesForAdmin()]);
  return (
    <ArticleEditorForm article={null} categories={categories} allArticles={allArticles} initialCategory={searchParams?.categorie} />
  );
}
