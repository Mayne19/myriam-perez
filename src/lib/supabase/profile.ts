import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, getDemoProfile } from "@/lib/demo";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  status: "pending" | "active";
  role: "learner" | "admin" | "editor";
};

/*
  Profil de l'utilisateur connecté (session lue via les cookies). `null` si
  personne n'est connecté. Utilisé dans les layouts /espace et /admin pour
  la redirection selon le rôle.

  Tant que Supabase n'est pas configuré, se rabat sur le profil du mode démo
  (voir src/lib/demo.ts) — choisi sur /demo, sans base de données.
*/
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return getDemoProfile();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, status, role")
    .eq("id", user.id)
    .maybeSingle();

  return (data as Profile) ?? null;
}
