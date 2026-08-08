import Image from "next/image";
import ProgressGauge from "@/components/espace/ProgressGauge";

function initials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function firstName(name: string | null) {
  return name?.trim().split(/\s+/)[0] ?? null;
}

export default function ProfileCard({
  fullName,
  percent,
  photoUrl = null,
  username = null,
}: {
  fullName: string | null;
  percent: number;
  photoUrl?: string | null;
  username?: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-espresso-900/10 bg-white px-6 pt-7 pb-6 text-center">
      <div className="relative">
        <ProgressGauge percent={percent} size={192} strokeWidth={3}>
          <div className="relative h-[168px] w-[168px] overflow-hidden rounded-full">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={`Photo de ${fullName ?? "profil"}`}
                fill
                sizes="168px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#F07020_0%,#D8B15B_55%,#C05A18_100%)] text-4xl font-semibold text-cream-50">
                {initials(fullName)}
              </div>
            )}
          </div>
        </ProgressGauge>
        <div className="absolute left-[155px] top-[16px] flex h-6 items-center justify-center rounded-full bg-accent px-2 text-xs font-semibold text-cream-50 shadow-sm shadow-espresso-900/10">
          {percent}%
        </div>
      </div>
      {username && (
        <p className="bg-[linear-gradient(135deg,#F07020_0%,#D8B15B_55%,#C05A18_100%)] bg-clip-text text-lg font-semibold text-transparent">
          @{username}
        </p>
      )}
      <h2 className="text-2xl font-medium leading-none text-espresso-900">
        Bonjour{firstName(fullName) ? `, ${firstName(fullName)}` : ""} 👋
      </h2>
    </div>
  );
}
