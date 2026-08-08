function initials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function ProfileHeader({ fullName, email }: { fullName: string | null; email: string | null }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-cream-50">
        {initials(fullName)}
      </div>
      <div>
        <h1 className="text-2xl font-medium text-espresso-900">{fullName || "Apprenant"}</h1>
        {email && <p className="mt-1 text-sm text-espresso-500">{email}</p>}
      </div>
    </div>
  );
}
