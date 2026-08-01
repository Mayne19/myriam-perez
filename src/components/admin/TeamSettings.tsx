"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FIELD_CLASSES } from "@/lib/fields";
import { inviteTeamMember, updateMemberRole } from "@/app/admin/parametres/actions";
import type { TeamMember, InvitationRow } from "@/lib/admin/team";

type Role = "admin" | "editor";

const ROLE_LABEL: Record<Role, string> = { admin: "Administrateur", editor: "Éditeur" };

export default function TeamSettings({
  members,
  invitations,
  currentUserId,
}: {
  members: TeamMember[];
  invitations: InvitationRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [inviting, setInviting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleInvite(e: FormEvent) {
    e.preventDefault();
    setInviting(true);
    setStatus(null);
    const { error } = await inviteTeamMember(email, role);
    setStatus(error ?? `Invitation envoyée à ${email}.`);
    if (!error) {
      setEmail("");
      router.refresh();
    }
    setInviting(false);
  }

  async function handleRoleChange(userId: string, newRole: Role) {
    await updateMemberRole(userId, newRole);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleInvite} className="rounded-2xl border border-espresso-900/10 bg-white p-6">
        <h2 className="font-medium text-espresso-900">Inviter un membre</h2>
        <p className="mt-1 text-sm text-espresso-400">
          Un courriel d&apos;invitation est envoyé pour créer l&apos;accès avec le rôle choisi.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Courriel"
            className={FIELD_CLASSES}
          />
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={`${FIELD_CLASSES} sm:w-56`}>
            <option value="editor">Éditeur (blog uniquement)</option>
            <option value="admin">Administrateur (accès complet)</option>
          </select>
          <button
            type="submit"
            disabled={inviting}
            className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-dark disabled:opacity-60"
          >
            {inviting ? "…" : "Inviter"}
          </button>
        </div>
        {status && <p className="mt-2 text-sm text-espresso-500">{status}</p>}
      </form>

      <div className="rounded-2xl border border-espresso-900/10 bg-white p-6">
        <h2 className="font-medium text-espresso-900">Équipe</h2>
        <div className="mt-4 flex flex-col gap-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between gap-3 rounded-xl border border-espresso-900/10 p-3">
              <div>
                <p className="text-sm font-medium text-espresso-900">{member.fullName ?? member.email ?? "—"}</p>
                <p className="text-xs text-espresso-400">{member.email}</p>
              </div>
              {member.id === currentUserId ? (
                <span className="text-xs text-espresso-400">{ROLE_LABEL[member.role]} (vous)</span>
              ) : (
                <select
                  defaultValue={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value as Role)}
                  className="rounded-full border border-espresso-900/15 bg-cream-50 px-3 py-1.5 text-xs font-medium text-espresso-700"
                >
                  <option value="editor">Éditeur</option>
                  <option value="admin">Administrateur</option>
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      {invitations.length > 0 && (
        <div className="rounded-2xl border border-espresso-900/10 bg-white p-6">
          <h2 className="font-medium text-espresso-900">Invitations envoyées</h2>
          <div className="mt-4 flex flex-col gap-2">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between text-sm text-espresso-600">
                <span>{inv.email}</span>
                <span className="text-xs text-espresso-400">{ROLE_LABEL[inv.role]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
