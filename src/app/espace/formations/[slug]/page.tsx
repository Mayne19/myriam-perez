import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CircleCheck, CircleDashed, CirclePlay } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getCourseDetail, getCoursesWithProgress, getGlobalProgress, type ChapterStatus } from "@/lib/learning";
import CourseChecklist from "@/components/espace/CourseChecklist";
import ProgressChart from "@/components/espace/ProgressChart";

const STATUS_LABEL: Record<ChapterStatus, string> = {
  done: "Terminé",
  in_progress: "En cours",
  not_started: "À commencer",
};

function StatusIcon({ status }: { status: ChapterStatus }) {
  if (status === "done") return <CircleCheck className="h-5 w-5 text-accent" />;
  if (status === "in_progress") return <CirclePlay className="h-5 w-5 text-espresso-700" />;
  return <CircleDashed className="h-5 w-5 text-espresso-300" />;
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const [course, courses, global] = await Promise.all([
    getCourseDetail(params.slug, profile.id),
    getCoursesWithProgress(profile.id),
    getGlobalProgress(profile.id),
  ]);
  if (!course) notFound();

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:min-h-[calc(100svh-136px)]">
      <div className="flex flex-1 flex-col gap-8">
        <div>
          <Link href="/espace/formations" className="text-sm font-medium text-espresso-400 no-underline hover:text-accent">
            ← Mes formations
          </Link>
          <h1 className="mt-3 text-2xl font-medium text-espresso-900">{course.title}</h1>
          {course.description && <p className="mt-2 max-w-2xl text-espresso-500">{course.description}</p>}
        </div>

        <div className="flex flex-col gap-3">
          {course.chapters.length === 0 && (
            <p className="rounded-2xl border border-espresso-900/10 bg-white p-6 text-sm text-espresso-400">
              Le contenu de cette formation sera bientôt disponible.
            </p>
          )}
          {course.chapters.map((chapter, index) => (
            <Link
              key={chapter.id}
              href={`/espace/formations/${course.slug}/${chapter.id}`}
              className="flex items-center gap-4 rounded-2xl border border-espresso-900/10 bg-white p-5 no-underline transition-colors hover:border-accent/30"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-100 text-sm font-semibold text-espresso-700">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-espresso-900">{chapter.title}</p>
                <p className="mt-0.5 text-xs text-espresso-400">
                  {STATUS_LABEL[chapter.status]} · {chapter.completedVideos}/{chapter.totalVideos || "—"} vidéos
                </p>
              </div>
              <StatusIcon status={chapter.status} />
              <ChevronRight className="h-4 w-4 text-espresso-300" />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-6 lg:w-[360px] lg:shrink-0 lg:sticky lg:top-6">
        <CourseChecklist title={course.title} chapters={course.chapters} />
        <ProgressChart chapters={course.chapters} />
      </div>
    </div>
  );
}
