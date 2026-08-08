import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getDashboardData } from "@/lib/admin/dashboard";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Tableau de bord | Panel admin — Inspire & Impact",
};

export default async function AdminIndexPage() {
  const profile = await getCurrentProfile();
  // L'éditeur n'a accès qu'au blog : pas de vue d'ensemble globale pour lui.
  if (profile?.role !== "admin") redirect("/admin/blog");

  const data = await getDashboardData();
  return <AdminDashboard data={data} />;
}
