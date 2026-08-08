"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ResumeCard from "@/components/espace/ResumeCard";
import MiniCourseCard from "@/components/espace/MiniCourseCard";
import type { CourseSummary } from "@/lib/learning";

// Trois cartes visibles, qui remplissent toute la largeur du rail.
const VISIBLE_CARDS = 3;
const GAP = 12; // gap-3

/*
  « Reprendre votre formation » + le rail « À découvrir » en dessous.
  Trois cartes occupent toute la largeur ; les flèches, sur la même ligne que
  le titre, font défiler le rail horizontalement quand il y en a davantage.
  Le rail grandit (flex-1) pour que son bas finisse sur la même ligne que le
  bas de « Progression par formation », avec 173 px de minimum.
*/
export default function ResumeSection({
  resume,
  discover,
}: {
  resume: CourseSummary;
  discover: { course: CourseSummary; started: boolean }[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [discover.length]);

  const scroll = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? el.clientWidth / VISIBLE_CARDS) + GAP;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <>
      <h2 className="text-2xl font-medium text-espresso-900">Reprendre votre formation</h2>
      <div className="mt-5">
        <ResumeCard course={resume} started />
      </div>
      {discover.length > 0 && (
        <>
          <div className="mt-8 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-medium text-espresso-900">À découvrir</h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => scroll(-1)}
                disabled={!canPrev}
                aria-label="Défiler vers la gauche"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/20 text-espresso-900 transition-colors hover:bg-espresso-900 hover:text-cream-50 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                disabled={!canNext}
                aria-label="Défiler vers la droite"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/20 text-espresso-900 transition-colors hover:bg-espresso-900 hover:text-cream-50 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
          <div
            ref={trackRef}
            onScroll={update}
            className="no-scrollbar mt-3 flex flex-1 min-h-[173px] snap-x snap-mandatory gap-3 overflow-x-auto"
          >
            {discover.map(({ course, started }) => (
              <div key={course.id} className="w-[calc((100%-1.5rem)/3)] shrink-0 snap-start">
                <MiniCourseCard course={course} started={started} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
