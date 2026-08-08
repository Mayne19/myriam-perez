"use client";

import ResumeCard from "@/components/espace/ResumeCard";
import MiniCourseCard from "@/components/espace/MiniCourseCard";
import type { CourseSummary } from "@/lib/learning";

/*
  « Reprendre votre formation » + les blocs « À découvrir » en dessous.
  La grille du bas grandit (flex-1) pour que son bas finisse sur la même
  ligne que le bas de « Progression par formation », avec 173 px de minimum.
*/
export default function ResumeSection({
  resume,
  discover,
}: {
  resume: CourseSummary;
  discover: { course: CourseSummary; started: boolean }[];
}) {
  return (
    <>
      <h2 className="text-2xl font-medium text-espresso-900">Reprendre votre formation</h2>
      <div className="mt-5">
        <ResumeCard course={resume} started />
      </div>
      {discover.length > 0 && (
        <>
          <h2 className="mt-8 text-2xl font-medium text-espresso-900">À découvrir</h2>
          <div className="mt-3 grid flex-1 min-h-[173px] gap-3 sm:grid-cols-3">
            {discover.map(({ course, started }) => (
              <MiniCourseCard key={course.id} course={course} started={started} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
