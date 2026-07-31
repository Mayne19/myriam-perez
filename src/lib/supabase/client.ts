import { createBrowserClient } from "@supabase/ssr";

/*
  Client Supabase côté navigateur — utilisé dans les formulaires de
  connexion/inscription (composants client). Nécessite les variables
  NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local.
*/
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
