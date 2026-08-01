import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/*
  Point d'entrée des liens d'invitation envoyés par Supabase Auth
  (supabase.auth.admin.inviteUserByEmail, voir src/app/admin/parametres/actions.ts).
  Le lien pointe vers {{ .SiteURL }}/auth/confirm?token_hash=...&type=invite ;
  on échange ce jeton contre une session puis on renvoie vers /invitation
  pour que la personne invitée choisisse son mot de passe.
*/
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (tokenHash && type === "invite") {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "invite" });
    if (!error) {
      return NextResponse.redirect(`${origin}/invitation`);
    }
  }

  return NextResponse.redirect(`${origin}/login?mode=login`);
}
