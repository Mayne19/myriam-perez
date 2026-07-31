// Fond clair (cream) : l'anneau de focus doit être la couleur accent du
// site (orange), jamais une couleur neutre générique.
export const FIELD_CLASSES =
  "w-full rounded-xl border border-espresso-900/15 bg-cream-50 px-4 py-3 text-espresso-900 placeholder:text-espresso-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

// Même anneau de focus, adapté aux champs sur fond sombre (ex. NewsletterBanner).
export const FIELD_CLASSES_DARK =
  "w-full border border-cream-50/15 bg-cream-50/10 text-cream-50 placeholder:text-cream-100/50 outline-none transition focus:border-cream-50/40 focus:ring-2 focus:ring-cream-50/20";
