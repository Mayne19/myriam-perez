import type { ChapterSummary, CourseSummary } from "@/lib/learning";

type BarItem = {
  id: string;
  title: string;
  percent: number;
  short: string;
};

export default function ProgressChart({
  title = "Progression par formation",
  subtitle = "Vidéos terminées, formation par formation.",
  courses,
  chapters,
}: {
  title?: string;
  subtitle?: string;
  courses?: CourseSummary[];
  chapters?: ChapterSummary[];
}) {
  let bars: BarItem[];

  if (chapters) {
    bars = chapters.map((ch, i) => ({
      id: ch.id,
      title: ch.title,
      percent: ch.totalVideos > 0 ? Math.round((ch.completedVideos / ch.totalVideos) * 100) : 0,
      short: `C${i + 1}`,
    }));
  } else if (courses) {
    bars = courses.map((course, i) => ({ ...course, short: `F${i + 1}` }));
  } else {
    bars = [];
  }

  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-espresso-900/10 bg-white p-6">
      <h2 className="text-2xl font-medium text-espresso-900">{title}</h2>
      <p className="mt-1 text-sm text-espresso-500">{subtitle}</p>

      <div className="mt-6 flex min-h-36 flex-1 items-end gap-3">
        {bars.map((bar) => (
          <div key={bar.id} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-xs font-medium text-espresso-600">{bar.percent}%</span>
            <div className="relative w-full flex-1 overflow-hidden rounded-lg bg-accent-bg">
              <div className="absolute bottom-0 left-0 right-0 bg-accent" style={{ height: `${bar.percent}%` }} />
            </div>
            <span className="text-[11px] font-medium text-espresso-400" title={bar.title}>
              {bar.short}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
