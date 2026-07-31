/*
  Articles du blog — source de vérité actuelle.
  Ces données servent de repli tant que la table Supabase `articles` n'est
  pas peuplée (voir supabase/articles.sql). Une fois la base branchée, le
  site lit les articles depuis Supabase et ignore ce fichier.
  Format du contenu : markdown maison (##, ###, listes, > [!tip], FAQ:,
  [CTA: ...], images, embeds). Le parseur vit dans src/lib/blog-format.ts.
*/

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  /** Date ISO, ex. "2026-02-12" */
  publishedAt: string;
  readingTime: number;
  coverImageUrl?: string | null;
  tags: string[];
  featured?: boolean;
};

export const BLOG_CATEGORIES = [
  "Certification & agrément",
  "Prise de parole",
  "Structurer sa formation",
  "Marché corporatif",
] as const;

export const SEED_ARTICLES: Article[] = [
  {
    id: "art-01",
    slug: "vendre-formation-professionnelle-entreprise",
    title: "Comment vendre une formation professionnelle en entreprise",
    excerpt:
      "Vendre une formation professionnelle en entreprise demande bien plus que de proposer du contenu. Les organisations recherchent des solutions concrètes adaptées à leurs besoins.",
    category: "Marché corporatif",
    author: "Myriam Perez",
    publishedAt: "2026-02-10",
    readingTime: 5,
    tags: ["vente", "entreprise", "positionnement"],
    content: `## Comprendre ce que l'entreprise achète réellement

Une entreprise n'achète pas une formation : elle achète un résultat. Elle cherche à résoudre un problème concret — une compétence qui manque, un processus mal maîtrisé, une équipe qui n'avance pas.

> [!tip] Posez cette question avant toute présentation : « Quel résultat précis l'équipe doit-elle obtenir ? » Votre formation est la réponse, pas le point de départ.

## Identifier le problème avant de vendre la solution

Pour vendre une formation professionnelle en entreprise, il faut d'abord comprendre le contexte de votre interlocuteur. Trois questions ouvrent la discussion :

- Quel est le problème que votre formation résout concrètement ?
- Qui, dans l'entreprise, mesure aujourd'hui ce problème ?
- Comment le succès de la formation sera-t-il évalué ?

## Structurer une offre orientée résultats

Les organisations achètent une transformation mesurable, pas des heures de contenu. Une offre crédible précise :

1. Les objectifs d'apprentissage, clairs et observables
2. La durée et le format (présentiel, en ligne, hybride)
3. Les livrables concrets remis aux participants

## Mettre en avant votre crédibilité

Votre agrément, vos années d'expérience et vos références de clients rassurent l'acheteur corporatif. Présentez-les comme des preuves, pas comme un curriculum vitae.

FAQ: Dois-je être agréé pour vendre une formation en entreprise ? | L'agrément n'est pas obligatoire, mais il rend vos formations admissibles aux subventions de la loi du 1 %, ce qui facilite nettement la décision d'achat.
FAQ: Combien de temps dure un cycle de vente corporatif ? | Comptez généralement de 4 à 12 semaines entre le premier contact et la signature, selon la taille de l'organisation.
`,
  },
  {
    id: "art-02",
    slug: "prise-de-parole-formateur-capter-attention-groupe-formation",
    title: "Prise de parole du formateur : comment capter l'attention d'un groupe en formation",
    excerpt:
      "La qualité de la transmission dépend de la clarté et de la structure du message. Capter l'attention ne repose pas uniquement sur le contenu.",
    category: "Prise de parole",
    author: "Myriam Perez",
    publishedAt: "2026-01-22",
    readingTime: 4,
    tags: ["prise de parole", "animation", "groupe"],
    content: `## L'attention se capte, puis se construit

La qualité de la transmission dépend de la clarté et de la structure du message. Capter l'attention ne repose pas uniquement sur le contenu.

## Commencer par la première minute

La première minute d'une formation décide de la suite. Décrivez la transformation que les participants vivront, avant même d'annoncer le plan.

> La posture du formateur, c'est d'abord une présence. Le groupe ressent avant de comprendre.

## Structurer son message pour être entendu

- Une idée principale par séquence
- Des exemples concrets qui font image
- Des transitions explicites entre les blocs

## Garder le groupe engagé tout au long

> [!info] Alternez les formats : apport, discussion, exercice. Un groupe qui participe ne décroche pas.

## Le rythme comme outil

Variez l'énergie, marquez des pauses, posez des questions ouvertes. Un formateur qui maîtrise le rythme donne l'impression que le temps passe vite — et que tout était clair.

FAQ: Comment gérer son trac avant une formation ? | Le trac diminue quand on prépare sa première minute et que l'on se concentre sur la valeur apportée au groupe plutôt que sur soi.
FAQ: Quel rythme adopter dans une journée de formation ? | Alternez des apports de 20 à 30 minutes avec des exercices et des échanges.
`,
  },
  {
    id: "art-03",
    slug: "devenir-formateur-certifie-au-quebec",
    title: "Devenir formateur certifié au Québec : structurer son expertise et créer une formation professionnelle crédible",
    excerpt: "Guide complet pour structurer votre expertise et développer votre rôle de formateur au Québec.",
    category: "Certification & agrément",
    author: "Myriam Perez",
    publishedAt: "2026-01-08",
    readingTime: 6,
    tags: ["certification", "CPMT", "Québec"],
    content: `## Qu'est-ce qu'un formateur certifié ?

Un formateur certifié ne se définit pas par un titre, mais par une capacité : transmettre une expertise de façon claire, structurée et adaptée au marché. Au Québec, cette reconnaissance prend généralement la forme d'un programme de formation en transmission des connaissances.

## Les étapes pour structurer son expertise

1. Clarifier ce que vous savez et ce qui vous distingue
2. Organiser vos connaissances dans une progression pédagogique
3. Développer votre posture et vos techniques de communication
4. Bâtir une offre de formation professionnelle

## Comprendre le rôle de la CPMT et de l'agrément

> [!info] La Commission des partenaires du marché du travail (CPMT) encadre la reconnaissance des formations. Un organisme de formation agréé par la CPMT rend ses formations admissibles à certaines subventions pour les entreprises.

## Ce que les entreprises attendent vraiment

Les organisations recherchent des formateurs capables de livrer un apprentissage structuré, mesurable et aligné sur leurs besoins. C'est cette crédibilité que la certification vient renforcer.

FAQ: Quelle est la différence entre certification et agrément CPMT ? | La certification reconnaît que vous avez complété un programme de formation en transmission des connaissances. L'agrément est une reconnaissance officielle qui rend vos formations admissibles aux subventions de la loi du 1 %.
FAQ: Combien de temps faut-il pour devenir formateur certifié ? | Un parcours complet demande environ 135 heures de formation, réparties entre contenus préenregistrés, pratique et sessions en direct.
`,
  },
  {
    id: "art-04",
    slug: "comment-devenir-formateur-certifie-au-quebec-et-structurer-une-formation-professionnelle-reconnue",
    title: "Comment devenir formateur certifié au Québec et structurer une formation professionnelle reconnue",
    excerpt: "Devenir formateur certifié signifie transmettre l'expertise de façon claire, structurée et adaptée au marché.",
    category: "Certification & agrément",
    author: "Myriam Perez",
    publishedAt: "2025-12-15",
    readingTime: 6,
    tags: ["certification", "CPMT", "méthode"],
    content: `## Transmettre une expertise, pas un contenu

Devenir formateur certifié au Québec, c'est apprendre à transformer ce que vous savez en une formation que d'autres peuvent réellement apprendre. Le marché ne récompense pas l'accumulation d'information, mais la clarté de la transmission.

## Construire une formation reconnue

Une formation professionnelle crédible repose sur une structure solide :

- Des objectifs d'apprentissage précis
- Une progression logique, du simple au complexe
- Des exercices qui ancrent les apprentissages
- Une évaluation qui prouve le résultat

## La méthode en 4 étapes

> La structure à la présence, la clarté à l'authenticité, la stratégie à l'essence.

1. Inspirer — clarifier votre message et votre client cible
2. Structurer — organiser vos connaissances
3. Transmettre — développer votre posture
4. Impacter — créer une expérience crédible et engageante

## Être prêt pour le marché corporatif

FAQ: Qu'est-ce qui rend une formation « reconnue » ? | Une formation est dite reconnue lorsqu'elle satisfait à des standards professionnels — par exemple ceux de la CPMT — et qu'elle est admissible à des subventions publiques pour les entreprises.
FAQ: Puis-je suivre le programme à mon rythme ? | Oui. Les contenus préenregistrés sont accessibles pendant 365 jours, et les sessions en direct ont lieu aux deux semaines de septembre à novembre.
`,
  },
  {
    id: "art-05",
    slug: "formateur-certifie-au-dela-certification",
    title: "Devenir formateur certifié : ce que l'on cherche vraiment au-delà de la certification",
    excerpt:
      "Au-delà du certificat, les candidats recherchent à « se sentir enfin prête » et à créer une formation crédible.",
    category: "Certification & agrément",
    author: "Myriam Perez",
    publishedAt: "2025-11-20",
    readingTime: 5,
    tags: ["certification", "confiance", "posture"],
    content: `## Le certificat est un moyen, pas une fin

La certification ouvre des portes, mais ce que cherchent la plupart des professionnels dépasse le papier : se sentir enfin légitime, crédible et prêt à occuper la place de formateur.

> [!warning] Attention au piège : attendre d'être « parfait » avant de commencer. La confiance se construit en transmettant, pas en préparant.

## Les trois attentes cachées

- Une posture assumée devant un groupe
- Une structure qui donne des repères
- Une reconnaissance qui ouvre le marché corporatif

## De la peur du jugement à l'incarnation

La transformation est intérieure avant d'être technique. C'est en explorant sa propre conscience de la transmission que l'on devient un formateur qui incarne ce qu'il enseigne.

## Se préparer sans se paralyser

FAQ: Est-ce que je suis assez prêt·e pour commencer ? | Oui. Vous n'avez pas besoin d'une formation parfaite, mais d'une expertise, d'un désir de transmettre et d'une méthode pour structurer ce que vous savez.
FAQ: La certification garantit-elle des clients ? | Elle garantit une crédibilité et un accès au marché. La vente, elle, se prépare avec un positionnement clair et une offre orientée résultats.
`,
  },
  {
    id: "art-06",
    slug: "structurer-formation-marche-corporatif-quebec",
    title: "Comment structurer une formation pour le marché corporatif au Québec",
    excerpt: "Les entreprises cherchent des formations claires, organisées et orientées vers des résultats concrets.",
    category: "Structurer sa formation",
    author: "Myriam Perez",
    publishedAt: "2025-11-02",
    readingTime: 6,
    tags: ["structuration", "marché corporatif", "méthode"],
    content: `## Ce que le marché corporatif attend

Les entreprises du Québec cherchent des formations claires, organisées et orientées vers des résultats concrets. Elles évaluent votre offre comme elles évalueraient un fournisseur : sur la rigueur et la pertinence.

## Le squelette d'une formation efficace

1. Définir les objectifs d'apprentissage observables
2. Identifier la progression la plus logique
3. Prévoir des exercices d'ancrage après chaque apport
4. Conclure sur une évaluation de la transformation

## Rendre l'expertise transmissible

Le plus grand défi n'est pas le contenu, c'est le pont entre ce que vous savez et ce que les participants peuvent en retenir.

> [!tip] Pour chaque module, demandez-vous : « Que doit être capable de faire le participant à la sortie de ce module ? » La réponse devient votre objectif.

## Présenter une offre professionnelle

- Un titre clair orienté résultat
- Un programme détaillé, heure par heure
- Des modalités précises (durée, format, tarif)

FAQ: Combien de temps doit durer une formation en entreprise ? | Cela dépend de l'objectif. Une demi-journée à deux jours sont les formats les plus courants pour une première offre corporative.
FAQ: Dois-je remettre un document aux participants ? | Oui. Un support structuré renforce la crédibilité de la formation et sert de référence après la session.
`,
  },
  {
    id: "art-07",
    slug: "la-difference-entre-etre-expert-et-etre-pret-a-former-en-entreprise",
    title: "La différence entre être expert… et être prêt à former en entreprise",
    excerpt: "L'expertise seule ne suffit pas ; il faut aussi de la structure et de la sécurité pour former efficacement.",
    category: "Marché corporatif",
    author: "Myriam Perez",
    publishedAt: "2025-10-14",
    readingTime: 5,
    tags: ["expertise", "formation", "préparation"],
    content: `## L'expert sait ; le formateur transmet

L'expert connaît sa matière. Le formateur, lui, organise cette connaissance pour que d'autres l'apprennent. La différence se joue dans la structure et dans la posture.

## Ce qui distingue un expert d'un formateur prêt

- L'expert répond aux questions ; le formateur les provoque
- L'expert déroule son savoir ; le formateur guide une progression
- L'expert montre ; le formateur fait pratiquer

## Les cinq signes que vous êtes prêt

1. Vous pouvez décrire votre formation en trois phrases
2. Vous avez des objectifs d'apprentissage par module
3. Vous avez testé vos exercices sur un vrai groupe
4. Vous savez quoi faire face à une objection
5. Vous présentez une offre écrite et chiffrée

> [!danger] Ne confondez pas volume de contenu et qualité de transmission. Une formation surchargée est la première cause d'échec en entreprise.

## Passer de l'expertise à l'offre

FAQ: Comment savoir si mon expertise est suffisante ? | Posez-vous la question inverse : votre expertise permet-elle de faire atteindre un résultat concret à un groupe ? Si oui, elle est suffisante.
FAQ: Dois-je tester ma formation avant de la vendre ? | Idéalement, oui. Une première session « cobaye » révèle les zones floues de votre structure et renforce votre confiance.
`,
  },
  {
    id: "art-08",
    slug: "leadership-formateur-entreprise-quebec",
    title: "Le leadership du formateur en entreprise : posture et impact professionnel",
    excerpt: "Le leadership du formateur se manifeste par la clarté, la structure et la crédibilité du cadre d'apprentissage.",
    category: "Marché corporatif",
    author: "Myriam Perez",
    publishedAt: "2025-09-30",
    readingTime: 5,
    tags: ["leadership", "posture", "entreprise"],
    content: `## Le leadership ne se décrète pas, il s'incarne

En entreprise, le formateur est d'abord un leader : celui qui fixe le cadre, donne le rythme et installe un climat d'apprentissage sûr. Cette posture se manifeste par la clarté, la structure et la cohérence.

## Les piliers de la posture du formateur

- Une présence posée, sans démonstration de pouvoir
- Des consignes claires, données une fois et assumées
- Une écoute qui accueille la diversité du groupe

> Le leadership du formateur, c'est la capacité de faire progresser un groupe tout en le laissant grandir.

## Créer un cadre d'apprentissage crédible

Un groupe qui sait où il va suit plus facilement. Ouvrez chaque séquence par l'objectif, et refermez-la par une synthèse.

> [!info] La crédibilité du cadre passe aussi par les détails : horaires, supports, salle, méthode. Ce qui est préparé inspire confiance.

## L'impact mesurable du leadership

FAQ: Comment installer une autorité naturelle dès le début ? | Commencez par poser clairement les objectifs et les règles du jeu. La structure initiale est ce qui donne de l'aisance pour la suite.
FAQ: Que faire face à un participant difficile ? | Accueillez la remarque, recadrez l'objectif commun et recentrez le groupe sur la progression. Restez calme et structuré.
`,
  },
  {
    id: "art-09",
    slug: "creer-une-formation-professionnelle-au-quebec",
    title: "Créer une formation professionnelle au Québec",
    excerpt: "Structurer l'expertise pour former avec crédibilité est un défi majeur entre le savoir-faire et sa transmission.",
    category: "Structurer sa formation",
    author: "Myriam Perez",
    publishedAt: "2025-09-12",
    readingTime: 6,
    tags: ["création", "formation", "méthode"],
    content: `## Le défi : passer du savoir-faire à la transmission

Créer une formation professionnelle au Québec, c'est relever un défi majeur : organiser ce que vous savez pour que d'autres puissent l'apprendre, avec crédibilité.

## Les cinq étapes de la création

1. Définir le résultat attendu par le participant
2. Cartographier les connaissances nécessaires pour y arriver
3. Découper le parcours en modules cohérents
4. Concevoir des exercices et des mises en situation
5. Rédiger les supports et valider avec un groupe test

## Éviter les pièges courants

- Vouloir tout couvrir — visez l'essentiel qui transforme
- Copier la structure d'un autre sans l'adapter à votre public
- Ignorer le rythme : l'attention a ses limites

> [!tip] Commencez petit : une formation d'une demi-journée, solide, vaut mieux qu'un programme ambitieux mal exécuté.

## Rendre votre formation professionnelle et vendable

FAQ: Par quoi commencer quand on crée sa première formation ? | Par le résultat final : décrivez précisément ce que le participant saura faire à la fin. Tout le reste se construit à rebours.
FAQ: Combien de temps prend la conception d'une formation ? | Comptez plusieurs semaines pour une demi-journée solide, avec test auprès d'un groupe avant la version finale.
`,
  },
  {
    id: "art-10",
    slug: "de-l-expertise-a-l-impact-mesurable",
    title: "De l'expertise à l'impact mesurable",
    excerpt: "« On ne naît pas communicateur·trice, on le devient » en développant ses compétences progressivement.",
    category: "Structurer sa formation",
    author: "Myriam Perez",
    publishedAt: "2025-08-25",
    readingTime: 4,
    tags: ["impact", "mesure", "compétences"],
    content: `## Mesurer la transformation, pas le contenu

L'impact d'une formation ne se mesure pas au nombre d'heures, mais à la transformation réelle des participants. « On ne naît pas communicateur·trice, on le devient » — de la même manière, on devient formateur par la pratique structurée.

## Des objectifs observables

Un objectif d'apprentissage est mesurable lorsqu'il décrit un comportement :

- Le participant reformule les étapes clés
- Le participant applique la méthode sur un cas réel
- Le participant reçoit un retour sur sa pratique

> [!info] Définissez des critères de réussite dès la conception : c'est ce qui rendra la formation crédible auprès des entreprises.

## Des indicateurs pour prouver l'impact

1. L'évaluation à chaud (satisfaction, acquis)
2. L'application en situation réelle (suivi à 30 jours)
3. Le retour du gestionnaire (changement observé)

## Faire de l'impact un argument de vente

FAQ: Comment prouver l'efficacité de ma formation ? | En définissant des objectifs observables et en recueillant des retours après application en contexte réel. Ces preuves deviennent vos meilleurs arguments.
FAQ: Qu'est-ce qu'un bon taux de satisfaction ? | Au-delà des scores, ce qui compte, c'est l'écart entre avant et après : ce que les participants savent faire qu'ils ne savaient pas faire.
`,
  },
  {
    id: "art-11",
    slug: "devenir-formatrice-certifiee-et-agreee-la-cle-dune-nouvelle-carriere-prospere",
    title: "Devenir formatrice certifiée et agréée : la clé d'une nouvelle carrière prospère",
    excerpt: "Devenir formatrice agréée représente une opportunité vers une carrière enrichissante et reconnue.",
    category: "Certification & agrément",
    author: "Myriam Perez",
    publishedAt: "2025-08-06",
    readingTime: 6,
    tags: ["carrière", "certification", "femmes"],
    content: `## Une nouvelle étape de carrière

Devenir formatrice certifiée et agréée est une occasion de transformer votre expertise en une carrière enrichissante, reconnue et alignée avec vos valeurs.

## Ce que la certification change concrètement

- Une crédibilité immédiate auprès des entreprises
- Un accès à des mandats de formation rémunérés
- Une structure qui vous libère du doute

> Le marché ne manque pas d'experts. Il manque de formatrices et de formateurs capables de transmettre avec structure, présence et impact.

## Bâtir un parcours à votre image

1. Faire le point sur votre expertise et vos forces
2. Suivre une formation en transmission des connaissances
3. Concevoir votre formation avec un accompagnement
4. Structurer votre offre et votre positionnement

## Agrément CPMT : pourquoi c'est un atout

> [!warning] L'agrément CPMT est un levier, pas un prérequis. Il rend vos formations admissibles aux subventions de la loi du 1 % et simplifie la vente en entreprise — mais la valeur de votre parcours vient d'abord de votre méthode.

## Franchir le pas

FAQ: Est-ce le bon moment pour moi ? | Si vous avez une expertise, l'envie de transmettre et un peu de structure, c'est le bon moment. La suite se construit par étapes.
FAQ: Que faire si je n'ai jamais donné de formation ? | Rassurez-vous : le programme est conçu pour accompagner la construction complète de votre formation, du message jusqu'à la certification.
`,
  },
];
