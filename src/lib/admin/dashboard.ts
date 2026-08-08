import { getLearners, type LearnerRow } from "@/lib/admin/learners";
import { getAllArticlesForAdmin } from "@/lib/admin/articles";
import type { AdminArticle } from "@/lib/admin/articles";

/*
  Chiffres et alertes du dashboard admin — calculés uniquement à partir de
  données réellement disponibles aujourd'hui (profils, progression vidéo,
  articles). Pas de "revenus" en $ : aucun montant n'est stocké nulle part
  pour l'instant (juste un statut payé/en attente), donc on affiche des
  compteurs honnêtes plutôt qu'un chiffre inventé. Idem pour "dernières
  questions reçues" : il n'existe aucun système de commentaires, ce bloc
  est donc absent plutôt que fabriqué.
*/

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const STALE_DRAFT_MS = 14 * 24 * 60 * 60 * 1000;
const INACTIVE_LEARNER_MS = 21 * 24 * 60 * 60 * 1000;

export type DashboardData = {
  activeLearners: number;
  newLearnersThisWeek: number;
  avgCompletionRate: number;
  pendingPayments: number;
  staleDrafts: AdminArticle[];
  inactiveLearners: LearnerRow[];
  recentLearners: LearnerRow[];
  latestPublishedArticles: AdminArticle[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const [learners, articles] = await Promise.all([getLearners(), getAllArticlesForAdmin()]);

  const now = Date.now();

  const activeLearners = learners.filter((l) => l.paymentStatus === "active");
  const newLearnersThisWeek = learners.filter((l) => now - new Date(l.createdAt).getTime() <= WEEK_MS).length;
  const avgCompletionRate =
    activeLearners.length > 0
      ? Math.round(activeLearners.reduce((sum, l) => sum + l.percent, 0) / activeLearners.length)
      : 0;
  const pendingPayments = learners.filter((l) => l.paymentStatus === "pending").length;

  const staleDrafts = articles
    .filter((a) => !a.publishedAt && now - new Date(a.createdAt).getTime() >= STALE_DRAFT_MS)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // "Inactif" ici veut dire : payé, mais pas encore terminé sa formation et
  // inscrit depuis 21 jours ou plus — on n'a pas de trace fine du dernier
  // visionnage par apprenant, seulement sa date d'inscription.
  const inactiveLearners = activeLearners
    .filter((l) => l.percent < 100 && now - new Date(l.createdAt).getTime() >= INACTIVE_LEARNER_MS)
    .sort((a, b) => a.percent - b.percent);

  const recentLearners = [...learners]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const latestPublishedArticles = articles
    .filter((a) => a.publishedAt)
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
    .slice(0, 3);

  return {
    activeLearners: activeLearners.length,
    newLearnersThisWeek,
    avgCompletionRate,
    pendingPayments,
    staleDrafts,
    inactiveLearners,
    recentLearners,
    latestPublishedArticles,
  };
}
