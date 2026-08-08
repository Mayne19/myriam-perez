import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

type LearningOutcome = {
  text: string;
};

type CourseContentData = {
  learningOutcomes: LearningOutcome[];
};

const COURSE_CONTENT: Record<string, CourseContentData> = {
  "formation-1": {
    learningOutcomes: [
      { text: "Poser sa voix et structurer son message avec assurance" },
      { text: "Respirer correctement pour gérer le stress avant de parler" },
      { text: "Captiver votre auditoire dès les premières secondes" },
      { text: "Utiliser les techniques de respiration diaphragmatique" },
      { text: "Clore votre prise de parole avec impact memorable" },
    ],
  },
  "formation-2": {
    learningOutcomes: [
      { text: "Définir des objectifs pédagogiques clairs et mesurables" },
      { text: "Concevoir un contenu interactif et engageant" },
      { text: "Rédiger un script fluide avec des transitions efficaces" },
      { text: "Préparer des supports visuels professionnels" },
      { text: "Tester, ajuster et lancer votre formation" },
    ],
  },
  "formation-3": {
    learningOutcomes: [
      { text: "Lire une salle et détecter les signaux d'engagement" },
      { text: "Gérer les participants difficiles avec tact" },
      { text: "Stimuler la participation active de votre groupe" },
      { text: "Maintenir l'énergie tout au long de la session" },
      { text: "Évaluer les acquis à la fin de la formation" },
    ],
  },
  "formation-4": {
    learningOutcomes: [
      { text: "Construire une offre de formation attractive" },
      { text: "Développer votre visibilité et votre présence en ligne" },
      { text: "Fidéliser vos apprenants avec un suivi personnalisé" },
      { text: "Générer des revenus récurrents avec votre offre" },
      { text: "Automatiser vos workflows pour accélérer votre croissance" },
    ],
  },
  "formation-5": {
    learningOutcomes: [
      { text: "Adopter la posture du formateur accompli et charismatique" },
      { text: "Maîtriser le langage corporel pour amplifier votre message" },
      { text: "Utiliser votre voix comme véritable outil pédagogique" },
      { text: "Raconter des histoires captivantes pour illustrer vos propos" },
      { text: "Gérer votre stress avec des techniques de pleine conscience" },
    ],
  },
};

export function getCourseContent(slug: string): CourseContentData | null {
  return COURSE_CONTENT[slug] ?? null;
}

export default function CourseContentCard({ slug }: { slug: string }) {
  const content = getCourseContent(slug);
  if (!content) return null;

  return (
    <div className="flex flex-col rounded-2xl border border-espresso-900/10 bg-white p-6">
      <h2 className="text-lg font-medium text-espresso-900">Contenu de la formation</h2>

        <p className="mt-2 text-sm text-espresso-500">
          Dans ce cours, vous allez apprendre comment :
        </p>

      <ul className="mt-4 flex flex-col gap-2.5">
        {content.learningOutcomes.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span className="text-sm text-espresso-700">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
