function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-espresso-900/10 px-6 py-4 last:border-b-0">
      <span className="text-sm text-espresso-500">{label}</span>
      <span className="text-sm font-medium text-espresso-900">{value}</span>
    </div>
  );
}

export default function PersonalDetails({
  fullName,
  email,
  status,
}: {
  fullName: string | null;
  email: string | null;
  status: "pending" | "active";
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-espresso-900/10 bg-white">
      <div className="border-b border-espresso-900/10 bg-cream-100 px-6 py-3">
        <h2 className="font-medium text-espresso-900">Détails personnels</h2>
      </div>
      <Row label="Nom complet" value={fullName || "—"} />
      <Row label="Email" value={email || "—"} />
      <Row label="Statut" value={status === "active" ? "Actif" : "En attente"} />
    </div>
  );
}
