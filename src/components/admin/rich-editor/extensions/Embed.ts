/*
  Bloc « contenu intégré » de l'éditeur : un iframe (YouTube, X, Spotify…),
  avec une légende/source optionnelle en dessous (ex. « Source : YouTube »).
  `data-src` conserve l'URL d'origine sur la balise, pour que le rechargement
  de l'éditeur retrouve exactement ce que l'auteur a collé. L'URL affichée
  dans l'iframe est la version "embed" résolue par resolveEmbedUrl().

  Le cadre arrondi (`.embed-frame`) ne contient que l'iframe : la légende
  vit en dehors, sinon elle serait elle aussi coupée par le `overflow:
  hidden` du cadre (voir globals.css).
*/

import { Node, mergeAttributes } from "@tiptap/core";
import { resolveEmbedUrl } from "@/lib/blog-format";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (attrs: { src: string; caption?: string }) => ReturnType;
    };
  }
}

export const Embed = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-src") ?? element.querySelector("iframe")?.getAttribute("src") ?? "",
        renderHTML: (attributes) => (attributes.src ? { "data-src": attributes.src } : {}),
      },
      caption: {
        default: "",
        parseHTML: (element) => element.querySelector(".embed-caption")?.textContent ?? "",
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-block-type='embed']" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { url, type } = resolveEmbedUrl(node.attrs.src ?? "");
    const caption = (node.attrs.caption as string) ?? "";
    const children: unknown[] = [
      [
        "div",
        { class: "embed-frame", "data-embed-type": type },
        [
          "iframe",
          {
            src: url,
            contenteditable: "false",
            allowfullscreen: "true",
            loading: "lazy",
            title: "Contenu intégré",
          },
        ],
      ],
    ];
    if (caption) children.push(["p", { class: "embed-caption" }, caption]);
    return ["div", mergeAttributes(HTMLAttributes, { "data-block-type": "embed", "data-src": node.attrs.src ?? "" }), ...children];
  },

  addCommands() {
    return {
      setEmbed:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { caption: "", ...attrs } }),
    };
  },
});
