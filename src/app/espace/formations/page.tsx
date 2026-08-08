import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getCoursesWithProgress } from "@/lib/learning";
import CourseCard from "@/components/espace/CourseCard";

export const metadata: Metadata = {
  title: "Formations | Espace apprenant — Inspire & Impact",
};

export default async function FormationsPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const courses = await getCoursesWithProgress(profile.id);

  return (
    <div className="flex min-h-[calc(100svh-136px)] flex-col gap-6">
      <h1 className="text-2xl font-medium text-espresso-900">Formations</h1>

      {courses.length === 0 ? (
        <p className="rounded-2xl border border-espresso-900/10 bg-white p-6 text-sm text-espresso-400">
          Aucune formation disponible pour l&apos;instant.
        </p>
      ) : (
        <div className="grid flex-1 auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
