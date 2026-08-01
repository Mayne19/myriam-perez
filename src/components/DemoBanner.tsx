import Link from "next/link";

/*
  Rappel visuel : tant que Supabase n'est pas connecté (voir src/lib/demo.ts),
  tout ce qui s'affiche ici est fictif — la bannière disparaît d'elle-même
  dès que les identifiants Supabase sont renseignés.
*/
export default function DemoBanner() {
  return (
    <div className="border-b border-accent/30 bg-accent-bg px-6 py-2.5 text-center text-sm text-accent-text">
      Mode démo — données fictives, aucune base connectée.{" "}
      <Link href="/demo" className="font-medium underline">
        Changer de rôle
      </Link>
    </div>
  );
}
