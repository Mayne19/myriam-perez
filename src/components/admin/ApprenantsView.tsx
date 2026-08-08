"use client";

import { useMemo, useState } from "react";
import { useAdminTopBarSearch } from "@/components/admin/AdminTopBarContext";
import type { LearnerRow } from "@/lib/admin/learners";

export default function ApprenantsView({ learners }: { learners: LearnerRow[] }) {
  const [search, setSearch] = useState("");

  useAdminTopBarSearch({ value: search, onChange: setSearch, placeholder: "Rechercher un apprenant…" });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return learners;
    return learners.filter(
      (learner) => learner.fullName?.toLowerCase().includes(q) || learner.email?.toLowerCase().includes(q)
    );
  }, [learners, search]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium text-espresso-900">Apprenants</h1>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-espresso-900/10 bg-white p-6 text-sm text-espresso-400">
          {learners.length === 0 ? "Aucun apprenant inscrit pour l'instant." : "Aucun apprenant ne correspond à cette recherche."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-espresso-900/10 bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-cream-100">
                <th className="px-5 py-3 font-semibold text-espresso-700">Nom</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Courriel</th>
                <th className="px-5 py-3 font-semibold text-espresso-700">Progression</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((learner) => (
                <tr key={learner.id} className="border-t border-espresso-900/10">
                  <td className="px-5 py-3 text-espresso-900">{learner.fullName ?? "—"}</td>
                  <td className="px-5 py-3 text-espresso-600">{learner.email ?? "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-accent-bg">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${learner.percent}%` }} />
                        </div>
                        <span className="text-xs text-espresso-500">{learner.percent}%</span>
                      </div>
                      <span className="text-xs text-espresso-400">
                        {learner.completedVideos}/{learner.totalVideos} vidéos
                      </span>
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
