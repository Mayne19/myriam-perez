import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { GraduationCap, ShieldCheck, PenLine } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/demo";
import { chooseDemoRole } from "@/app/demo/actions";

export const metadata: Metadata = {
  title: "Mode démo | Myriam Perez — Inspire & Impact",
};

const ROLES = [
  {
    role: "learner" as const,
    label: "Apprenant",
    desc: "Dashboard, formations, chapitres, lecteur vidéo, profil.",
    Icon: GraduationCap,
  },
  {
    role: "admin" as const,
    label: "Administratrice",
    desc: "Blog, apprenants, rôles et invitations — accès complet.",
    Icon: ShieldCheck,
  },
  {
    role: "editor" as const,
    label: "Éditeur",
    desc: "Accès à l'éditeur d'articles uniquement.",
    Icon: PenLine,
  },
];

export default function DemoPage() {
  // Cette page n'a de sens que tant qu'aucun Supabase réel n'est connecté.
  if (isSupabaseConfigured()) redirect("/login?mode=login");

  return (
    <div className="flex min-h-svh items-center justify-center bg-cream-50 p-6">
      <div className="w-full max-w-md text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-accent">Inspire &amp; Impact</p>
        <h1 className="mt-3 text-3xl font-medium leading-tight text-espresso-900">Mode démo</h1>
        <p className="mt-3 text-sm text-espresso-400">
          Aucun Supabase n&apos;est encore connecté (voir .env.local). Choisissez un rôle pour visualiser l&apos;espace
          correspondant avec des données fictives.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {ROLES.map(({ role, label, desc, Icon }) => (
            <form key={role} action={chooseDemoRole.bind(null, role)}>
              <button
                type="submit"
                className="flex w-full items-center gap-4 rounded-2xl border border-espresso-900/10 bg-white p-5 text-left transition-colors hover:border-accent/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-bg text-accent-text">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-medium text-espresso-900">{label}</span>
                  <span className="block text-sm text-espresso-400">{desc}</span>
                </span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
