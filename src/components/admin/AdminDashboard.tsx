import Link from "next/link";
import { AlertTriangle, FileText, Percent, Plus, UserPlus, Users, Wallet } from "lucide-react";
import { formatArticleDate } from "@/lib/blog-format";
import type { DashboardData } from "@/lib/admin/dashboard";

function KpiCard({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-espresso-900/10 bg-white p-5">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-medium text-espresso-900">{value}</p>
        <p className="text-sm text-espresso-400">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard({ data }: { data: DashboardData }) {
  const hasAlerts = data.staleDrafts.length > 0 || data.inactiveLearners.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium text-espresso-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-espresso-400">Vue d&apos;ensemble de l&apos;espace apprenant et du blog.</p>
      </div>

      {/* Chiffres clés */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Users} label="Apprenants actifs" value={String(data.activeLearners)} tint="bg-accent-bg text-accent-text" />
        <KpiCard icon={UserPlus} label="Nouveaux cette semaine" value={String(data.newLearnersThisWeek)} tint="bg-gold-400/20 text-gold-600" />
        <KpiCard icon={Percent} label="Complétion moyenne" value={`${data.avgCompletionRate}%`} tint="bg-cream-200 text-espresso-700" />
        <KpiCard icon={Wallet} label="Paiements en attente" value={String(data.pendingPayments)} tint="bg-espresso-100 text-espresso-800" />
      </div>

      {/* Alertes */}
      {hasAlerts && (
        <div className="rounded-2xl border border-accent/25 bg-accent/5 p-5">
          <div className="flex items-center gap-2 text-espresso-900">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <p className="font-medium">À surveiller</p>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {data.staleDrafts.length > 0 && (
              <Link
                href="/admin/blog"
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm no-underline transition-colors hover:border-accent/30"
              >
                <span className="text-espresso-700">
                  {data.staleDrafts.length} brouillon{data.staleDrafts.length > 1 ? "s" : ""} en attente depuis plus de 14 jours
                </span>
                <span className="text-espresso-400">Voir les articles →</span>
              </Link>
            )}
            {data.inactiveLearners.length > 0 && (
              <Link
                href="/admin/apprenants"
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm no-underline transition-colors hover:border-accent/30"
              >
                <span className="text-espresso-700">
                  {data.inactiveLearners.length} apprenant{data.inactiveLearners.length > 1 ? "s" : ""} sans progression depuis leur
                  inscription (21+ jours)
                </span>
                <span className="text-espresso-400">Voir les apprenants →</span>
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Activité récente */}
        <div className="flex flex-col gap-4 rounded-2xl border border-espresso-900/10 bg-white p-5">
          <p className="font-medium text-espresso-900">Activité récente</p>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-espresso-300">Derniers apprenants inscrits</p>
            <div className="mt-2 flex flex-col gap-2">
              {data.recentLearners.length === 0 ? (
                <p className="text-sm text-espresso-400">Aucun apprenant pour l&apos;instant.</p>
              ) : (
                data.recentLearners.map((learner) => (
                  <div key={learner.id} className="flex items-center justify-between text-sm">
                    <span className="text-espresso-800">{learner.fullName ?? learner.email ?? "—"}</span>
                    <span className="text-espresso-400">{formatArticleDate(learner.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-espresso-900/10 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-espresso-300">Derniers articles publiés</p>
            <div className="mt-2 flex flex-col gap-2">
              {data.latestPublishedArticles.length === 0 ? (
                <p className="text-sm text-espresso-400">Aucun article publié pour l&apos;instant.</p>
              ) : (
                data.latestPublishedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/admin/blog/${article.id}`}
                    className="flex items-center justify-between text-sm no-underline hover:text-accent"
                  >
                    <span className="text-espresso-800">{article.title || "(sans titre)"}</span>
                    <span className="text-espresso-400">{formatArticleDate(article.publishedAt!)}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Raccourcis rapides */}
        <div className="flex flex-col gap-3 rounded-2xl border border-espresso-900/10 bg-white p-5">
          <p className="font-medium text-espresso-900">Raccourcis</p>
          <Link
            href="/admin/blog/nouveau"
            className="flex items-center gap-3 rounded-xl border border-espresso-900/10 px-4 py-3 text-sm font-medium text-espresso-700 no-underline transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Plus className="h-4 w-4" /> Nouvel article
          </Link>
          <Link
            href="/admin/apprenants"
            className="flex items-center gap-3 rounded-xl border border-espresso-900/10 px-4 py-3 text-sm font-medium text-espresso-700 no-underline transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Users className="h-4 w-4" /> Voir les apprenants récents
          </Link>
          <Link
            href="/admin/abonnements"
            className="flex items-center gap-3 rounded-xl border border-espresso-900/10 px-4 py-3 text-sm font-medium text-espresso-700 no-underline transition-colors hover:border-accent/40 hover:text-accent"
          >
            <FileText className="h-4 w-4" /> Gérer un paiement
          </Link>
        </div>
      </div>
    </div>
  );
}
