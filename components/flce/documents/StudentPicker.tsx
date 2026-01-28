"use client";

import type { SeasonRow, StudentDocRow } from "@/lib/flce/documents/documentTypes";
import { ui } from "./ui";

type Props = {
  seasons: SeasonRow[];
  students: StudentDocRow[];
  seasonId: string | "ALL";
  onSeasonChange: (value: string | "ALL") => void;
  query: string;
  onQueryChange: (value: string) => void;
  selectedIds: string[];
  onToggleStudent: (id: string) => void;
  onSelectAllVisible: () => void;
  onClearSelection: () => void;
  selectionCount: number;
  getLevelLabel: (student: StudentDocRow) => string;
  getSeasonLabel: (seasonId: string | null) => string;
};

export default function StudentPicker({
  seasons,
  students,
  seasonId,
  onSeasonChange,
  query,
  onQueryChange,
  selectedIds,
  onToggleStudent,
  onSelectAllVisible,
  onClearSelection,
  selectionCount,
  getLevelLabel,
  getSeasonLabel,
}: Props) {
  return (
    <section className={`${ui.card} space-y-3`}>
      <div className="grid gap-3 md:grid-cols-[260px_1fr]">
        <label className="text-xs font-semibold text-slate-600">
          Saison
          <select
            className={ui.field}
            value={seasonId}
            onChange={(e) => onSeasonChange(e.target.value as "ALL" | string)}
          >
            <option value="ALL">Toutes</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code}
                {s.is_current ? " (en cours)" : ""}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-[220px] flex-1 text-xs font-semibold text-slate-600">
            Recherche élève
            <input
              className={ui.field}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Nom ou prénom"
            />
          </label>
          <button type="button" className="btn-primary" onClick={onSelectAllVisible}>
            Tout sélectionner (visible)
          </button>
          <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" onClick={onClearSelection}>
            Vider
          </button>
          <div className="text-xs text-slate-500">
            Sélection : <span className="font-semibold">{selectionCount}</span>
          </div>
        </div>
      </div>

      <div className="max-h-[280px] overflow-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left">Sel.</th>
              <th className="px-3 py-2 text-left">Nom</th>
              <th className="px-3 py-2 text-left">Prénom</th>
              <th className="px-3 py-2 text-left">Niveau</th>
              <th className="px-3 py-2 text-left">Saison</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/70">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-slate-900"
                    checked={selectedIds.includes(s.id)}
                    onChange={() => onToggleStudent(s.id)}
                  />
                </td>
                <td className="px-3 py-2 font-semibold text-slate-900">{s.last_name}</td>
                <td className="px-3 py-2 text-slate-700">{s.first_name}</td>
                <td className="px-3 py-2 text-slate-600">{getLevelLabel(s)}</td>
                <td className="px-3 py-2 text-slate-600">{getSeasonLabel(s.season_id)}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-slate-500" colSpan={5}>
                  Aucun élève.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
