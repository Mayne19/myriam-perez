"use client";

import { useState } from "react";

type AccordionItem = { q: string; a: string };

type AccordionProps = {
  items: AccordionItem[];
  /** Index ouvert au chargement. `null` pour tout fermer. */
  defaultOpen?: number | null;
};

/*
  Accordéon : un seul élément ouvert à la fois — en ouvrir un referme
  automatiquement celui qui l'était. La hauteur s'anime en douceur (glisse)
  via `grid-template-rows`, plutôt que le repli instantané d'un <details>.
*/
export default function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q} className={i < items.length - 1 ? "border-b border-espresso-900/10" : ""}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start gap-4 py-5 text-left"
            >
              <span
                aria-hidden
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-lg leading-none text-accent transition-transform duration-300 ease-in-out"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
              >
                +
              </span>
              <span className={`text-espresso-900 ${isOpen ? "font-semibold" : "font-medium"}`}>{item.q}</span>
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pl-9 leading-relaxed text-espresso-400">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
