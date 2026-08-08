import type { Metadata } from "next";
import { BadgeCheck, CheckCircle2 } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getCoursesWithProgress, getGlobalProgress } from "@/lib/learning";
import type { CourseSummary } from "@/lib/learning";
import ResumeSection from "@/components/espace/ResumeSection";
import MiniCourseCard from "@/components/espace/MiniCourseCard";
import ProfileCard from "@/components/espace/ProfileCard";
import ProgressChart from "@/components/espace/ProgressChart";
import SplitHeading from "@/components/SplitHeading";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Mes formations | Espace apprenant — Inspire & Impact",
};

function sortByLastOpened(list: CourseSummary[]): CourseSummary[] {
  return [...list].sort((a, b) => {
    const ta = a.lastOpenedAt ? Date.parse(a.lastOpenedAt) : -Infinity;
    const tb = b.lastOpenedAt ? Date.parse(b.lastOpenedAt) : -Infinity;
    if (tb !== ta) return tb - ta;
    return b.percent - a.percent;
  });
}

export default async function EspaceDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null; // Le layout a déjà redirigé ; garde de type pour la suite.

  const [courses, global] = await Promise.all([
    getCoursesWithProgress(profile.id),
    getGlobalProgress(profile.id),
  ]);

  const inProgress = courses.filter((c) => c.percent > 0 && c.percent < 100);
  const notStarted = courses.filter((c) => c.percent === 0);
  const allCompleted = courses.length > 0 && inProgress.length === 0 && notStarted.length === 0;

  const lastOpened = sortByLastOpened(inProgress)[0] ?? null;
  const otherInProgress = sortByLastOpened(inProgress.filter((c) => c.id !== lastOpened?.id));

  let lowerCards: { course: CourseSummary; started: boolean }[] = [];
  if (lastOpened && inProgress.length === 1) {
    lowerCards = notStarted.slice(0, 3).map((course) => ({ course, started: false }));
  } else if (lastOpened) {
    lowerCards = [
      ...otherInProgress.map((course) => ({ course, started: true })),
      ...notStarted.map((course) => ({ course, started: false })),
    ].slice(0, 3);
  } else if (notStarted.length > 0) {
    lowerCards = notStarted.slice(0, 3).map((course) => ({ course, started: false }));
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="flex flex-col gap-10 lg:col-span-3">
        <FadeIn className="relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#F07020_0%,#D8B15B_55%,#C05A18_100%)] p-8">
          {/* max-w en "ch" (largeur de caractère) : tient sur 2 lignes quelle que soit la taille h3 */}
          <div>
            <div className="flex items-start justify-between gap-6">
              <SplitHeading
                as="h3"
                text="Un parcours structuré, du premier module à la certification."
                muted={["un", "du", "premier", "module", "à", "la"]}
                boldClassName="text-cream-50"
                className="text-balance max-w-[27ch]"
              />

              {/* Repère factuel, comme le badge flottant de la référence */}
              <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-cream-50 px-4 py-3 shadow-[0_10px_30px_-12px_rgba(38,34,30,0.5)]">
                <BadgeCheck className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.75} />
                <p className="text-sm font-medium text-espresso-900">Organisme de formation agréé CPMT</p>
              </div>
            </div>
          </div>
          <p className="whitespace-nowrap leading-relaxed text-cream-50/90">
            4 vidéos terminées sur 8 au total, sur les 135 heures du programme.
          </p>
        </FadeIn>

        <section className="flex flex-1 flex-col">
          {lastOpened ? (
            <ResumeSection resume={lastOpened} discover={lowerCards} />
          ) : allCompleted ? (
            <>
              <h2 className="text-xl font-medium text-espresso-900">Parcours terminé</h2>
              <div className="mt-5 flex items-center gap-4 rounded-3xl border border-espresso-900/10 bg-white p-6">
                <CheckCircle2 className="h-8 w-8 shrink-0 text-accent" strokeWidth={1.75} />
                <p className="text-sm leading-relaxed text-espresso-600">
                  Toutes vos formations sont terminées. Félicitations ! 🎉
                </p>
              </div>
            </>
          ) : lowerCards.length > 0 ? (
            <>
              <h2 className="text-xl font-medium text-espresso-900">Formations à découvrir</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {lowerCards.map(({ course, started }) => (
                  <MiniCourseCard key={course.id} course={course} started={started} />
                ))}
              </div>
            </>
          ) : null}
        </section>
      </div>

      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:col-span-1">
        <ProfileCard
          fullName={profile.full_name}
          percent={global.percent}
          photoUrl={profile.avatar_url}
          username={profile.username}
        />
        <ProgressChart courses={courses} />
      </div>
    </div>
  );
}
