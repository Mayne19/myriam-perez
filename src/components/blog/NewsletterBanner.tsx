"use client";

import { useState, type FormEvent } from "react";
import { FIELD_CLASSES_DARK } from "@/lib/fields";

/*
  Bannière infolettre pleine largeur — présente en bas de la liste des
  articles et en bas de chaque article.
*/
export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function subscribe(e: FormEvent) {
    e.preventDefault();
    if (email.trim()) setDone(true);
  }

  return (
    <div
      data-section-theme="dark"
      className="flex flex-col items-start gap-6 rounded-3xl bg-espresso-900 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <p className="text-2xl font-medium leading-snug text-cream-50 sm:text-3xl">
          Recevez des conseils pour structurer votre expertise
        </p>
        <p className="mt-2 max-w-md text-base leading-relaxed text-cream-100/60">
          Des conseils pratiques chaque semaine pour faire évoluer votre pratique de formateur.
        </p>
      </div>

      {done ? (
        <p className="shrink-0 text-sm font-medium text-cream-50">
          Merci ! Vous êtes bien inscrit·e à l&apos;infolettre.
        </p>
      ) : (
        <form onSubmit={subscribe} className="flex w-full max-w-md shrink-0 gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse courriel"
            aria-label="Adresse courriel"
            className={`rounded-full px-5 py-3 text-sm ${FIELD_CLASSES_DARK}`}
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark"
          >
            S&apos;abonner
          </button>
        </form>
      )}
    </div>
  );
}
