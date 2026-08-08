import Link from "next/link";
import { Play, ArrowRight, Clock } from "lucide-react";
import type { ChapterSummary } from "@/lib/learning";

function nextChapter(chapters: ChapterSummary[]) {
  return chapters.find((ch) => ch.status !== "done") ?? null;
}

function totalVideos(chapters: ChapterSummary[]) {
  return chapters.reduce((s, ch) => s + ch.totalVideos, 0);
}

function completedVideos(chapters: ChapterSummary[]) {
  return chapters.reduce((s, ch) => s + ch.completedVideos, 0);
}

export default function CourseSidebar({
  title,
  chapters,
  nextCourseSlug,
  nextCourseTitle,
}: {
  title: string;
  chapters: ChapterSummary[];
  nextCourseSlug?: string;
  nextCourseTitle?: string;
}) {
  const next = nextChapter(chapters);
  const total = totalVideos(chapters);
  const done = completedVideos(chapters);
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const remaining = total - done;

  return (
    <div className="flex flex-col rounded-2xl border border-espresso-900/10 bg-white p-6">
      <h2 className="text-lg font-medium text-espresso-900">{title}</h2>
      <p className="mt-1 text-sm text-espresso-500">
        {percent}% complété · {remaining} vidéos restantes
      </p>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-accent-bg">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${percent}%` }} />
        </div>
        <span className="text-sm font-semibold text-accent">{percent}%</span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-espresso-400">
        <Clock className="h-3.5 w-3.5" />
        <span>environ {Math.ceil(remaining * 10)} min de cours</span>
      </div>

      {next && (
        <div className="mt-6 border-t border-espresso-900/10 pt-5">
          <p className="text-xs font-medium uppercase tracking-wider text-espresso-400">À suivre</p>
          <p className="mt-1 text-sm font-medium text-espresso-900">{next.title}</p>
          <p className="mt-0.5 text-xs text-espresso-400">
            {next.completedVideos}/{next.totalVideos} vidéos terminées
          </p>
          <Link
            href={`#${next.id}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-cream-50 no-underline transition-colors hover:bg-accent-dark"
          >
            <Play className="h-4 w-4" strokeWidth={2} />
            Continuer
          </Link>
        </div>
      )}

      {nextCourseSlug && nextCourseTitle && (
        <div className="mt-6 border-t border-espresso-900/10 pt-5">
          <Link
            href={`/espace/formations/${nextCourseSlug}`}
            className="flex items-center justify-between no-underline transition-colors hover:text-accent"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-espresso-400">Cours suivant</p>
              <p className="mt-1 text-sm font-medium text-espresso-900">{nextCourseTitle}</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-espresso-400" />
          </Link>
        </div>
      )}

      <div className="mt-6 border-t border-espresso-900/10 pt-5">
        <p className="text-sm font-medium text-espresso-900">Progression par cours</p>
        <p className="mt-0.5 text-xs text-espresso-500">Vidéos terminées, cours par cours.</p>

        <div className="mt-4 flex min-h-36 items-end gap-3">
          {chapters.map((ch, i) => {
            const pct = ch.totalVideos > 0 ? Math.round((ch.completedVideos / ch.totalVideos) * 100) : 0;
            return (
              <div key={ch.id} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-medium text-espresso-600">{pct}%</span>
                <div className="relative w-full flex-1 overflow-hidden rounded-lg bg-accent-bg">
                  <div className="absolute bottom-0 left-0 right-0 bg-accent" style={{ height: `${pct}%` }} />
                </div>
                <span className="text-[11px] font-medium text-espresso-400" title={ch.title}>
                  C{i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
