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
        ? // Contour, pour fond sombre. Rempli au survol — et déjà rempli sans
          // survol (tactile), voir `.btn-outline-dark` dans globals.css.
          "btn-outline-dark"
        : // Contour, pour fond clair. Même logique, voir `.btn-outline-light`.
          "btn-outline-light";

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
