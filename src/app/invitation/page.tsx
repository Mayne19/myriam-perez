import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import InvitationForm from "@/components/InvitationForm";

export const metadata: Metadata = {
  title: "Définir votre mot de passe | Myriam Perez — Inspire & Impact",
};

export default async function InvitationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?mode=login");

  return (
    <div className="flex min-h-svh items-center justify-center bg-cream-50 p-6">
      <InvitationForm />
    </div>
  );
}
