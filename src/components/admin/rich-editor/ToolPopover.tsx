"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

/*
  Popover rendu via portail (document.body), positionné en `fixed` d'après
  les coordonnées réelles du bouton qui l'ouvre.

  Nécessaire parce que la barre d'outils est maintenant "overflow-y-auto"
  (défilement indépendant du contenu, voir EditorToolbar) : dès qu'un axe
  passe à autre chose que `visible`, le CSS force l'AUTRE axe à se couper
  aussi — un popover en `position: absolute` classique se retrouverait donc
  invisible, coupé par ce même conteneur. Un portail sort complètement le
  popover de cette hiérarchie, aucun ancêtre ne peut plus le couper.

  Le bouton qui ouvre le popover peut se trouver n'importe où le long d'une
  barre d'outils qui défile elle-même (donc potentiellement tout en bas de
  l'écran) : on mesure la hauteur réelle du popover après un premier rendu
  invisible, puis on recale sa position pour qu'il reste entièrement dans la
  fenêtre — jamais coupé en bas.
*/
export default function ToolPopover({
  open,
  anchorRef,
  children,
}: {
  open: boolean;
  anchorRef: RefObject<HTMLElement>;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      setPos(null);
      return;
    }
    const margin = 8;
    const update = () => {
      const anchor = anchorRef.current?.getBoundingClientRect();
      if (!anchor) return;
      const contentHeight = contentRef.current?.offsetHeight ?? 0;
      const top = Math.min(anchor.top, Math.max(margin, window.innerHeight - contentHeight - margin));
      setPos({ top, left: anchor.right + margin });
    };
    // Premier passage : mesure avec la position du bouton, ajustée après
    // coup une fois la vraie hauteur du popover connue.
    update();
    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={contentRef}
      className="fixed z-50"
      style={pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: "hidden" }}
    >
      {children}
    </div>,
    document.body,
  );
}
