import { cookies } from "next/headers";

/*
  Mode démo — actif uniquement tant que les identifiants Supabase ne sont
  pas renseignés (voir .env.example). Permet de visualiser /espace et
  /admin avec des données fictives sans base de données connectée. Dès que
  NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies,
  ce mode se désactive tout seul et toutes les pages basculent sur les
  vraies requêtes Supabase — aucun changement de code nécessaire.
  Même logique que le repli utilisé par le middleware et par le blog
  (voir src/lib/supabase/middleware.ts et src/lib/blog.ts).
*/
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export const DEMO_ROLE_COOKIE = "demo_role";

export type DemoRole = "learner" | "admin" | "editor";

export type DemoProfile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: null;
  username: string;
  status: "active";
  role: DemoRole;
};

const DEMO_PROFILES: Record<DemoRole, DemoProfile> = {
  learner: { id: "demo-learner", full_name: "Alex Tremblay", email: "alex@exemple.com", avatar_url: null, username: "alex", status: "active", role: "learner" },
  admin: { id: "demo-admin", full_name: "Myriam Perez", email: "myriam@exemple.com", avatar_url: null, username: "myriam", status: "active", role: "admin" },
  editor: { id: "demo-editor", full_name: "Camille Roy", email: "camille@exemple.com", avatar_url: null, username: "camille", status: "active", role: "editor" },
};

/*
  `null` = personne n'a encore choisi de rôle sur /demo (équivalent
  "non connecté" en mode démo).
*/
export async function getDemoProfile(): Promise<DemoProfile | null> {
  const cookieStore = await cookies();
  const role = cookieStore.get(DEMO_ROLE_COOKIE)?.value as DemoRole | undefined;
  if (!role || !(role in DEMO_PROFILES)) return null;
  return DEMO_PROFILES[role];
}
