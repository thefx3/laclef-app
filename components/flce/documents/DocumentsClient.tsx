"use client";

import { useMemo, useState } from "react";
import type {
  AnyDraft,
  DocumentTemplateId,
  GenerateDocumentPayload,
  SeasonRow,
  StudentDocRow,
} from "@/lib/flce/documents/documentTypes";
import { TEMPLATE_LABEL, defaultDraft } from "@/lib/flce/documents/templates";
import { getSemester, getStudentLevelForSemester } from "@/lib/flce/documents/text";
import DocumentForm from "./DocumentForm";
import DocumentPreview from "./DocumentPreview";
import StudentPicker from "./StudentPicker";
import { ui } from "./ui";

function filterStudents(students: StudentDocRow[], seasonId: string | "ALL", query: string) {
  const base = seasonId === "ALL" ? students : students.filter((s) => s.season_id === seasonId);
  const q = query.trim().toLowerCase();
  if (!q) return base;
  return base.filter((s) => {
    const first = (s.first_name ?? "").toLowerCase();
    const last = (s.last_name ?? "").toLowerCase();
    return `${first} ${last}`.includes(q) || `${last} ${first}`.includes(q);
  });
}

export default function DocumentsClient({
  initialStudents,
  seasons,
  defaultSeasonId,
}: {
  initialStudents: StudentDocRow[];
  seasons: SeasonRow[];
  defaultSeasonId: string | null;
}) {
  const [template, setTemplate] = useState<DocumentTemplateId>("preinscription");
  const [draft, setDraft] = useState<AnyDraft>(() => defaultDraft("preinscription"));
  const [seasonId, setSeasonId] = useState<string | "ALL">(defaultSeasonId ?? "ALL");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const students = useMemo(
    () => filterStudents(initialStudents, seasonId, query),
    [initialStudents, seasonId, query]
  );

  const selectedStudents = useMemo(() => {
    const set = new Set(selectedIds);
    return students.filter((s) => set.has(s.id));
  }, [students, selectedIds]);

  const previewStudent = selectedStudents[0] ?? null;
  const semester = getSemester(draft);
  const seasonLabelById = useMemo(() => new Map(seasons.map((s) => [s.id, s.code])), [seasons]);
  const previewSeasonLabel = previewStudent ? seasonLabelById.get(previewStudent.season_id ?? "") ?? "—" : "—";
  const defaultLevel = previewStudent ? getStudentLevelForSemester(previewStudent, semester) : "—";

  function switchTemplate(next: DocumentTemplateId) {
    setTemplate(next);
    setDraft(defaultDraft(next));
    setError(null);
  }

  function updateDraft(updater: (prev: AnyDraft) => AnyDraft) {
    setDraft((prev) => updater(prev));
  }

  function toggleStudent(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function selectAllVisible() {
    setSelectedIds(students.map((s) => s.id));
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  function getLevelLabel(student: StudentDocRow) {
    if (template === "assiduite") {
      return getStudentLevelForSemester(student, semester);
    }
    return student.class_s1_code ?? student.class_s2_code ?? "—";
  }

  function getSeasonLabel(seasonIdValue: string | null) {
    if (!seasonIdValue) return "—";
    return seasonLabelById.get(seasonIdValue) ?? "—";
  }

  async function generatePdf() {
    setError(null);

    if (selectedIds.length === 0) {
      setError("Sélectionne au moins 1 élève.");
      return;
    }

    const payload: GenerateDocumentPayload = {
      template,
      studentIds: selectedIds,
      draft,
    };

    setBusy(true);
    try {
      const res = await fetch("/api/flce/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Erreur serveur (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const fileBase = TEMPLATE_LABEL[template].replaceAll(" ", "_").replaceAll("'", "").toLowerCase();
      a.download = `${fileBase}_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["preinscription", "inscription", "assiduite"] as DocumentTemplateId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`${ui.tabBase} ${template === id ? ui.tabOn : ui.tabOff}`}
            onClick={() => switchTemplate(id)}
          >
            {TEMPLATE_LABEL[id]}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <StudentPicker
            seasons={seasons}
            students={students}
            seasonId={seasonId}
            onSeasonChange={(value) => {
              setSeasonId(value);
              setSelectedIds([]);
            }}
            query={query}
            onQueryChange={setQuery}
            selectedIds={selectedIds}
            onToggleStudent={toggleStudent}
            onSelectAllVisible={selectAllVisible}
            onClearSelection={clearSelection}
            selectionCount={selectedIds.length}
            getLevelLabel={getLevelLabel}
            getSeasonLabel={getSeasonLabel}
          />

          <DocumentForm
            template={template}
            draft={draft}
            onDraftChange={updateDraft}
            onGenerate={generatePdf}
            busy={busy}
            selectedCount={selectedIds.length}
            defaultLevel={defaultLevel}
          />
        </div>

        <DocumentPreview
          template={template}
          draft={draft}
          onDraftChange={updateDraft}
          previewStudent={previewStudent}
          seasonLabel={previewSeasonLabel}
          selectedCount={selectedIds.length}
        />
      </div>
    </div>
  );
}
