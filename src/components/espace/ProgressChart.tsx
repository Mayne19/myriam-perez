import type { CourseSummary } from "@/lib/learning";

export default function ProgressChart({ courses }: { courses: CourseSummary[] }) {
  const bars = courses.map((course, index) => ({ ...course, short: `F${index + 1}` }));

  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-espresso-900/10 bg-white p-6">
      <h2 className="text-2xl font-medium text-espresso-900">Progression par formation</h2>
      <p className="mt-1 text-sm text-espresso-500">Vidéos terminées, formation par formation.</p>

      <div className="mt-6 flex min-h-36 flex-1 items-end gap-3">
        {bars.map((course) => (
          <div key={course.id} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-xs font-medium text-espresso-600">{course.percent}%</span>
            <div className="relative w-full flex-1 overflow-hidden rounded-lg bg-accent-bg">
              <div className="absolute bottom-0 left-0 right-0 bg-accent" style={{ height: `${course.percent}%` }} />
            </div>
            <span className="text-[11px] font-medium text-espresso-400" title={course.title}>
              {course.short}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
