import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getCoursesWithProgress, getGlobalProgress } from "@/lib/learning";
import ProgressGauge from "@/components/espace/ProgressGauge";
import CourseCard from "@/components/espace/CourseCard";

export const metadata: Metadata = {
  title: "Mes formations | Espace apprenant — Inspire & Impact",
};

export default async function EspaceDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null; // Le layout a déjà redirigé ; garde de type pour la suite.

  const [courses, global] = await Promise.all([
    getCoursesWithProgress(profile.id),
    getGlobalProgress(profile.id),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center gap-6 rounded-3xl border border-espresso-900/10 bg-white p-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-accent">Inspire &amp; Impact</p>
          <h1 className="mt-2 text-2xl font-medium text-espresso-900">
            Bienvenue{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 max-w-md text-sm text-espresso-500">
            {global.completed} vidéo{global.completed > 1 ? "s" : ""} terminée{global.completed > 1 ? "s" : ""} sur {global.total || "—"} au total, sur les 135 heures du programme.
          </p>
        </div>
        <ProgressGauge percent={global.percent} label="Progression globale" size={140} />
      </section>

      <section>
        <h2 className="text-xl font-medium text-espresso-900">Mes formations</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
