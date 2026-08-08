import { CircleCheck, CircleDashed } from "lucide-react";
import type { ChapterSummary } from "@/lib/learning";

export default function CourseChecklist({ title, chapters }: { title: string; chapters: ChapterSummary[] }) {
  return (
    <div className="flex flex-col rounded-2xl border border-espresso-900/10 bg-white p-6">
      <h2 className="text-lg font-medium text-espresso-900">Contenu du cours</h2>
      <p className="mt-0.5 text-sm text-espresso-500">{title}</p>

      <ul className="mt-5 flex flex-col gap-2">
        {chapters.map((chapter) => (
          <li key={chapter.id} className="flex items-center gap-3">
            {chapter.status === "done" ? (
              <CircleCheck className="h-5 w-5 shrink-0 text-accent" />
            ) : chapter.status === "in_progress" ? (
              <CircleDashed className="h-5 w-5 shrink-0 text-espresso-400" />
            ) : (
              <CircleDashed className="h-5 w-5 shrink-0 text-espresso-200" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${chapter.status === "done" ? "text-espresso-400 line-through" : "text-espresso-900"}`}>
                {chapter.title}
              </p>
              <p className="text-xs text-espresso-400">
                {chapter.completedVideos}/{chapter.totalVideos} vidéos
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
