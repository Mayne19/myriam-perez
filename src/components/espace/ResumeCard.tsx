import Link from "next/link";
import { Play } from "lucide-react";
import type { CourseSummary } from "@/lib/learning";

export default function ResumeCard({ course, started }: { course: CourseSummary; started: boolean }) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-espresso-900/10 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-bg">
          <span className="text-xl font-semibold text-accent-text">{course.percent}%</span>
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-2xl leading-snug text-espresso-900">{course.title}</h3>
          <p className="mt-1 text-xs text-espresso-400">
            {course.completedVideos} / {course.totalVideos || "—"} vidéos
          </p>
        </div>
      </div>
      <Link
        href={`/espace/formations/${course.slug}`}
        className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium no-underline transition-colors ${
          started
            ? "bg-accent font-semibold text-cream-50 hover:bg-[#d9641a] hover:text-cream-50"
            : "border border-espresso-900/20 text-espresso-900 hover:border-espresso-900 hover:bg-espresso-900 hover:text-cream-50"
        }`}
      >
        <Play className="h-4 w-4" strokeWidth={2} />
        {started ? "Continuer" : "Commencer"}
      </Link>
    </div>
  );
}
