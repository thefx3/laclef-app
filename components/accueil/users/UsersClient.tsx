"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import { ROLE_OPTIONS, type AppRole, type UserProfileRow } from "./type";

async function adminCall(method: "POST" | "PATCH" | "DELETE", body: any) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch("/api/admin/users", {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Erreur serveur");
  }

  // optionnel: si ton API renvoie un JSON, tu peux return res.json()
  return res.json().catch(() => ({}));
}

const rolePill = (role: AppRole) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "ADMIN":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "ACCUEIL":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    case "MUSIQUE":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "ACTIVITES":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    case "FLCE":
      return "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
};

const fieldBase =
  "mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none";

export default function UsersClient({
  initialUsers,
  currentRole,
  currentUserId,
}: {
  initialUsers: UserProfileRow[];
  currentRole: AppRole;
  currentUserId: string;
}) {
  const [users, setUsers] = useState<UserProfileRow[]>(initialUsers);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = currentRole === "ADMIN" || currentRole === "SUPER_ADMIN";
  const isSuperAdmin = currentRole === "SUPER_ADMIN";
  const canCreate = currentRole === "ACCUEIL" || isAdmin;

  // create
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newRole, setNewRole] = useState<AppRole>("USER");
  const [creating, setCreating] = useState(false);

  // edit modal
  const [editing, setEditing] = useState<UserProfileRow | null>(null);
  const [editRole, setEditRole] = useState<AppRole>("USER");
  const [editEmail, setEditEmail] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const canEditUser = (u: UserProfileRow) => {
    if (isAdmin) {
      if (u.role === "SUPER_ADMIN" && !isSuperAdmin) return false;
      return true;
    }
    return u.user_id === currentUserId;
  };

  const canDeleteUser = (u: UserProfileRow) => {
    if (!isAdmin) return false;
    if (u.role === "SUPER_ADMIN" && !isSuperAdmin) return false;
    if (u.user_id === currentUserId) return false;
    return true;
  };

  const canShowActions = isAdmin || users.some((u) => u.user_id === currentUserId);
  const canEditRole =
    !!editing && isAdmin && (isSuperAdmin || editing.role !== "SUPER_ADMIN");

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* CREATE */}
      {canCreate && (
        <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm uppercase tracking-widest font-semibold text-slate-900">Créer un compte</h2>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <label className="text-xs font-semibold text-slate-600">
              Prénom
              <input
                className={fieldBase}
                placeholder="Prénom"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Nom
              <input
                className={fieldBase}
                placeholder="Nom"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Email
              <input
                className={fieldBase}
                placeholder="Email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Mot de passe
              <input
                className={fieldBase}
                placeholder="Mot de passe"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Rôle
              <select
                className={fieldBase}
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as AppRole)}
              >
                {ROLE_OPTIONS.filter((r) => isSuperAdmin || r !== "SUPER_ADMIN").map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <button
            className="rounded-lg bg-slate-900 mt-4 px-4 py-1 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 cursor-pointer disabled:opacity-60"
            disabled={creating}
            onClick={async () => {
                setError(null);
                const nextEmail = newEmail.trim();
                const nextFirst = newFirstName.trim();
                const nextLast = newLastName.trim();
                if (!nextEmail || !newPassword || !nextFirst || !nextLast) {
                setError("Email, mot de passe, prénom et nom sont requis.");
                return;
                }
                setCreating(true);
                try {
                const result = await adminCall("POST", {
                    email: nextEmail,
                    password: newPassword,
                    role: newRole,
                    first_name: nextFirst,
                    last_name: nextLast,
                });

                // ✅ si ton API renvoie { user_profile: ... } : on l’ajoute instant
                if (result?.user_profile) {
                    setUsers((prev) => [result.user_profile as UserProfileRow, ...prev]);
                }

                setNewEmail("");
                setNewPassword("");
                setNewFirstName("");
                setNewLastName("");
                setNewRole("USER");
                } catch (e) {
                setError((e as Error).message);
                } finally {
                setCreating(false);
                }
            }}
            >
            {creating ? "Création…" : "Créer"}
            </button>
          </div>

        </section>
      )}

      {/* TABLE */}
      <section className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
      {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Comptes</h2>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            {users.length} compte{users.length > 1 ? "s" : ""}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 !text-left">Email</th>
                <th className="px-4 py-3 !text-left">Prénom</th>
                <th className="px-4 py-3 !text-left">Nom</th>
                <th className="px-4 py-3 !text-left">Rôle</th>
                {canShowActions && <th className="px-4 py-3 !text-left">Actions</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const canEdit = canEditUser(u);
                const canDelete = canDeleteUser(u);

                return (
                  <tr key={u.user_id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">{u.email ?? "—"}</span>
                        {u.user_id === currentUserId && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            Vous
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{u.first_name ?? "—"}</td>
                    <td className="px-4 py-4 text-slate-700">{u.last_name ?? "—"}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${rolePill(
                          u.role
                        )}`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {canShowActions && (
                      <td className="px-4 py-4 text-left whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-50"
                            disabled={!canEdit}
                            onClick={() => {
                              setEditing(u);
                              setEditRole(u.role);
                              setEditEmail(u.email ?? "");
                              setEditFirstName(u.first_name ?? "");
                              setEditLastName(u.last_name ?? "");
                            }}
                          >
                            Modifier
                          </button>
                          {isAdmin && (
                            <button
                              className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:text-rose-800 disabled:opacity-50"
                              disabled={!canDelete}
                              onClick={async () => {
                                setError(null);
                                const prev = users;
                                setUsers((cur) => cur.filter((x) => x.user_id !== u.user_id));
                                try {
                                  await adminCall("DELETE", { user_id: u.user_id });
                                } catch (e) {
                                  setUsers(prev);
                                  setError((e as Error).message);
                                }
                              }}
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-slate-500"
                    colSpan={canShowActions ? 5 : 4}
                  >
                    Aucun utilisateur.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-800">
                  Modifier
                </h2>
              </div>
              <button
                className="text-sm font-semibold text-slate-600 hover:underline"
                onClick={() => setEditing(null)}
              >
                Fermer
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="text-xs font-semibold text-slate-600">
                  Email
                  <input
                    className={fieldBase}
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </label>
                {isAdmin ? (
                  <label className="text-xs font-semibold text-slate-600">
                    Rôle
                    <select
                      className={fieldBase}
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as AppRole)}
                      disabled={!canEditRole}
                    >
                      {ROLE_OPTIONS.filter((r) => isSuperAdmin || r !== "SUPER_ADMIN").map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <div className="text-xs font-semibold text-slate-600">
                    Rôle
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${rolePill(
                          editing.role
                        )}`}
                      >
                        {editing.role}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="text-xs font-semibold text-slate-600">
                  Prénom
                  <input
                    className={fieldBase}
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-600">
                  Nom
                  <input
                    className={fieldBase}
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  onClick={() => setEditing(null)}
                >
                  Annuler
                </button>

                <button
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                  disabled={savingEdit}
                  onClick={async () => {
                    setError(null);
                    if (!editEmail.trim()) {
                      setError("Email requis.");
                      return;
                    }
                    setSavingEdit(true);

                    const prev = users;
                    const nextEmail = editEmail.trim();
                    const nextFirst = editFirstName.trim();
                    const nextLast = editLastName.trim();

                    setUsers((cur) =>
                      cur.map((u) =>
                        u.user_id === editing.user_id
                          ? {
                              ...u,
                              email: nextEmail,
                              first_name: nextFirst || null,
                              last_name: nextLast || null,
                              role: canEditRole ? editRole : u.role,
                            }
                          : u
                      )
                    );

                    try {
                      const payload: any = {
                        user_id: editing.user_id,
                        email: nextEmail,
                        first_name: nextFirst || null,
                        last_name: nextLast || null,
                      };
                      if (canEditRole) payload.role = editRole;

                      await adminCall("PATCH", payload);
                      setEditing(null);
                    } catch (e) {
                      setUsers(prev);
                      setError((e as Error).message);
                    } finally {
                      setSavingEdit(false);
                    }
                  }}
                >
                  {savingEdit ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
