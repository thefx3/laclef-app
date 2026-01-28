"use client";

import type {
  AnyDraft,
  AssiduiteDraft,
  DocumentTemplateId,
  InscriptionDraft,
  PreinscriptionDraft,
} from "@/lib/flce/documents/documentTypes";
import { isAssiduite } from "@/lib/flce/documents/templates";
import { ui } from "./ui";

type Props = {
  template: DocumentTemplateId;
  draft: AnyDraft;
  onDraftChange: (updater: (prev: AnyDraft) => AnyDraft) => void;
  onGenerate: () => void;
  busy: boolean;
  selectedCount: number;
  defaultLevel: string;
};

export default function DocumentForm({
  template,
  draft,
  onDraftChange,
  onGenerate,
  busy,
  selectedCount,
  defaultLevel,
}: Props) {
  const assiduiteDraft = template === "assiduite" ? (draft as AssiduiteDraft) : null;
  const preinscriptionDraft = template === "preinscription" ? (draft as PreinscriptionDraft) : null;
  const inscriptionDraft = template === "inscription" ? (draft as InscriptionDraft) : null;

  return (
    <section className={`${ui.card} space-y-3`}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className={ui.cardTitle}>Paramètres du document</p>
          <p className={ui.cardSubtle}>Les champs sont pré-remplis, tu peux ajuster avant génération.</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-xs font-semibold text-slate-600">
          Ville
          <input
            className={ui.field}
            value={draft.place ?? ""}
            onChange={(e) => onDraftChange((p) => ({ ...p, place: e.target.value }))}
            placeholder="Ex: Saint-Germain-en-Laye"
          />
        </label>

        <label className="text-xs font-semibold text-slate-600">
          Date génération
          <input
            className={ui.field}
            type="date"
            value={draft.generatedAt ?? ""}
            onChange={(e) => onDraftChange((p) => ({ ...p, generatedAt: e.target.value }))}
          />
        </label>

        {isAssiduite(template) ? (
          <label className="text-xs font-semibold text-slate-600">
            Semestre
            <div className="mt-2 flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="radio"
                  name="semester"
                  checked={assiduiteDraft?.semester === 1}
                  onChange={() => onDraftChange((p) => ({ ...p, semester: 1 }))}
                />
                S1
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="radio"
                  name="semester"
                  checked={assiduiteDraft?.semester === 2}
                  onChange={() => onDraftChange((p) => ({ ...p, semester: 2 }))}
                />
                S2 (défaut)
              </label>
            </div>
          </label>
        ) : (
          <div />
        )}
      </div>

      {template === "preinscription" && (
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={preinscriptionDraft?.mention150 !== false}
            onChange={(e) => onDraftChange((p) => ({ ...p, mention150: e.target.checked }))}
          />
          Mention “Pré-inscription 150€” (recommandé)
        </label>
      )}

      {template === "inscription" && (
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={inscriptionDraft?.mentionPaidTotal !== false}
            onChange={(e) => onDraftChange((p) => ({ ...p, mentionPaidTotal: e.target.checked }))}
          />
          Mention “Total réglé / non remboursable” (recommandé)
        </label>
      )}

      {template === "assiduite" && (
        <label className="text-xs font-semibold text-slate-600">
          Niveau (défaut S2)
          <input
            className={ui.field}
            value={assiduiteDraft?.levelOverride ?? defaultLevel}
            onChange={(e) =>
              onDraftChange((p) => ({
                ...p,
                levelOverride: e.target.value.trim() ? e.target.value : undefined,
              }))
            }
            placeholder="Laisser vide pour utiliser la classe du semestre"
          />
        </label>
      )}

      <div className="flex items-center justify-end gap-2">
        <button type="button" className="btn-primary" onClick={onGenerate} disabled={busy}>
          {busy ? "Génération..." : `Générer PDF (${selectedCount} page(s))`}
        </button>
      </div>
    </section>
  );
}
