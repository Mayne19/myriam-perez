import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getLearners } from "@/lib/admin/learners";
import ApprenantsView from "@/components/admin/ApprenantsView";

export const metadata: Metadata = {
  title: "Apprenants | Panel admin — Inspire & Impact",
};

export default async function AdminLearnersPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") redirect("/admin/blog");

  const learners = await getLearners();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin" className="text-sm font-medium text-espresso-400 no-underline hover:text-accent">
        ← Retour
      </Link>
      <ApprenantsView learners={learners} />
    </div>
  );
}
