import Link from "next/link";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { getAllArticlesForAdmin } from "@/lib/admin/articles";
import AdminBlogDashboard from "@/components/admin/AdminBlogDashboard";

export const metadata: Metadata = {
  title: "Articles | Panel admin — Inspire & Impact",
};

export default async function AdminBlogPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-espresso-900">Articles</h1>
        <Link
          href="/admin/blog/nouveau"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-cream-50 no-underline transition-colors hover:bg-accent-dark"
        >
          <Plus className="h-4 w-4" /> Nouvel article
        </Link>
      </div>

      <AdminBlogDashboard articles={articles} />
    </div>
  );
}
