"use client";

import { memo } from "react";

type FiltersState = {
  gender: "" | "M" | "F" | "X";
  classCode: string;
  birthPlace: string;
  isAuPair: "" | "true" | "false";
  preRegistration: "" | "true" | "false";
  ageMin: string;
  ageMax: string;
};

function StudentFiltersBase({
  filters,
  total,
  visible,
  onChange,
  onReset,
}: {
  filters: FiltersState;
  total: number;
  visible: number;
  onChange: (next: FiltersState) => void;
  onReset: () => void;
}) {
  const update = (patch: Partial<FiltersState>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-800">
            Filtres
          </h3>
          <p className="text-xs text-slate-500">
            {visible} visibles / {total} total
          </p>
        </div>
        <button className="btn-action btn-action--edit" type="button" onClick={onReset}>
          Réinitialiser
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-4">
        <label className="text-xs font-semibold text-slate-600">
          Genre
          <select
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            value={filters.gender}
            onChange={(e) => update({ gender: e.target.value as FiltersState["gender"] })}
          >
            <option value="">Tous</option>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="X">X</option>
          </select>
        </label>

        <label className="text-xs font-semibold text-slate-600">
          Classe
          <input
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            value={filters.classCode}
            onChange={(e) => update({ classCode: e.target.value })}
            placeholder="Ex: A1"
          />
        </label>

        <label className="text-xs font-semibold text-slate-600">
          Lieu de naissance
          <input
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            value={filters.birthPlace}
            onChange={(e) => update({ birthPlace: e.target.value })}
            placeholder="Ville"
          />
        </label>

        <label className="text-xs font-semibold text-slate-600">
          Au pair
          <select
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            value={filters.isAuPair}
            onChange={(e) => update({ isAuPair: e.target.value as FiltersState["isAuPair"] })}
          >
            <option value="">Tous</option>
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </label>

        <label className="text-xs font-semibold text-slate-600">
          Pré-inscription
          <select
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            value={filters.preRegistration}
            onChange={(e) =>
              update({ preRegistration: e.target.value as FiltersState["preRegistration"] })
            }
          >
            <option value="">Toutes</option>
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </label>

        <label className="text-xs font-semibold text-slate-600">
          Âge min
          <input
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            value={filters.ageMin}
            onChange={(e) => update({ ageMin: e.target.value })}
            placeholder="12"
            inputMode="numeric"
          />
        </label>

        <label className="text-xs font-semibold text-slate-600">
          Âge max
          <input
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            value={filters.ageMax}
            onChange={(e) => update({ ageMax: e.target.value })}
            placeholder="18"
            inputMode="numeric"
          />
        </label>
      </div>
    </section>
  );
}

export const StudentFilters = memo(StudentFiltersBase);
StudentFilters.displayName = "StudentFilters";
