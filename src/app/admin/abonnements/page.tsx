import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getLearners } from "@/lib/admin/learners";
import { formatArticleDate } from "@/lib/blog-format";

export const metadata: Metadata = {
  title: "Abonnements | Panel admin — Inspire & Impact",
};

export default async function AdminSubscriptionsPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") redirect("/admin/blog");

  const learners = await getLearners();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium text-espresso-900">Abonnements</h1>

      {learners.length === 0 ? (
        <p className="rounded-2xl border border-espresso-900/10 bg-white p-6 text-sm text-espresso-400">
          Aucun abonnement pour l&apos;instant.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-espresso-900/10 bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-cream-100">
                <th className="px-5 py-3 font-semibold text-espresso-700">Nom</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Courriel</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Statut</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Inscription</th>
              </tr>
            </thead>
            <tbody>
              {learners.map((learner) => (
                <tr key={learner.id} className="border-t border-espresso-900/10">
                  <td className="px-5 py-3 text-espresso-900">{learner.fullName ?? "—"}</td>
                  <td className="px-5 py-3 text-espresso-600">{learner.email ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        learner.paymentStatus === "active" ? "bg-accent-bg text-accent-text" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          learner.paymentStatus === "active" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {learner.paymentStatus === "active" ? "Payé" : "En attente"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-espresso-600">
                    {learner.createdAt ? formatArticleDate(learner.createdAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
