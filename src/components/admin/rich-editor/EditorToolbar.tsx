"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import ToolPopover from "./ToolPopover";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Quote,
  List,
  ListOrdered,
  ListTodo,
  Code2,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  Link2Off,
  Image as ImageIcon,
  Table,
  MessageSquareQuote,
} from "lucide-react";
import { CALLOUT_LABELS, type CalloutStyle } from "./extensions/Callout";

const CALL_OUT_STYLES: CalloutStyle[] = ["tip", "info", "warning", "danger"];

type ToolButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolButton({ onClick, active = false, disabled = false, title, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-espresso-500 transition-colors ${
        active ? "bg-accent-bg text-accent-text" : "hover:bg-cream-100 hover:text-espresso-900"
      } disabled:pointer-events-none disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="my-1 h-px w-6 shrink-0 self-center bg-espresso-900/10" aria-hidden />;
}

/*
  Barre d'outils verticale, à gauche du contenu (voir ArticleEditorForm) —
  pas dans le flux de l'article : elle reste "sticky" et donc toujours
  atteignable, plutôt que de défiler avec un article long comme c'était le
  cas quand elle était posée en haut de la zone d'édition.
*/
export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  const [calloutOpen, setCalloutOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHeader, setTableHeader] = useState(true);
  const [, forceRender] = useReducer((n: number) => n + 1, 0);
  const calloutBtnRef = useRef<HTMLDivElement>(null);
  const tableBtnRef = useRef<HTMLDivElement>(null);

  // `editor` est une instance stable (créée une seule fois dans le
  // composant parent) : React ne la voit jamais "changer", donc rien ne
  // force ce composant à se re-rendre quand seule la position du curseur
  // bouge (sans modifier le texte). On s'abonne directement aux
  // transactions TipTap pour que les boutons (H1, gras, liste…) reflètent
  // toujours l'endroit où se trouve le curseur.
  useEffect(() => {
    if (!editor) return;
    editor.on("transaction", forceRender);
    editor.on("selectionUpdate", forceRender);
    return () => {
      editor.off("transaction", forceRender);
      editor.off("selectionUpdate", forceRender);
    };
  }, [editor]);

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Adresse du lien", previous ?? "");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const insertImage = () => {
    const url = window.prompt("URL de l'image");
    if (!url?.trim()) return;
    const caption = window.prompt("Source ou légende à afficher sous l'image (optionnel)", "");
    editor.chain().focus().setFigure({ src: url.trim(), caption: caption?.trim() ?? "" }).run();
  };

  const confirmTable = () => {
    const rows = Math.min(20, Math.max(1, tableRows));
    const cols = Math.min(10, Math.max(1, tableCols));
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: tableHeader }).run();
    setTableOpen(false);
  };

  const insertEmbed = () => {
    const url = window.prompt("URL à intégrer (YouTube, X, Spotify, Apple Podcasts…)");
    if (!url?.trim()) return;
    const caption = window.prompt("Source à afficher sous le contenu intégré (optionnel)", "");
    editor.chain().focus().setEmbed({ src: url.trim(), caption: caption?.trim() ?? "" }).run();
  };

  const insertCta = () => {
    const label = window.prompt("Libellé du bouton", "En savoir plus");
    if (label === null) return;
    const href = window.prompt("Lien du bouton");
    if (href === null) return;
    editor.chain().focus().setCta(label.trim() || "En savoir plus", href.trim()).run();
  };

  // Un callout a un contenu structuré (titre + corps) : le curseur n'est
  // jamais directement sur le nœud "callout" lui-même, il faut regarder
  // toute la chaîne des ancêtres (isActive le fait), pas juste le parent
  // direct de la sélection.
  const insertCallout = (style: CalloutStyle) => {
    if (editor.isActive("callout")) {
      editor.chain().focus().updateAttributes("callout", { style }).run();
    } else {
      editor.chain().focus().setCallout(style).run();
    }
    setCalloutOpen(false);
  };

  return (
    <div className="sticky top-6 z-20 flex max-h-[calc(100vh-3rem)] shrink-0 flex-col items-center gap-1 self-start overflow-y-auto rounded-2xl border border-espresso-900/10 bg-white p-2">
      {/*
        Hauteur plafonnée + défilement propre : sur un petit écran, la barre
        peut être plus haute que la fenêtre. Elle défile alors sur
        elle-même, indépendamment du contenu au milieu — jamais besoin de
        perdre de vue l'article pour atteindre un outil plus bas.
      */}
      <ToolButton title="Paragraphe" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
        <Pilcrow className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Titre 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Titre 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Titre 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </ToolButton>

      <Divider />

      <ToolButton title="Gras" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Italique" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Souligné" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Barré" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Code en ligne" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code2 className="h-4 w-4" />
      </ToolButton>

      <Divider />

      <ToolButton title="Citation" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolButton>
      <div ref={calloutBtnRef} className="relative shrink-0">
        <ToolButton title="Encadré (callout)" active={calloutOpen || editor.isActive("callout")} onClick={() => setCalloutOpen((o) => !o)}>
          <MessageSquareQuote className="h-4 w-4" />
        </ToolButton>
      </div>
      <ToolPopover open={calloutOpen} anchorRef={calloutBtnRef}>
        <div className="flex flex-col gap-1 whitespace-nowrap rounded-xl border border-espresso-900/10 bg-white p-1.5 shadow-lg">
          {CALL_OUT_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => insertCallout(style)}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-espresso-700 transition-colors hover:bg-cream-100"
            >
              <span
                className={`h-3 w-3 rounded-full ${
                  style === "tip"
                    ? "bg-accent"
                    : style === "info"
                      ? "bg-espresso-700"
                      : style === "warning"
                        ? "bg-gold-500"
                        : "bg-red-500"
                }`}
              />
              {CALLOUT_LABELS[style]}
            </button>
          ))}
        </div>
      </ToolPopover>

      <Divider />

      <ToolButton title="Liste à puces" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Liste numérotée" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Liste de tâches" active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()}>
        <ListTodo className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Bloc de code" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code2 className="h-4 w-4" />
      </ToolButton>

      <Divider />

      <ToolButton title="Lien" active={editor.isActive("link")} onClick={setLink}>
        <Link2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Retirer le lien" disabled={!editor.isActive("link")} onClick={() => editor.chain().focus().unsetLink().run()}>
        <Link2Off className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Image" onClick={insertImage}>
        <ImageIcon className="h-4 w-4" />
      </ToolButton>
      <div ref={tableBtnRef} className="relative shrink-0">
        <ToolButton title="Tableau" active={tableOpen} onClick={() => setTableOpen((o) => !o)}>
          <Table className="h-4 w-4" />
        </ToolButton>
      </div>
      <ToolPopover open={tableOpen} anchorRef={tableBtnRef}>
        <div className="w-64 rounded-xl border border-espresso-900/10 bg-white p-4 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-espresso-300">Tableau</p>
          <label className="mt-3 block text-sm font-medium text-espresso-900">
            Lignes
            <input
              type="number"
              min={1}
              max={20}
              value={tableRows}
              onChange={(e) => setTableRows(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-espresso-900/15 bg-cream-50 px-3 py-2 text-sm text-espresso-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <label className="mt-3 block text-sm font-medium text-espresso-900">
            Colonnes
            <input
              type="number"
              min={1}
              max={10}
              value={tableCols}
              onChange={(e) => setTableCols(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-espresso-900/15 bg-cream-50 px-3 py-2 text-sm text-espresso-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={tableHeader}
            onClick={() => setTableHeader((v) => !v)}
            className="mt-4 flex w-full items-center justify-between text-sm font-medium text-espresso-900"
          >
            Ligne d&apos;en-tête
            <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${tableHeader ? "bg-accent" : "bg-espresso-900/15"}`}>
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  tableHeader ? "translate-x-[1.375rem]" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>
          <div className="mt-4 flex items-center justify-end gap-3">
            <button type="button" onClick={() => setTableOpen(false)} className="text-sm font-medium text-espresso-500 hover:text-espresso-700">
              Annuler
            </button>
            <button type="button" onClick={confirmTable} className="rounded-full bg-espresso-900 px-4 py-2 text-sm font-medium text-cream-50 hover:bg-espresso-800">
              Insérer
            </button>
          </div>
        </div>
      </ToolPopover>
      <ToolButton title="Contenu intégré" onClick={insertEmbed}>
        <span className="text-[10px] font-bold uppercase tracking-wide">▶</span>
      </ToolButton>
      <ToolButton title="Appel à l'action" onClick={insertCta}>
        <span className="text-[10px] font-bold uppercase tracking-wide">CTA</span>
      </ToolButton>
    </div>
  );
}
