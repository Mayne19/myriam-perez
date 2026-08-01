/*
  Génération de slug — utilisée à la fois côté client (aperçu en direct
  pendant la saisie du titre, voir ArticleEditorForm) et côté serveur
  (sanitisation finale avant écriture, voir actions.ts). Les accents sont
  retirés lettre par lettre (NFD + suppression des marques combinantes) :
  "Été" → "ete", jamais un slug corrompu par un caractère non traité.
*/
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
