"use client";

import { memo, useState } from "react";
import type { LevelRow, TeacherRow, TimeSlotRow } from "@/lib/flce/referenceTypes";

type FiltersState = {
  gender: "" | "M" | "F" | "X";
  teacherId: string;
  levelId: string;
  timeSlotId: string;
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
  teachers,
  levels,
  timeSlots,
}: {
  filters: FiltersState;
  total: number;
  visible: number;
  onChange: (next: FiltersState) => void;
  onReset: () => void;
  teachers: TeacherRow[];
  levels: LevelRow[];
  timeSlots: TimeSlotRow[];
}) {
  const update = (patch: Partial<FiltersState>) => {
    onChange({ ...filters, ...patch });
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          className="flex items-center gap-2 text-sm font-semibold text-gray-900"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-800">
            Filtres
          </h3>
          <span className="text-xs text-gray-400">{isOpen ? "▲" : "▼"}</span>
        </button>
        <button className="btn-action btn-action--edit" type="button" onClick={onReset}>
          Réinitialiser
        </button>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {visible} visibles / {total} total
      </p>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "mt-4 max-h-[600px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          <label className="text-xs font-semibold text-slate-600">
            Civilité
            <select
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={filters.gender}
              onChange={(e) => update({ gender: e.target.value as FiltersState["gender"] })}
            >
              <option value="">Tous</option>
              <option value="M">Mr</option>
              <option value="F">Mrs</option>
              <option value="X">X</option>
            </select>
          </label>

          <label className="text-xs font-semibold text-slate-600">
            Professeur
            <select
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={filters.teacherId}
              onChange={(e) => update({ teacherId: e.target.value })}
            >
              <option value="">Tous</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.code} {teacher.full_name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-slate-600">
            Niveau
            <select
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={filters.levelId}
              onChange={(e) => update({ levelId: e.target.value })}
            >
              <option value="">Tous</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.code}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-slate-600">
            Horaire
            <select
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={filters.timeSlotId}
              onChange={(e) => update({ timeSlotId: e.target.value })}
            >
              <option value="">Tous</option>
              {timeSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.label}
                </option>
              ))}
            </select>
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
              onChange={(e) =>
                update({ isAuPair: e.target.value as FiltersState["isAuPair"] })
              }
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
      </div>
    </section>
  );
}

export const StudentFilters = memo(StudentFiltersBase);
StudentFilters.displayName = "StudentFilters";
