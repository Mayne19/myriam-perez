"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import { Callout, CalloutTitle, CalloutBody } from "./extensions/Callout";
import { Embed } from "./extensions/Embed";
import { Cta } from "./extensions/Cta";
import { Figure } from "./extensions/Figure";

/*
  Instance TipTap partagée entre la barre d'outils (verticale, à gauche du
  contenu) et la zone d'édition (au milieu) : les deux ont besoin du même
  `editor`, donc la création de l'éditeur vit ici plutôt que dans un des
  deux composants qui l'affichent.
*/
export function useArticleEditor(value: string, onChange: (html: string) => void) {
  return useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5] },
        link: { openOnClick: false },
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Rédigez votre article ici… (gras, titres, listes, encadrés, images…)",
      }),
      Figure,
      TableKit.configure({ table: { resizable: true } }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Callout,
      CalloutTitle,
      CalloutBody,
      Embed,
      Cta,
    ],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class: "article-body rich-editor-content",
        spellcheck: "true",
      },
    },
    // L'éditeur n'est monté qu'en client : évite un rendu serveur vide puis
    // un hydratage divergent.
    immediatelyRender: false,
  });
}
