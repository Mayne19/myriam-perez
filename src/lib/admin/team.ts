import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/demo";
import { getMockTeam, getMockInvitations } from "@/lib/mock/data";

export type TeamMember = {
  id: string;
  fullName: string | null;
  email: string | null;
  role: "admin" | "editor";
};

export type InvitationRow = {
  id: string;
  email: string;
  role: "admin" | "editor";
  status: string;
  createdAt: string;
};

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured()) return getMockTeam();

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .in("role", ["admin", "editor"])
    .order("full_name", { ascending: true });
  return (data ?? []).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
  })) as TeamMember[];
}

export async function getInvitations(): Promise<InvitationRow[]> {
  if (!isSupabaseConfigured()) return getMockInvitations();

  const supabase = await createClient();
  const { data } = await supabase.from("invitations").select("id, email, role, status, created_at").order("created_at", { ascending: false });
  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
  }));
}
