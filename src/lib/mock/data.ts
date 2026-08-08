import fs from "fs";
import os from "os";
import path from "path";
import { SEED_ARTICLES, BLOG_CATEGORIES } from "@/data/articles";
import type { AdminArticle, ArticleInput } from "@/lib/admin/articles";
import type { BlogCategory } from "@/lib/admin/categories";
import type { TeamMember, InvitationRow } from "@/lib/admin/team";
import type { LearnerRow } from "@/lib/admin/learners";

/*
  Données fictives pour le mode démo (voir src/lib/demo.ts). Les données
  statiques (formations, apprenants) sont de simples constantes. Les données
  modifiables pendant une session de test (articles, invitations, rôles,
  progression vidéo) sont persistées dans un fichier JSON temporaire — en
  dev, Next.js réinstancie les modules serveur entre certaines requêtes, donc
  un simple tableau en mémoire ne survit pas d'une Server Action à l'autre.
  Ce n'est toujours pas une base de données : le fichier se régénère depuis
  les seeds ci-dessous s'il est supprimé, et tout ça disparaît une fois
  Supabase connecté (isSupabaseConfigured() bascule alors ce chemin entier).
*/

const SAMPLE_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export type MockVideo = { id: string; title: string; videoUrl: string; durationSeconds: number; orderIndex: number };
export type MockChapter = { id: string; courseId: string; title: string; orderIndex: number; videos: MockVideo[] };
export type MockCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string | null;
  chapters: MockChapter[];
};

export const MOCK_COURSES: MockCourse[] = [
  {
    id: "course-1",
    slug: "formation-1",
    title: "Formation 1 — Prise de parole stratégique et impact professionnel",
    description: "Développer une communication claire et assurée face à votre audience.",
    coverImageUrl: null,
    chapters: [
      {
        id: "chapter-1-1",
        courseId: "course-1",
        title: "Poser sa voix et sa posture",
        orderIndex: 1,
        videos: [
          { id: "video-1-1-1", title: "Introduction", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
          { id: "video-1-1-2", title: "Respiration et ancrage", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 2 },
        ],
      },
      {
        id: "chapter-1-2",
        courseId: "course-1",
        title: "Structurer son message",
        orderIndex: 2,
        videos: [
          { id: "video-1-2-1", title: "La règle des trois idées", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-1-3",
        courseId: "course-1",
        title: "Gérer le stress avant de parler",
        orderIndex: 3,
        videos: [
          { id: "video-1-3-1", title: "Techniques de relaxation", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-1-4",
        courseId: "course-1",
        title: "Captiver son auditoire",
        orderIndex: 4,
        videos: [
          { id: "video-1-4-1", title: "L'art du suspense", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-1-5",
        courseId: "course-1",
        title: "Les techniques de respiration",
        orderIndex: 5,
        videos: [
          { id: "video-1-5-1", title: "Respiration diaphragmatique", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
    ],
  },
  {
    id: "course-2",
    slug: "formation-2",
    title: "Formation 2 — Concevoir une formation de A à Z",
    description: "Structurer un contenu complet, des objectifs réalistes et un plan adapté au marché.",
    coverImageUrl: null,
    chapters: [
      {
        id: "chapter-2-1",
        courseId: "course-2",
        title: "Définir les objectifs pédagogiques",
        orderIndex: 1,
        videos: [
          { id: "video-2-1-1", title: "Objectifs mesurables", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
          { id: "video-2-1-2", title: "Découper en modules", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 2 },
        ],
      },
      {
        id: "chapter-2-2",
        courseId: "course-2",
        title: "Concevoir le contenu interactif",
        orderIndex: 2,
        videos: [
          { id: "video-2-2-1", title: "Quiz et exercices", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-2-3",
        courseId: "course-2",
        title: "Rédiger le script",
        orderIndex: 3,
        videos: [
          { id: "video-2-3-1", title: "Planifier le fil conducteur", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
          { id: "video-2-3-2", title: "Écrire les transitions", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 2 },
        ],
      },
      {
        id: "chapter-2-4",
        courseId: "course-2",
        title: "Préparer le support visuel",
        orderIndex: 4,
        videos: [
          { id: "video-2-4-1", title: "Diapositives efficaces", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-2-5",
        courseId: "course-2",
        title: "Tester et ajuster",
        orderIndex: 5,
        videos: [
          { id: "video-2-5-1", title: "Séance test", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
          { id: "video-2-5-2", title: "Corrections et révisions", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 2 },
        ],
      },
      {
        id: "chapter-2-6",
        courseId: "course-2",
        title: "Lancer sa formation",
        orderIndex: 6,
        videos: [
          { id: "video-2-6-1", title: "Mise en ligne", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
    ],
  },
  {
    id: "course-3",
    slug: "formation-3",
    title: "Formation 3 — Former avec impact et maîtriser la dynamique de groupe",
    description: "Animer un groupe, gérer les interactions et maintenir l'engagement.",
    coverImageUrl: null,
    chapters: [
      {
        id: "chapter-3-1",
        courseId: "course-3",
        title: "Lire une salle",
        orderIndex: 1,
        videos: [
          { id: "video-3-1-1", title: "Les signaux d'engagement", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-3-2",
        courseId: "course-3",
        title: "Gérer les participants difficiles",
        orderIndex: 2,
        videos: [
          { id: "video-3-2-1", title: "Techniques de recadrage", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
          { id: "video-3-2-2", title: "Transformer les objections", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 2 },
        ],
      },
      {
        id: "chapter-3-3",
        courseId: "course-3",
        title: "Stimuler la participation",
        orderIndex: 3,
        videos: [
          { id: "video-3-3-1", title: "Questions interactives", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-3-4",
        courseId: "course-3",
        title: "Maintenir l'énergie",
        orderIndex: 4,
        videos: [
          { id: "video-3-4-1", title: "Pause et activités", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
          { id: "video-3-4-2", title: "Jeux et cas pratiques", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 2 },
        ],
      },
      {
        id: "chapter-3-5",
        courseId: "course-3",
        title: "Clore une session",
        orderIndex: 5,
        videos: [
          { id: "video-3-5-1", title: "Synthèse et engagement", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-3-6",
        courseId: "course-3",
        title: "Évaluer les acquis",
        orderIndex: 6,
        videos: [
          { id: "video-3-6-1", title: "Quiz final", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
    ],
  },
  {
    id: "course-4",
    slug: "formation-4",
    title: "Formation 4 — Développer son activité de formateur",
    description: "Stratégie, leadership et rentabilité d'une offre de formation.",
    coverImageUrl: null,
    chapters: [
      {
        id: "chapter-4-1",
        courseId: "course-4",
        title: "Construire son offre",
        orderIndex: 1,
        videos: [
          { id: "video-4-1-1", title: "Positionnement tarifaire", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-4-2",
        courseId: "course-4",
        title: "Marketing et visibilité",
        orderIndex: 2,
        videos: [
          { id: "video-4-2-1", title: "Présence en ligne", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
          { id: "video-4-2-2", title: "Réseaux sociaux", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 2 },
        ],
      },
      {
        id: "chapter-4-3",
        courseId: "course-4",
        title: " Fidéliser les apprenants",
        orderIndex: 3,
        videos: [
          { id: "video-4-3-1", title: "Suivi personnalisé", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-4-4",
        courseId: "course-4",
        title: "Générer des revenus",
        orderIndex: 4,
        videos: [
          { id: "video-4-4-1", title: "Modèles de tarification", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
          { id: "video-4-4-2", title: "Ventes incitatives", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 2 },
        ],
      },
      {
        id: "chapter-4-5",
        courseId: "course-4",
        title: "Planifier sa croissance",
        orderIndex: 5,
        videos: [
          { id: "video-4-5-1", title: "Objectifs à 6 mois", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-4-6",
        courseId: "course-4",
        title: "Automatiser",
        orderIndex: 6,
        videos: [
          { id: "video-4-6-1", title: "Outils et workflows", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
    ],
  },
  {
    id: "course-5",
    slug: "formation-5",
    title: "Formation 5 — L'art de former",
    description: "Posture, aisance et excellence en animation devant un public.",
    coverImageUrl: null,
    chapters: [
      {
        id: "chapter-5-1",
        courseId: "course-5",
        title: "La posture du formateur accompli",
        orderIndex: 1,
        videos: [
          { id: "video-5-1-1", title: "Authority et charisme", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-5-2",
        courseId: "course-5",
        title: "Le langage corporel",
        orderIndex: 2,
        videos: [
          { id: "video-5-2-1", title: "Gestes et regard", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
          { id: "video-5-2-2", title: "Déplacement sur scène", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 2 },
        ],
      },
      {
        id: "chapter-5-3",
        courseId: "course-5",
        title: "La voix comme outil",
        orderIndex: 3,
        videos: [
          { id: "video-5-3-1", title: "Moduler le ton", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
      {
        id: "chapter-5-4",
        courseId: "course-5",
        title: "Raconter des histoires",
        orderIndex: 4,
        videos: [
          { id: "video-5-4-1", title: "Le pouvoir du storytelling", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
          { id: "video-5-4-2", title: "Exemples vécus", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 2 },
        ],
      },
      {
        id: "chapter-5-5",
        courseId: "course-5",
        title: "Gérer le stress",
        orderIndex: 5,
        videos: [
          { id: "video-5-5-1", title: "Pleine conscience", videoUrl: SAMPLE_VIDEO_URL, durationSeconds: 596, orderIndex: 1 },
        ],
      },
    ],
  },
];

export const MOCK_LEARNERS: LearnerRow[] = [
  { id: "demo-learner", fullName: "Alex Tremblay", email: "alex@exemple.com", paymentStatus: "active", createdAt: "2026-06-01", completedVideos: 6, totalVideos: 38, percent: 16 },
  { id: "learner-2", fullName: "Sophie Bergeron", email: "sophie@exemple.com", paymentStatus: "active", createdAt: "2026-06-10", completedVideos: 38, totalVideos: 38, percent: 100 },
  { id: "learner-3", fullName: "Marc-André Gagnon", email: "marc@exemple.com", paymentStatus: "pending", createdAt: "2026-07-20", completedVideos: 0, totalVideos: 38, percent: 0 },
];

// --- Stockage fichier pour la partie modifiable (articles, invitations, --
// --- rôles de l'équipe, progression vidéo) ---------------------------------

type ProgressEntry = { secondsWatched: number; completed: boolean; lastOpenedAt?: string };
type StoreShape = {
  articles: AdminArticle[];
  categories: BlogCategory[];
  invitations: InvitationRow[];
  team: TeamMember[];
  progress: Record<string, Record<string, ProgressEntry>>;
};

const STORE_PATH = path.join(os.tmpdir(), "myriam-perez-demo-store.json");

function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const SEED_CATEGORIES: BlogCategory[] = BLOG_CATEGORIES.map((name, i) => ({
  id: `cat-${i + 1}`,
  name,
  slug: slugifyCategory(name),
  position: i,
}));

function seedStore(): StoreShape {
  return {
    articles: SEED_ARTICLES.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      coverImageUrl: a.coverImageUrl ?? null,
      tags: a.tags,
      readingTimeMinutes: a.readingTime,
      featured: a.featured ?? false,
      authorName: a.author,
      publishedAt: a.publishedAt,
      faq: [],
      createdAt: a.publishedAt ?? new Date().toISOString(),
      updatedAt: a.publishedAt ?? new Date().toISOString(),
    })),
    invitations: [{ id: "invit-1", email: "camille@exemple.com", role: "editor", status: "pending", createdAt: "2026-07-15" }],
    categories: SEED_CATEGORIES,
    team: [
      { id: "demo-admin", fullName: "Myriam Perez", email: "myriam@exemple.com", role: "admin" },
      { id: "demo-editor", fullName: "Camille Roy", email: "camille@exemple.com", role: "editor" },
    ],
    // Formation 1 terminée et Formation 2 à moitié, pour que le dashboard
    // démo ne parte pas de zéro. Les horodatages servent à déterminer la
    // « dernière formation ouverte » (la plus récemment consultée).
    progress: {
      "demo-learner": {
        "video-1-1-1": { secondsWatched: 596, completed: true, lastOpenedAt: "2026-07-01T10:00:00.000Z" },
        "video-1-1-2": { secondsWatched: 596, completed: true, lastOpenedAt: "2026-07-02T10:00:00.000Z" },
        "video-1-2-1": { secondsWatched: 596, completed: true, lastOpenedAt: "2026-07-03T10:00:00.000Z" },
        "video-1-3-1": { secondsWatched: 596, completed: true, lastOpenedAt: "2026-07-04T10:00:00.000Z" },
        "video-1-4-1": { secondsWatched: 300, completed: false, lastOpenedAt: "2026-07-06T10:00:00.000Z" },
        "video-2-1-1": { secondsWatched: 596, completed: true, lastOpenedAt: "2026-07-10T10:00:00.000Z" },
        "video-2-1-2": { secondsWatched: 596, completed: true, lastOpenedAt: "2026-07-11T10:00:00.000Z" },
        "video-2-2-1": { secondsWatched: 596, completed: true, lastOpenedAt: "2026-07-12T10:00:00.000Z" },
      },
    },
  };
}

function readStore(): StoreShape {
  try {
    const parsed = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8")) as StoreShape;
    // Migration des stores créés avant les catégories (mode démo).
    if (!Array.isArray(parsed.categories)) parsed.categories = SEED_CATEGORIES;
    // Migration des stores créés avant createdAt/updatedAt sur les articles.
    parsed.articles = parsed.articles.map((a) => ({
      ...a,
      createdAt: a.createdAt ?? a.publishedAt ?? new Date().toISOString(),
      updatedAt: a.updatedAt ?? a.publishedAt ?? new Date().toISOString(),
    }));
    return parsed;
  } catch {
    const seeded = seedStore();
    writeStore(seeded);
    return seeded;
  }
}

function writeStore(store: StoreShape) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store), "utf-8");
}

// --- Progression vidéo -------------------------------------------------

export function getMockProgressMap(userId: string): Map<string, ProgressEntry> {
  const store = readStore();
  return new Map(Object.entries(store.progress[userId] ?? {}));
}

export function setMockProgress(userId: string, videoId: string, entry: ProgressEntry) {
  const store = readStore();
  store.progress[userId] = {
    ...(store.progress[userId] ?? {}),
    [videoId]: { ...entry, lastOpenedAt: new Date().toISOString() },
  };
  writeStore(store);
}

// --- Articles ------------------------------------------------------------

export function getMockArticles(): AdminArticle[] {
  return readStore().articles;
}

export function getMockArticle(id: string): AdminArticle | null {
  return readStore().articles.find((a) => a.id === id) ?? null;
}

export function createMockArticle(input: ArticleInput): string {
  const store = readStore();
  const id = `mock-art-${Date.now()}`;
  const now = new Date().toISOString();
  store.articles.unshift({ id, ...articleInputToStore(input), createdAt: now, updatedAt: now });
  writeStore(store);
  return id;
}

export function updateMockArticle(id: string, input: ArticleInput) {
  const store = readStore();
  const index = store.articles.findIndex((a) => a.id === id);
  if (index === -1) return;
  const createdAt = store.articles[index].createdAt ?? new Date().toISOString();
  store.articles[index] = { id, ...articleInputToStore(input), createdAt, updatedAt: new Date().toISOString() };
  writeStore(store);
}

function articleInputToStore(input: ArticleInput): Omit<AdminArticle, "id" | "createdAt" | "updatedAt"> {
  return {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    coverImageUrl: input.coverImageUrl,
    tags: input.tags,
    readingTimeMinutes: input.readingTimeMinutes,
    featured: input.featured,
    authorName: input.authorName,
    publishedAt: input.publishedAt,
    faq: input.faqJson,
  };
}

export function deleteMockArticle(id: string) {
  const store = readStore();
  store.articles = store.articles.filter((a) => a.id !== id);
  writeStore(store);
}

// --- Équipe et invitations -------------------------------------------------

export function getMockTeam(): TeamMember[] {
  return readStore().team;
}

export function updateMockTeamRole(userId: string, role: "admin" | "editor") {
  const store = readStore();
  const member = store.team.find((m) => m.id === userId);
  if (member) member.role = role;
  writeStore(store);
}

export function getMockInvitations(): InvitationRow[] {
  return readStore().invitations;
}

export function addMockInvitation(invitation: InvitationRow) {
  const store = readStore();
  store.invitations.unshift(invitation);
  writeStore(store);
}

// --- Catégories du blog ---------------------------------------------------

export function getMockCategories(): BlogCategory[] {
  return readStore().categories;
}

export function createMockCategory(name: string): { id: string; error: string | null } {
  const store = readStore();
  const trimmed = name.trim();
  if (!trimmed) return { id: "", error: "Le nom est requis." };
  const duplicate = store.categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (duplicate) return { id: "", error: "Cette catégorie existe déjà." };

  const id = `mock-cat-${Date.now()}`;
  store.categories.push({ id, name: trimmed, slug: slugifyCategory(trimmed), position: store.categories.length });
  writeStore(store);
  return { id, error: null };
}

export function deleteMockCategory(id: string): { error: string | null } {
  const store = readStore();
  store.categories = store.categories.filter((c) => c.id !== id);
  writeStore(store);
  return { error: null };
}
