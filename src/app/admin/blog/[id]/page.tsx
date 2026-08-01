import { notFound } from "next/navigation";
import { getArticleForAdmin, getAllArticlesForAdmin } from "@/lib/admin/articles";
import { getAllCategories } from "@/lib/admin/categories";
import ArticleEditorForm from "@/components/admin/ArticleEditorForm";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticleForAdmin(params.id);
  if (!article) notFound();

  const [categories, allArticles] = await Promise.all([getAllCategories(), getAllArticlesForAdmin()]);
  return <ArticleEditorForm article={article} categories={categories} allArticles={allArticles} />;
}
