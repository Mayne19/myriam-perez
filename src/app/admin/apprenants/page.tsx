import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getLearners } from "@/lib/admin/learners";

export const metadata: Metadata = {
  title: "Apprenants | Panel admin — Inspire & Impact",
};

export default async function AdminLearnersPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") redirect("/admin/blog");

  const learners = await getLearners();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium text-espresso-900">Apprenants</h1>

      {learners.length === 0 ? (
        <p className="rounded-2xl border border-espresso-900/10 bg-white p-6 text-sm text-espresso-400">
          Aucun apprenant inscrit pour l&apos;instant.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-espresso-900/10 bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-cream-100">
                <th className="px-5 py-3 font-semibold text-espresso-700">Nom</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Courriel</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Paiement</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Progression</th>
              </tr>
            </thead>
            <tbody>
              {learners.map((learner) => (
                <tr key={learner.id} className="border-t border-espresso-900/10">
                  <td className="px-5 py-3 text-espresso-900">{learner.fullName ?? "—"}</td>
                  <td className="px-5 py-3 text-espresso-600">{learner.email ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        learner.paymentStatus === "active" ? "bg-accent-bg text-accent-text" : "bg-cream-200 text-espresso-500"
                      }`}
                    >
                      {learner.paymentStatus === "active" ? "Payé" : "En attente"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-accent-bg">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${learner.percent}%` }} />
                      </div>
                      <span className="text-xs text-espresso-500">{learner.percent}%</span>
                    </div>
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
