import Image from "next/image";
import FadeIn from "./FadeIn";
import { PROGRAM } from "@/data/content";

/*
  « Un instant pour vous reconnaître ».
  Deux colonnes : à gauche le titre et les questions en liste verticale reliée,
  à droite la citation, un encart de chiffres et un visuel.
  Composant partagé — utilisé à l'identique sur l'accueil et sur la page Formation.
*/
export default function RecognizeSection() {
  return (
    <section data-section-theme="dark" className="bg-espresso-900 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Titre pleine largeur, au-dessus des deux colonnes */}
        <FadeIn>
          <p className="text-xs font-medium tracking-[0.2em] text-accent">{PROGRAM.recognizeTitle}</p>
          <p className="mt-6 max-w-3xl text-2xl font-medium leading-snug text-cream-50 sm:text-3xl">
            {PROGRAM.recognizeLead}
          </p>
        </FadeIn>

        {/* Colonnes 35 % / 65 % : la partie droite est plus large. Les deux
            colonnes démarrent directement par leur contenu, sur la même ligne. */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)] lg:gap-16">
          {/* Colonne gauche : liste verticale reliée */}
          <div>
            {/* Le filet vertical relie les puces entre elles */}
            <ul className="space-y-7 border-l border-cream-50/15 pl-8">
              {PROGRAM.questions.map((q, i) => (
                <FadeIn key={q} delay={i * 0.06}>
                  <li className="relative">
                    <span className="absolute -left-[2.3rem] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-accent ring-4 ring-espresso-900" />
                    <span className="leading-relaxed text-cream-100/80">{q}</span>
                  </li>
                </FadeIn>
              ))}
            </ul>
          </div>

          {/* Colonne droite : sous-titre et citation en haut, puis chiffres et visuel */}
          <div className="flex flex-col gap-5">
            <FadeIn delay={0.1}>
              <p className="text-xl text-cream-100/60">{PROGRAM.recognizeSub}</p>
              <p className="mt-5 text-lg italic leading-relaxed text-cream-50">
                « {PROGRAM.recognizeClosing} »
              </p>
            </FadeIn>

            {/*
              L'encart de chiffres se pose en haut du visuel et le chevauche.
              `w-fit` le limite à la largeur de son contenu, comme la carte
              verte de la référence.
            */}
            <FadeIn delay={0.16} className="relative flex-1">
              <div className="relative z-10 mx-auto w-fit rounded-2xl bg-[linear-gradient(135deg,#F07020_0%,#C05A18_100%)] p-5 shadow-[0_16px_40px_-16px_rgba(38,34,30,0.7)]">
                <div className="flex divide-x divide-cream-50/25">
                  <div className="pr-5">
                    <p className="text-3xl font-medium tracking-tight text-cream-50">25+</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cream-50/75">
                      Ans d&apos;expérience
                    </p>
                  </div>
                  <div className="pl-5">
                    <p className="text-3xl font-medium tracking-tight text-cream-50">135 h</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cream-50/75">De formation</p>
                  </div>
                </div>
              </div>

              <div className="-mt-10 overflow-hidden rounded-3xl">
                <Image
                  src="/images/pourquoi-choisir.jpg"
                  alt="Une formatrice animant une séance auprès d'un groupe de professionnels"
                  width={1916}
                  height={821}
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="h-full min-h-[240px] w-full object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
