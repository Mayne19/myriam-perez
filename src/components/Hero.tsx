import Image from "next/image";
import Button from "./Button";
import SplitHeading from "./SplitHeading";
import { CALENDLY_URL } from "@/data/nav";
import { HOME } from "@/data/content";

export default function Hero() {
  return (
    <section className="relative bg-cream-50 pb-16 pt-10 sm:pb-20 sm:pt-14">
      {/* Nom en très grand texte de fond — taille plafonnée pour rester dans les marges */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <span
          aria-hidden
          className="pointer-events-none block select-none whitespace-nowrap text-center font-sans text-[clamp(2.25rem,13vw,11.5rem)] font-bold leading-none tracking-tight text-espresso-900/[0.08]"
        >
          Myriam Perez
        </span>
      </div>

      <div className="mx-auto mt-3 max-w-7xl px-6 sm:mt-5 lg:px-10">
        {/*
          Bloc marron : la photo collée au bord bas, avec le texte de part et
          d'autre. La photo déborde en haut et recouvre légèrement le nom.
        */}
        <div
          data-section-theme="dark"
          className="relative h-[580px] rounded-[40px] bg-espresso-900 sm:h-[600px] sm:rounded-[56px] lg:h-[510px]"
        >
          {/* Photo en absolu : sa taille n'influence pas la hauteur du bloc */}
          <div className="reveal-scale absolute bottom-0 left-1/2 z-10 w-[480px] max-w-full -translate-x-1/2 sm:w-[700px] lg:w-[960px]">
            <Image
              src="/images/myriam.png"
              alt="Myriam Perez, formatrice agréée et coach"
              width={2400}
              height={1600}
              priority
              sizes="(min-width: 1024px) 960px, (min-width: 640px) 700px, 480px"
              className="photo-fade-bottom block h-auto w-full"
            />
          </div>

          {/* Textes de part et d'autre de la photo */}
          <div className="absolute inset-0 z-20 flex flex-col gap-8 p-8 pt-6 sm:p-10 sm:pt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:p-14 lg:pb-40">
            {/* Colonne gauche : titre + bouton principal */}
            <div className="reveal reveal-d2 max-w-sm lg:max-w-[19rem]">
              <SplitHeading
                as="h2"
                text="Devenez formateur certifié au Québec et transformez votre expertise en formation reconnue"
                muted={["formateur", "certifié", "expertise"]}
                className="text-[1.75rem] font-medium leading-snug tracking-normal lg:text-4xl"
                boldClassName="text-cream-50"
                mutedOpacity={0.4}
              />
              <div className="mt-8">
                <Button href={CALENDLY_URL} external variant="primary">
                  {HOME.ctaMeeting}
                </Button>
              </div>
            </div>

            {/* Colonne droite : texte + bouton secondaire */}
            <div className="reveal reveal-d4 max-w-sm lg:max-w-[19rem] lg:text-right">
              <p className="text-lg leading-relaxed text-cream-100/80">
                Le programme conçu pour les professionnels, coachs, consultants, experts et responsables RH qui
                veulent structurer leur expertise et accéder au marché corporatif.
              </p>
              <div className="mt-8">
                <Button href="/programme" variant="secondary">
                  {HOME.ctaProgram}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
