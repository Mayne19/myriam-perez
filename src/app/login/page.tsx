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
      <div className="grid h-[90vh] w-full max-w-6xl lg:grid-cols-[35%_65%] lg:gap-6">
        <div className="flex items-center justify-center p-6 md:p-10">
          <AuthForm initialMode={initialMode} />
        </div>

        <LoginTestimonialCarousel />
      </div>
    </div>
  );
}
