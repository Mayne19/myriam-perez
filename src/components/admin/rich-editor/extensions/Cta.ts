/*
  Bloc « appel à l'action » de l'éditeur : un bouton central avec libellé et
  lien. Le `data-label` sur le lien permet de retrouver le libellé au
  rechargement (le texte du lien n'est pas éditable, c'est une saisie de la
  barre d'outils).
*/

import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cta: {
      setCta: (label: string, href: string) => ReturnType;
    };
  }
}

export const Cta = Node.create({
  name: "cta",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      label: {
        default: "En savoir plus",
        parseHTML: (element) =>
          element.querySelector(".article-cta")?.getAttribute("data-label") ??
          element.querySelector(".article-cta")?.textContent?.trim() ??
          "En savoir plus",
        renderHTML: () => ({}),
      },
      href: {
        default: "",
        parseHTML: (element) => element.querySelector(".article-cta")?.getAttribute("href") ?? "",
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-block-type='cta']" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const href = node.attrs.href ?? "";
    const external = /^https?:/i.test(href);
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-block-type": "cta" }),
      [
        "a",
        {
          class: "article-cta",
          href,
          "data-label": node.attrs.label ?? "",
          ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        },
        node.attrs.label ?? "En savoir plus",
      ],
    ];
  },

  addCommands() {
    return {
      setCta:
        (label: string, href: string) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { label, href } }),
    };
  },
});
