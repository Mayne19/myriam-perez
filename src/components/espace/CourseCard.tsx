import Link from "next/link";
import type { CourseSummary } from "@/lib/learning";

export default function CourseCard({ course }: { course: CourseSummary }) {
  return (
    <Link
      href={`/espace/formations/${course.slug}`}
      className="group flex flex-col gap-4 rounded-3xl border border-espresso-900/10 bg-white p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-espresso-900/5"
    >
      {course.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={course.coverImageUrl} alt="" className="h-36 w-full rounded-2xl object-cover" />
      ) : (
        <div className="flex h-36 w-full items-center justify-center rounded-2xl bg-accent-bg">
          <span className="text-3xl font-semibold text-accent-text">{course.percent}%</span>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold leading-snug text-espresso-900">{course.title}</h3>
        {course.description && <p className="mt-1 text-sm text-espresso-400">{course.description}</p>}
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between text-xs text-espresso-400">
          <span>
            {course.completedVideos} / {course.totalVideos || "—"} vidéos
          </span>
          <span className="font-semibold text-espresso-700">{course.percent}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-accent-bg">
          <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${course.percent}%` }} />
        </div>
      </div>
    </Link>
  );
}
