"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/demo";
import { addMockInvitation, updateMockTeamRole } from "@/lib/mock/data";

/*
  Toutes les actions ci-dessous re-vérifient le rôle admin côté serveur :
  le layout /admin bloque déjà l'accès à la page, mais une Server Action
  reste un point d'entrée réseau direct, pas seulement un clic de bouton.
*/

export async function inviteTeamMember(email: string, role: "admin" | "editor") {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") return { error: "Action réservée aux administrateurs." };

  if (!isSupabaseConfigured()) {
    // Mode démo : aucun courriel réel n'est envoyé, on simule juste le résultat.
    addMockInvitation({ id: `mock-invit-${Date.now()}`, email, role, status: "pending", createdAt: new Date().toISOString() });
    revalidatePath("/admin/parametres");
    return { error: null };
  }

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/invitation`,
  });
  if (error) return { error: "Impossible d'envoyer l'invitation : " + error.message };

  const userId = data.user?.id;
  if (userId) {
    // Membre de l'équipe : pas d'abonnement à payer, compte actif immédiatement.
    await admin.from("profiles").update({ role, status: "active" }).eq("id", userId);
  }

  const supabase = await createClient();
  await supabase.from("invitations").insert({ email, role, invited_by: profile.id });

  revalidatePath("/admin/parametres");
  return { error: null };
}

export async function updateMemberRole(userId: string, role: "admin" | "editor" | "learner") {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") return { error: "Action réservée aux administrateurs." };
  if (userId === profile.id) return { error: "Vous ne pouvez pas modifier votre propre rôle." };

  if (!isSupabaseConfigured()) {
    if (role === "admin" || role === "editor") updateMockTeamRole(userId, role);
    revalidatePath("/admin/parametres");
    return { error: null };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ role }).eq("id", userId);
  if (error) return { error: "Impossible de mettre à jour le rôle." };

  revalidatePath("/admin/parametres");
  return { error: null };
}
