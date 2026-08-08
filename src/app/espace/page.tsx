import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getCoursesWithProgress, getGlobalProgress } from "@/lib/learning";
import CourseCard from "@/components/espace/CourseCard";
import ProfileCard from "@/components/espace/ProfileCard";
import ProgressChart from "@/components/espace/ProgressChart";
import SplitHeading from "@/components/SplitHeading";
import FadeIn from "@/components/FadeIn";

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="flex flex-col gap-10 lg:col-span-3">
        <FadeIn className="relative min-h-[320px] overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#F07020_0%,#D8B15B_55%,#C05A18_100%)] p-8">
          {/* max-w en "ch" (largeur de caractère) : tient sur 2 lignes quelle que soit la taille h3 */}
          <SplitHeading
            as="h3"
            text="Un parcours structuré, du premier module à la certification."
            muted={["un", "du", "premier", "module", "à", "la"]}
            boldClassName="text-cream-50"
            className="text-balance max-w-[27ch]"
          />

          {/* Repère factuel, comme le badge flottant de la référence */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-2xl bg-cream-50 px-4 py-3 shadow-[0_10px_30px_-12px_rgba(38,34,30,0.5)]">
            <BadgeCheck className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.75} />
            <p className="text-sm font-medium text-espresso-900">Organisme de formation agréé CPMT</p>
          </div>
        </FadeIn>

        <section>
          <h2 className="text-xl font-medium text-espresso-900">Mes formations</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start lg:col-span-1">
        <ProfileCard fullName={profile.full_name} percent={global.percent} />
        <ProgressChart courses={courses} />
      </div>
    </div>
  );
}
