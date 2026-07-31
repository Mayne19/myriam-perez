export type Testimonial = {
  name: string;
  role?: string;
  quote: string;
  category: "formation" | "coaching";
};

// Témoignages récupérés tels quels sur myriamperez.ca/temoignages
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Danièle Henkel",
    role: "Présidente, Les Entreprises Danièle Henkel",
    quote:
      "J'ai eu le privilège de travailler avec madame Perez dans le cadre de plusieurs mandats au sein de mon entreprise. Son expérience et ses dons d'organisation et de communication ont eu un effet bénéfique sur l'organisation de mes équipes.",
    category: "formation",
  },
  {
    name: "Ferdy Ed.",
    quote:
      "Un programme qui m'a aidé à évoluer vers le niveau supérieur. Myriam est une professionnelle aguerrie, riche d'expérience et passionnée par la transformation des autres.",
    category: "formation",
  },
  {
    name: "Sylvie Dale",
    role: "Autrice de L'incertitude de l'aube",
    quote:
      "L'écoute active et bienveillante de Myriam, sa façon de nous mettre en confiance, combinée à de vastes connaissances et à sa grande expérience, font d'elle une formatrice compétente.",
    category: "formation",
  },
  {
    name: "Gaétan Dauphin",
    role: "Enseignant Vente-conseil, École Professionnelle de Saint-Hyacinthe",
    quote: "Elle a suscité des prises de conscience sur le moment au grand bénéfice des gens.",
    category: "formation",
  },
  {
    name: "Mario Saucier",
    role: "Studio M.Saucier inc., V.-p. Affaires et développement québécois",
    quote: "Cette formation m'a donné des outils pour détecter, comprendre et analyser le stress.",
    category: "formation",
  },
  {
    name: "Linda Méchaly",
    role: "Directrice, École Murielle-Dumont",
    quote:
      "Elle nous transmet comment passer d'un état présent à un état désiré en comprenant les trois phases du changement.",
    category: "formation",
  },
  {
    name: "Sylvain Demers",
    role: "Vice-président, APEQ",
    quote:
      "Les outils simples et efficaces ont permis à tous de prendre des prises de conscience significatives.",
    category: "formation",
  },
  {
    name: "Eloise Croteau",
    quote: "Ses qualités d'accompagnateur, sa présence et sa clarté d'esprit sont remarquables.",
    category: "formation",
  },
  {
    name: "Linda Méchaly et Line Lecourt",
    role: "Directrice et directrice adjointe, École Sainte-Catherine-Labouré",
    quote: "L'équipe est ressortie énergisée et prête à relever des défis.",
    category: "formation",
  },
  {
    name: "Jacques Moreau",
    quote: "Son coaching dépasse mes attentes, elle prend le temps de m'expliquer clairement chaque étape.",
    category: "coaching",
  },
  {
    name: "Dominique Mennessier",
    role: "Centre Soha",
    quote: "Elle m'a permis d'intégrer chaque étape en tenant compte de tous les aspects de qui je suis.",
    category: "coaching",
  },
  {
    name: "Philip Malek",
    quote: "Ces séances de coaching nous aident à mieux performer et nous adapter aux différentes personnalités.",
    category: "coaching",
  },
  {
    name: "Nancy Benamor",
    quote: "Grâce au travail fait avec Myriam j'ai réussi à me surpasser et évoluer mon entreprise.",
    category: "coaching",
  },
  {
    name: "Maryse Piché",
    quote: "M'auto analyser m'a permis de continuer mes efforts vers de belles opportunités.",
    category: "coaching",
  },
  {
    name: "Rosie Nathan Benharroch",
    quote: "Merci de tout cœur Myriam, tu apportes beaucoup de bien aux gens qui t'approchent.",
    category: "coaching",
  },
  {
    name: "Pascale Dray",
    quote: "Elle a tous les outils et la spiritualité nécessaires pour nous amener à nous dépasser.",
    category: "coaching",
  },
  {
    name: "Valérie K",
    quote: "J'ai eu la chance de me connaître davantage, de reconnaître mes insécurités et mes peurs.",
    category: "coaching",
  },
];
