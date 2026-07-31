"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";

// 6 photos réelles, libres de droits, qu'on fait tourner sur les 17 témoignages.
const IMAGES = [
  "/images/login/login-1.jpg",
  "/images/login/login-2.jpg",
  "/images/login/login-3.jpg",
  "/images/login/login-4.jpg",
  "/images/login/login-5.jpg",
  "/images/login/login-6.jpg",
];

const TOTAL = TESTIMONIALS.length;
// Une clone du dernier témoignage au début, et du premier à la fin : permet
// de boucler dans les deux sens sans jamais glisser à l'envers.
const SLIDES = [TOTAL - 1, ...TESTIMONIALS.map((_, i) => i), 0];

/*
  Panneau visuel de la page login/inscription : une photo pleine hauteur,
  coins arrondis. Chaque témoignage (image + citation) glisse de la droite
  vers la gauche, comme on tourne une page, et reste affiché un instant.
  Défile tout seul ; les flèches, fixes, permettent de basculer manuellement.
*/
export default function LoginTestimonialCarousel() {
  const [pos, setPos] = useState(1); // 1 = premier vrai témoignage
  const [instant, setInstant] = useState(false);

  const go = (direction: 1 | -1) => setPos((p) => p + direction);

  useEffect(() => {
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, []);

  // Une fois la transition finie, si on est sur un clone, saute
  // instantanément à l'équivalent réel — invisible pour l'œil.
  const handleTransitionEnd = () => {
    if (pos === SLIDES.length - 1) {
      setInstant(true);
      setPos(1);
    } else if (pos === 0) {
      setInstant(true);
      setPos(TOTAL);
    }
  };

  useEffect(() => {
    if (!instant) return;
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setInstant(false));
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, [instant]);

  return (
    <div className="relative hidden h-full overflow-hidden rounded-[32px] lg:block">
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full ${instant ? "" : "transition-transform duration-700 ease-in-out"}`}
        style={{ transform: `translateX(-${pos * 100}%)` }}
      >
        {SLIDES.map((testimonialIndex, slot) => {
          const t = TESTIMONIALS[testimonialIndex];
          return (
            <div key={slot} className="relative h-full w-full shrink-0">
              <Image
                src={IMAGES[testimonialIndex % IMAGES.length]}
                alt=""
                fill
                priority={slot === 1}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-espresso-900/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-10 pb-24">
                <p className="text-xl italic leading-relaxed text-cream-50">« {t.quote} »</p>
                <div className="mt-6">
                  <p className="font-medium text-cream-50">{t.name}</p>
                  {t.role && <p className="mt-0.5 text-sm text-cream-100/70">{t.role}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flèches fixes, par-dessus le carrousel */}
      <div className="absolute bottom-10 left-10 z-10 flex gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Témoignage précédent"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/30 text-cream-50 transition-colors hover:bg-cream-50 hover:text-espresso-900"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Témoignage suivant"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/30 text-cream-50 transition-colors hover:bg-cream-50 hover:text-espresso-900"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
