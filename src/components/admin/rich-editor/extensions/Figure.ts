/*
  Image insérée dans l'article, avec légende/source optionnelle en dessous
  (petit texte centré) — remplace l'extension Image de base pour supporter
  cette légende. Même structure HTML que dslToHtml() (src/lib/article-html.ts)
  pour que l'éditeur et le blog public partagent le même rendu CSS.
*/

import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figure: {
      setFigure: (attrs: { src: string; alt?: string; caption?: string }) => ReturnType;
    };
  }
}

export const Figure = Node.create({
  name: "figure",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: "" },
      alt: { default: "" },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (element) => {
          const img = element.querySelector("img");
          const caption = element.querySelector("figcaption");
          return {
            src: img?.getAttribute("src") ?? "",
            alt: img?.getAttribute("alt") ?? "",
            caption: caption?.textContent ?? "",
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, alt, caption } = node.attrs as { src: string; alt: string; caption: string };
    const children: unknown[] = [["img", { src, alt: alt || "", loading: "lazy" }]];
    if (caption) children.push(["figcaption", {}, caption]);
    return ["figure", mergeAttributes(HTMLAttributes), ...children];
  },

  addCommands() {
    return {
      setFigure:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { alt: "", caption: "", ...attrs } }),
    };
  },
});
