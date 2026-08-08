import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getTeamMembers, getInvitations } from "@/lib/admin/team";
import TeamSettings from "@/components/admin/TeamSettings";

export const metadata: Metadata = {
  title: "Paramètres | Panel admin — Inspire & Impact",
};

export default async function AdminSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/admin/blog");

  const [members, invitations] = await Promise.all([getTeamMembers(), getInvitations()]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link href="/admin" className="text-sm font-medium text-espresso-400 no-underline hover:text-accent">
        ← Retour
      </Link>
      <h1 className="text-2xl font-medium text-espresso-900">Paramètres</h1>
      <TeamSettings members={members} invitations={invitations} currentUserId={profile.id} />
    </div>
  );
}
