import { createClient } from "@supabase/supabase-js";

/*
  Client Supabase avec la clé de service (service_role) — contourne les
  policies RLS. Réservé au webhook Stripe, qui doit activer un compte sans
  session utilisateur. Ne jamais exposer cette clé au navigateur.
  Nécessite SUPABASE_SERVICE_ROLE_KEY dans .env.local.
*/
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
