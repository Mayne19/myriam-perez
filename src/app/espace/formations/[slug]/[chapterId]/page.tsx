import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getChapterDetail } from "@/lib/learning";
import ChapterPlayer from "@/components/espace/ChapterPlayer";

export default async function ChapterPage({ params }: { params: { slug: string; chapterId: string } }) {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const chapter = await getChapterDetail(params.chapterId, profile.id);
  if (!chapter || chapter.courseSlug !== params.slug) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href={`/espace/formations/${params.slug}`} className="text-sm font-medium text-espresso-400 no-underline hover:text-accent">
          ← {chapter.courseTitle}
        </Link>
        <h1 className="mt-3 text-2xl font-medium text-espresso-900">{chapter.title}</h1>
      </div>

      {chapter.videos.length === 0 ? (
        <p className="rounded-2xl border border-espresso-900/10 bg-white p-6 text-sm text-espresso-400">
          Les vidéos de ce chapitre seront bientôt disponibles.
        </p>
      ) : (
        <ChapterPlayer videos={chapter.videos} />
      )}

      <div className="flex items-center justify-between border-t border-espresso-900/10 pt-6">
        {chapter.previousChapterId ? (
          <Link
            href={`/espace/formations/${params.slug}/${chapter.previousChapterId}`}
            className="flex items-center gap-1 text-sm font-medium text-espresso-700 no-underline hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" /> Chapitre précédent
          </Link>
        ) : (
          <span />
        )}
        {chapter.nextChapterId && (
          <Link
            href={`/espace/formations/${params.slug}/${chapter.nextChapterId}`}
            className="flex items-center gap-1 text-sm font-medium text-espresso-700 no-underline hover:text-accent"
          >
            Chapitre suivant <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
