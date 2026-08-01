import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/demo";
import { MOCK_LEARNERS } from "@/lib/mock/data";

export type LearnerRow = {
  id: string;
  fullName: string | null;
  email: string | null;
  paymentStatus: "pending" | "active";
  createdAt: string;
  completedVideos: number;
  totalVideos: number;
  percent: number;
};

export async function getLearners(): Promise<LearnerRow[]> {
  if (!isSupabaseConfigured()) return MOCK_LEARNERS;

  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, status, created_at")
    .eq("role", "learner")
    .order("created_at", { ascending: false });

  const { count: totalVideos } = await supabase.from("videos").select("id", { count: "exact", head: true });

  const { data: completedRows } = await supabase.from("video_progress").select("user_id").eq("completed", true);

  const completedByUser = new Map<string, number>();
  for (const row of completedRows ?? []) {
    completedByUser.set(row.user_id, (completedByUser.get(row.user_id) ?? 0) + 1);
  }

  return (profiles ?? []).map((p) => {
    const completedVideos = completedByUser.get(p.id) ?? 0;
    const total = totalVideos ?? 0;
    return {
      id: p.id,
      fullName: p.full_name,
      email: p.email,
      paymentStatus: p.status,
      createdAt: p.created_at,
      completedVideos,
      totalVideos: total,
      percent: total > 0 ? Math.round((completedVideos / total) * 100) : 0,
    };
  });
}
