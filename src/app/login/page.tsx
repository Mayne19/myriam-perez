import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import LoginTestimonialCarousel from "@/components/LoginTestimonialCarousel";
import { isSupabaseConfigured } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Connexion | Myriam Perez — Inspire & Impact",
};

type LoginPageProps = {
  searchParams?: { mode?: string };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const initialMode = searchParams?.mode === "login" ? "login" : "signup";

  return (
    <div className="flex min-h-svh items-center justify-center bg-cream-50 p-3 lg:p-6">
      {/*
        Le panneau témoignages est pensé pour occuper toute la hauteur de sa
        colonne : sur mobile, où la grille redevient une seule colonne, il
        n'y a plus de colonne à remplir — on le masque et on laisse le
        formulaire respirer avec sa propre hauteur, au lieu de forcer les
        deux dans 90 % de l'écran empilés l'un sur l'autre.
      */}
      <div className="grid w-full max-w-6xl lg:h-[90vh] lg:grid-cols-[35%_65%] lg:gap-6">
        <div className="flex flex-col items-center justify-center p-6 md:p-10">
          {/*
            `key` force React à remonter le formulaire quand `mode` change
            dans l'URL (lien « Se connecter » / « S'inscrire », ou retour
            navigateur). Sans ça, Next.js réutilise la même instance et son
            état interne reste bloqué sur le mode d'origine — le clic ne
            change rien à l'écran tant qu'on n'a pas rafraîchi la page.
          */}
          <AuthForm key={initialMode} initialMode={initialMode} />

          {!isSupabaseConfigured() && (
            <p className="mt-6 text-center text-sm text-espresso-400">
              Supabase n&apos;est pas encore connecté.{" "}
              <Link href="/demo" className="font-medium text-espresso-700 hover:text-accent">
                Essayer en mode démo
              </Link>
            </p>
          )}
        </div>

        <LoginTestimonialCarousel />
      </div>
    </div>
  );
}
