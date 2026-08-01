"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/demo";
import { setMockProgress } from "@/lib/mock/data";
import { getCurrentProfile } from "@/lib/supabase/profile";

// Une vidéo est considérée "terminée" à partir de 90 % de temps regardé —
// évite qu'il manque quelques secondes de générique de fin pour valider un
// chapitre.
const COMPLETION_THRESHOLD = 0.9;

export async function saveVideoProgress(
  videoId: string,
  secondsWatched: number,
  durationSeconds: number,
) {
  const completed = durationSeconds > 0 && secondsWatched / durationSeconds >= COMPLETION_THRESHOLD;

  if (!isSupabaseConfigured()) {
    const profile = await getCurrentProfile();
    if (!profile) return;
    setMockProgress(profile.id, videoId, { secondsWatched: Math.round(secondsWatched), completed });
    revalidatePath("/espace");
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("video_progress").upsert(
    {
      user_id: user.id,
      video_id: videoId,
      seconds_watched: Math.round(secondsWatched),
      completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,video_id" },
  );

  revalidatePath("/espace");
}

export async function updateFullName(fullName: string) {
  if (!isSupabaseConfigured()) {
    // Mode démo : profil fictif, non persistant — rien à écrire.
    return { error: "Mode démo : connectez Supabase pour enregistrer réellement ce champ." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté." };

  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (error) return { error: "Impossible de mettre à jour le nom." };

  revalidatePath("/espace/profil");
  return { error: null };
}
