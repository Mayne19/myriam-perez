import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  external?: boolean;
  className?: string;
};

export default function Button({ href, children, variant = "primary", external, className = "" }: ButtonProps) {
  const base =
    "group no-underline inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 whitespace-nowrap";
  const styles =
    variant === "primary"
      ? "bg-accent text-cream-50 hover:bg-accent-dark hover:-translate-y-0.5 hover:text-cream-50"
      : variant === "secondary"
        ? // Bouton secondaire : vide au repos, rempli en beige au survol,
          // avec le texte qui bascule en brun foncé. Pour fond sombre.
          "bg-transparent text-cream-50 border border-cream-50/40 hover:bg-cream-50 hover:border-cream-50 hover:text-espresso-900"
        : // Contour : même logique que le secondaire, mais pour fond clair.
          "bg-transparent text-espresso-900 border border-espresso-900/20 hover:bg-espresso-900 hover:border-espresso-900 hover:text-cream-50";

  return (
    <Link
      href={href}
      className={`${base} ${styles} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
