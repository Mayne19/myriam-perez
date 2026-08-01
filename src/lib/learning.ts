import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/demo";
import { MOCK_COURSES, getMockProgressMap } from "@/lib/mock/data";

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  totalVideos: number;
  completedVideos: number;
  percent: number;
};

export type ChapterStatus = "done" | "in_progress" | "not_started";

export type ChapterSummary = {
  id: string;
  title: string;
  orderIndex: number;
  totalVideos: number;
  completedVideos: number;
  status: ChapterStatus;
};

export type VideoWithProgress = {
  id: string;
  title: string;
  videoUrl: string;
  durationSeconds: number;
  orderIndex: number;
  secondsWatched: number;
  completed: boolean;
};

function statusFor(total: number, completed: number): ChapterStatus {
  if (total === 0 || completed === 0) return total > 0 && completed === total ? "done" : "not_started";
  return completed === total ? "done" : "in_progress";
}

/*
  Vue "Mes formations" : les 5 formations avec la progression individuelle de
  l'apprenant connecté (nombre de vidéos terminées / total).
*/
export async function getCoursesWithProgress(userId: string): Promise<CourseSummary[]> {
  if (!isSupabaseConfigured()) {
    const progress = getMockProgressMap(userId);
    return MOCK_COURSES.map((course) => {
      const videoIds = course.chapters.flatMap((c) => c.videos.map((v) => v.id));
      const completedVideos = videoIds.filter((id) => progress.get(id)?.completed).length;
      const totalVideos = videoIds.length;
      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        coverImageUrl: course.coverImageUrl,
        totalVideos,
        completedVideos,
        percent: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0,
      };
    });
  }

  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title, description, cover_image_url, chapters(videos(id))")
    .order("order_index", { ascending: true });

  const { data: progressRows } = await supabase
    .from("video_progress")
    .select("video_id, completed")
    .eq("user_id", userId)
    .eq("completed", true);

  const completedIds = new Set((progressRows ?? []).map((r) => r.video_id as string));

  return (courses ?? []).map((course) => {
    const chapters = (course.chapters ?? []) as { videos: { id: string }[] }[];
    const videoIds = chapters.flatMap((c) => c.videos.map((v) => v.id));
    const completedVideos = videoIds.filter((id) => completedIds.has(id)).length;
    const totalVideos = videoIds.length;
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      coverImageUrl: course.cover_image_url,
      totalVideos,
      completedVideos,
      percent: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0,
    };
  });
}

/*
  Progression globale (jauge du dashboard) : toutes vidéos de toutes
  formations confondues.
*/
export async function getGlobalProgress(userId: string): Promise<{ percent: number; completed: number; total: number }> {
  const courses = await getCoursesWithProgress(userId);
  const total = courses.reduce((sum, c) => sum + c.totalVideos, 0);
  const completed = courses.reduce((sum, c) => sum + c.completedVideos, 0);
  return { percent: total > 0 ? Math.round((completed / total) * 100) : 0, completed, total };
}

/*
  Vue "Formation" : liste des chapitres avec statut (terminé / en cours / pas
  commencé), calculé à partir des vidéos de chaque chapitre.
*/
export async function getCourseDetail(slug: string, userId: string) {
  if (!isSupabaseConfigured()) {
    const course = MOCK_COURSES.find((c) => c.slug === slug);
    if (!course) return null;
    const progress = getMockProgressMap(userId);
    const chapters: ChapterSummary[] = course.chapters
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((chapter) => {
        const totalVideos = chapter.videos.length;
        const completedVideos = chapter.videos.filter((v) => progress.get(v.id)?.completed).length;
        return {
          id: chapter.id,
          title: chapter.title,
          orderIndex: chapter.orderIndex,
          totalVideos,
          completedVideos,
          status: statusFor(totalVideos, completedVideos),
        };
      });
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      coverImageUrl: course.coverImageUrl,
      chapters,
    };
  }

  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title, description, cover_image_url, chapters(id, title, order_index, videos(id))")
    .eq("slug", slug)
    .maybeSingle();

  if (!course) return null;

  const { data: progressRows } = await supabase
    .from("video_progress")
    .select("video_id, completed")
    .eq("user_id", userId)
    .eq("completed", true);

  const completedIds = new Set((progressRows ?? []).map((r) => r.video_id as string));

  const chapters: ChapterSummary[] = ((course.chapters ?? []) as { id: string; title: string; order_index: number; videos: { id: string }[] }[])
    .sort((a, b) => a.order_index - b.order_index)
    .map((chapter) => {
      const totalVideos = chapter.videos.length;
      const completedVideos = chapter.videos.filter((v) => completedIds.has(v.id)).length;
      return {
        id: chapter.id,
        title: chapter.title,
        orderIndex: chapter.order_index,
        totalVideos,
        completedVideos,
        status: statusFor(totalVideos, completedVideos),
      };
    });

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    coverImageUrl: course.cover_image_url,
    chapters,
  };
}

/*
  Vue "Chapitre" : les vidéos du chapitre avec la progression de
  l'apprenant (position de reprise, terminé ou non), plus de quoi naviguer
  vers le chapitre précédent/suivant de la formation.
*/
export async function getChapterDetail(chapterId: string, userId: string) {
  if (!isSupabaseConfigured()) {
    const course = MOCK_COURSES.find((c) => c.chapters.some((ch) => ch.id === chapterId));
    const chapter = course?.chapters.find((ch) => ch.id === chapterId);
    if (!course || !chapter) return null;
    const progress = getMockProgressMap(userId);
    const videos: VideoWithProgress[] = chapter.videos
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((video) => {
        const p = progress.get(video.id);
        return {
          id: video.id,
          title: video.title,
          videoUrl: video.videoUrl,
          durationSeconds: video.durationSeconds,
          orderIndex: video.orderIndex,
          secondsWatched: p?.secondsWatched ?? 0,
          completed: p?.completed ?? false,
        };
      });
    const siblings = course.chapters.slice().sort((a, b) => a.orderIndex - b.orderIndex);
    const currentIndex = siblings.findIndex((c) => c.id === chapter.id);
    return {
      id: chapter.id,
      title: chapter.title,
      courseSlug: course.slug,
      courseTitle: course.title,
      videos,
      previousChapterId: currentIndex > 0 ? siblings[currentIndex - 1].id : null,
      nextChapterId: currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1].id : null,
    };
  }

  const supabase = await createClient();

  const { data: chapter } = await supabase
    .from("chapters")
    .select("id, title, order_index, course_id, courses(slug, title), videos(id, title, video_url, duration_seconds, order_index)")
    .eq("id", chapterId)
    .maybeSingle();

  if (!chapter) return null;

  const { data: progressRows } = await supabase
    .from("video_progress")
    .select("video_id, seconds_watched, completed")
    .eq("user_id", userId);

  const progressByVideo = new Map((progressRows ?? []).map((r) => [r.video_id as string, r]));

  const videos: VideoWithProgress[] = ((chapter.videos ?? []) as { id: string; title: string; video_url: string; duration_seconds: number; order_index: number }[])
    .sort((a, b) => a.order_index - b.order_index)
    .map((video) => {
      const progress = progressByVideo.get(video.id);
      return {
        id: video.id,
        title: video.title,
        videoUrl: video.video_url,
        durationSeconds: video.duration_seconds,
        orderIndex: video.order_index,
        secondsWatched: progress?.seconds_watched ?? 0,
        completed: progress?.completed ?? false,
      };
    });

  const course = Array.isArray(chapter.courses) ? chapter.courses[0] : chapter.courses;

  const { data: siblingChapters } = await supabase
    .from("chapters")
    .select("id, order_index")
    .eq("course_id", chapter.course_id)
    .order("order_index", { ascending: true });

  const siblings = siblingChapters ?? [];
  const currentIndex = siblings.findIndex((c) => c.id === chapter.id);

  return {
    id: chapter.id,
    title: chapter.title,
    courseSlug: (course as { slug: string; title: string } | undefined)?.slug ?? "",
    courseTitle: (course as { slug: string; title: string } | undefined)?.title ?? "",
    videos,
    previousChapterId: currentIndex > 0 ? siblings[currentIndex - 1].id : null,
    nextChapterId: currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1].id : null,
  };
}
