import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/blog/ArticleView";
import { getAllArticles, getArticleBySlug } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    return { title: "Article | Myriam Perez — Inspire & Impact" };
  }
  return {
    title: `${article.title} | Myriam Perez — Inspire & Impact`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = (await getAllArticles())
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 2);

  return (
    <main>
      <ArticleView article={article} related={related} />
    </main>
  );
}
