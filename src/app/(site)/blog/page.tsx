import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BlogClient from "@/components/blog/BlogClient";
import { getAllArticles } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Myriam Perez — Inspire & Impact",
  description:
    "Réflexions et guides pratiques sur la formation, la certification et le marché corporatif au Québec.",
};

export default async function BlogPage() {
  const articles = await getAllArticles();

  return (
    <main>
      <PageHeader
        eyebrow="Blog"
        title="Réflexions sur la formation et la certification au Québec"
        muted={["sur", "la", "et", "au"]}
      />

      <BlogClient articles={articles} />
    </main>
  );
}
