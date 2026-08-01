"use client";

import { useMemo, useRef, useState } from "react";
import { CircleCheck, Play } from "lucide-react";
import { saveVideoProgress } from "@/app/espace/actions";
import type { VideoWithProgress } from "@/lib/learning";

const DIRECT_FILE = /\.(mp4|webm|ogg|m3u8)(\?|$)/i;
// N'enregistre pas à chaque frame de `timeupdate` (plusieurs fois/seconde) :
// une sauvegarde toutes les 5 s suffit pour la reprise automatique.
const SAVE_INTERVAL_MS = 5000;

export default function ChapterPlayer({ videos }: { videos: VideoWithProgress[] }) {
  const firstUnfinished = videos.findIndex((v) => !v.completed);
  const [activeIndex, setActiveIndex] = useState(Math.max(0, firstUnfinished));
  const lastSaveRef = useRef(0);
  const active = videos[activeIndex];
  const isDirectFile = useMemo(() => DIRECT_FILE.test(active?.videoUrl ?? ""), [active]);

  function goToNext() {
    setActiveIndex((i) => Math.min(videos.length - 1, i + 1));
  }

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
    const now = Date.now();
    if (now - lastSaveRef.current < SAVE_INTERVAL_MS) return;
    lastSaveRef.current = now;
    const el = e.currentTarget;
    saveVideoProgress(active.id, el.currentTime, el.duration || active.durationSeconds);
  }

  function handleEnded(e: React.SyntheticEvent<HTMLVideoElement>) {
    const el = e.currentTarget;
    saveVideoProgress(active.id, el.duration || active.durationSeconds, el.duration || active.durationSeconds);
    goToNext();
  }

  function handleLoadedMetadata(e: React.SyntheticEvent<HTMLVideoElement>) {
    const el = e.currentTarget;
    if (active.secondsWatched > 3 && active.secondsWatched < el.duration - 3) {
      el.currentTime = active.secondsWatched;
    }
  }

  async function markCompleteManually() {
    await saveVideoProgress(active.id, active.durationSeconds || 1, active.durationSeconds || 1);
    goToNext();
  }

  if (!active) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
      <div className="flex flex-col gap-4">
        {isDirectFile ? (
          <video
            key={active.id}
            controls
            className="aspect-video w-full rounded-2xl bg-espresso-900"
            src={active.videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onLoadedMetadata={handleLoadedMetadata}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <iframe
              key={active.id}
              src={active.videoUrl}
              title={active.title}
              className="aspect-video w-full rounded-2xl bg-espresso-900"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
            {/*
              Un contenu intégré via iframe (Kajabi, etc.) ne renvoie pas la
              position de lecture au site : pas de suivi automatique possible
              dans ce cas, on laisse l'apprenant confirmer manuellement.
            */}
            {!active.completed && (
              <button
                type="button"
                onClick={markCompleteManually}
                className="self-start rounded-full border border-espresso-900/15 px-5 py-2.5 text-sm font-medium text-espresso-700 transition-colors hover:border-accent/40 hover:text-accent"
              >
                Marquer cette vidéo comme terminée
              </button>
            )}
          </div>
        )}
        <h2 className="text-lg font-medium text-espresso-900">{active.title}</h2>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-espresso-400">Vidéos du chapitre</p>
        {videos.map((video, index) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
              index === activeIndex
                ? "border-accent/40 bg-accent-bg"
                : "border-espresso-900/10 bg-white hover:border-accent/30"
            }`}
          >
            {video.completed ? (
              <CircleCheck className="h-4 w-4 shrink-0 text-accent" />
            ) : (
              <Play className="h-4 w-4 shrink-0 text-espresso-300" />
            )}
            <span className="text-sm text-espresso-800">{video.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
