/*
  Bloc « encadré » (callout) de l'éditeur : un bandeau avec un titre et un
  corps, décliné en 4 styles (tip / info / warning / danger).
  Le HTML produit est identique à celui de dslToHtml() (src/lib/article-html.ts)
  pour que l'éditeur et le blog public partagent le même rendu CSS.

  Structure à deux sous-nœuds (calloutTitle + calloutBody) plutôt qu'un badge
  statique : le titre est un vrai contenu éditable (content: "inline*"), pas
  du texte figé recalculé depuis le style. Cliquer dedans permet de le
  modifier ; comme .callout-badge n'a pas de largeur fixée en CSS (span,
  position absolute), il s'élargit ou se rétrécit tout seul avec le texte.
*/

import { Node, mergeAttributes } from "@tiptap/core";

export type CalloutStyle = "tip" | "info" | "warning" | "danger";

export const CALLOUT_LABELS: Record<CalloutStyle, string> = {
  tip: "Conseil",
  info: "À noter",
  warning: "Attention",
  danger: "Important",
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (style: CalloutStyle) => ReturnType;
    };
  }
}

export const CalloutTitle = Node.create({
  name: "calloutTitle",
  content: "inline*",
  marks: "",
  selectable: false,
  isolating: true,

  parseHTML() {
    return [{ tag: "span.callout-badge" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: "callout-badge" }), 0];
  },
});

export const CalloutBody = Node.create({
  name: "calloutBody",
  content: "block+",

  parseHTML() {
    return [{ tag: "div.callout-body" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { class: "callout-body" }), 0];
  },
});

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "calloutTitle calloutBody",
  defining: true,
  isolating: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      style: {
        default: "tip",
        parseHTML: (element) => element.getAttribute("data-callout-style") ?? "tip",
        renderHTML: (attributes) => ({ "data-callout-style": attributes.style }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-callout-style]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const style = (node.attrs.style ?? "tip") as CalloutStyle;
    return ["div", mergeAttributes(HTMLAttributes, { "data-block-type": "callout", "data-callout-style": style }), 0];
  },

  addCommands() {
    return {
      setCallout:
        (style: CalloutStyle) =>
        ({ commands }) =>
          // `toggleNode`/`setNode` exigent que le nœud cible accepte le même
          // contenu que le nœud remplacé (ex. paragraphe -> inline). Ici le
          // callout a un contenu structuré (titre + corps), donc on insère
          // une structure complète plutôt que de convertir le bloc courant.
          commands.insertContent({
            type: this.name,
            attrs: { style },
            content: [
              { type: "calloutTitle", content: [{ type: "text", text: CALLOUT_LABELS[style] }] },
              { type: "calloutBody", content: [{ type: "paragraph" }] },
            ],
          }),
    };
  },
});
