import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import LoginTestimonialCarousel from "@/components/LoginTestimonialCarousel";

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
        <div className="flex items-center justify-center p-6 md:p-10">
          <AuthForm initialMode={initialMode} />
        </div>

        <LoginTestimonialCarousel />
      </div>
    </div>
  );
}
