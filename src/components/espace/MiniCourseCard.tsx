import Link from "next/link";
import { Play } from "lucide-react";
import type { CourseSummary } from "@/lib/learning";

export default function MiniCourseCard({ course, started }: { course: CourseSummary; started: boolean }) {
  return (
    <Link
      href={`/espace/formations/${course.slug}`}
      className="group flex h-full flex-col gap-4 rounded-2xl border border-espresso-900/10 bg-white p-5 no-underline transition-all duration-300 hover:shadow-md"
    >
      <div>
        <p className="line-clamp-2 text-lg leading-snug text-espresso-900 transition-colors group-hover:text-accent">
          {course.title}
        </p>
        {course.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-espresso-400">{course.description}</p>
        )}
      </div>

      <div className="mt-auto">
        {started ? (
          <>
            <div className="flex items-center justify-between text-xs text-espresso-400">
              <span>
                {course.completedVideos} / {course.totalVideos || "—"} vidéos
              </span>
              <span className="font-semibold text-accent">{course.percent}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-accent-bg">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${course.percent}%` }}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between text-xs text-espresso-400">
            <span>{course.totalVideos || "—"} vidéos</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-accent">
              <Play className="h-3.5 w-3.5" strokeWidth={2} />
              Commencer
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
