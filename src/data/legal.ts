export type LegalSubsection = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export type LegalSection = {
  id: string;
  title: string;
  intro?: string;
  paragraphs?: string[];
  items?: string[];
  email?: string;
  subsections?: LegalSubsection[];
};

export const PRIVACY_META = {
  title: "Politique de confidentialité et responsabilité du client",
  subtitle:
    "Les formations offertes par Myriam Perez Inc. — Numéro d'agrément : 0060464",
  lastUpdated: "Dernière mise à jour : 2026",
};

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "formations-reconnues",
    title: "Formations reconnues",
    paragraphs: [
      "Les formations offertes sont reconnues par Emploi-Québec. En complétant nos programmes de formation certifiés, vous aurez la possibilité de demander votre agrément auprès d'Emploi-Québec.",
    ],
  },
  {
    id: "engagement-confidentialite",
    title: "Engagement envers la confidentialité",
    paragraphs: [
      "Nous respectons vos droits concernant la protection de la vie privée et la confidentialité de vos informations personnelles.",
    ],
  },
  {
    id: "utilisation-renseignements",
    title: "Utilisation des renseignements personnels",
    paragraphs: [
      "Vos informations personnelles sont exclusivement utilisées pour les besoins des services et formations offerts. Nous garantissons qu'aucune de ces informations ne sera partagée avec des tiers sans votre consentement préalable.",
    ],
  },
  {
    id: "exactitude-informations",
    title: "Exactitude des informations",
    paragraphs: [
      "Lors de votre processus d'inscription, il est impératif que toutes les informations fournies soient exactes et vous concernant personnellement. Il est interdit de s'inscrire sous une identité autre que la vôtre.",
    ],
  },
  {
    id: "restriction-age",
    title: "Restriction d'âge",
    paragraphs: [
      "Vous devez être âgé d'au moins 18 ans pour participer aux formations. Cette politique est stricte et vise à assurer la compétence et la maturité nécessaires pour comprendre et accepter les conditions et obligations des programmes de formation.",
    ],
  },
  {
    id: "securite-donnees",
    title: "Sécurité des données",
    paragraphs: [
      "Les données personnelles recueillies sont conservées dans un environnement sécurisé.",
    ],
  },
  {
    id: "support-client",
    title: "Support client",
    paragraphs: [
      "Pour toute assistance, notre équipe de support client est à votre disposition. Contactez-nous pour toute question ou besoin d'aide.",
    ],
    email: "info@myriamperez.ca",
  },
  {
    id: "avertissement-medical-legal",
    title: "Avertissement médical et légal",
    paragraphs: [
      "L'information fournie dans le cadre des formations a un but strictement éducatif et de développement des compétences et ne doit en aucun cas servir à diagnostiquer ou traiter des conditions médicales ou autres. Il est essentiel de consulter un professionnel de la santé ou un autre spécialiste en cas de besoin.",
      "Les formations ne se substituent pas à des conseils médicaux, juridiques ou financiers professionnels.",
    ],
  },
  {
    id: "droits-auteur",
    title: "Droits d'auteur et propriété intellectuelle",
    paragraphs: [
      "Le contenu partagé lors des formations est la propriété intellectuelle exclusive de l'organisme de formation. Il est formellement interdit de partager ou diffuser ce contenu en ligne. Il est destiné à un usage personnel et professionnel uniquement.",
      "En cas de report de dates de formation, l'organisme de formation se réserve le droit de modifier la date sans pénalité.",
    ],
  },
  {
    id: "entente-confidentialite",
    title: "Entente de confidentialité des formations",
    paragraphs: [
      "Les sessions de formation sont enregistrées et diffusées sur une plateforme sécurisée. La plateforme permet aux participants d'accéder à leur espace privé où le contenu des formations achetées sera disponible. En tant que participant, vous êtes autorisé à utiliser ce matériel enregistré (vidéos, audios, photos, documents) uniquement à des fins personnelles et dans le cadre de la formation. Il est interdit de partager ou de diffuser ce contenu à des tiers.",
      "En s'inscrivant, les participants acceptent que les sessions soient enregistrées et que leur image ou voix puisse être captée lors des formations. Ces enregistrements seront accessibles aux autres participants inscrits afin de leur permettre de suivre les sessions en différé.",
    ],
  },
  {
    id: "politique-remboursement",
    title: "Politique de remboursement",
    paragraphs: [
      "Aucun remboursement n'est possible après l'achat d'une formation. En cas de maladie, la personne pourra reporter la formation à une date ultérieure.",
    ],
  },
  {
    id: "informations-complementaires",
    title: "Informations complémentaires",
    paragraphs: [
      "Pour toute question supplémentaire, n'hésitez pas à nous contacter. Nous serons heureux de vous répondre et de vous accompagner dans votre parcours de formation.",
    ],
  },
];
