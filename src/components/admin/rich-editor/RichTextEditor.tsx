"use client";

import { EditorContent, type Editor } from "@tiptap/react";

/*
  Zone d'édition seule — la barre d'outils vit à part (EditorToolbar,
  verticale, voir ArticleEditorForm) et partage la même instance `editor`.

  Porte la classe `.article-body`, la même que le rendu public : les blocs
  (titres, encadrés, tableaux, citations…) sont donc rendus en direct,
  exactement comme ils apparaîtront sur le site. Fond crème comme les autres
  champs du formulaire (voir FIELD_CLASSES) plutôt que blanc, pour rester
  cohérent avec eux — et plus proche du fond réel de la page publique.

  L'anneau de focus (`focus-within`) est posé ici, sur ce conteneur arrondi
  — pas sur la zone d'édition elle-même (voir `.rich-editor-content` dans
  globals.css, qui l'annule) : le même anneau que les autres champs
  (`focus:border-accent focus:ring-2 focus:ring-accent/20` de FIELD_CLASSES),
  mais posé sur un élément réellement arrondi, donc jamais carré.
*/
export default function RichTextEditor({ editor }: { editor: Editor | null }) {
  return (
    <div className="rounded-2xl border border-espresso-900/10 bg-cream-50 px-6 py-5 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 sm:px-8">
      <EditorContent editor={editor} />
    </div>
  );
}
