"use client";

import type { AnyDraft, DocumentTemplateId, StudentDocRow } from "@/lib/flce/documents/documentTypes";
import { TEMPLATE_LABEL } from "@/lib/flce/documents/templates";
import {
  buildDefaultParagraphs,
  paragraphsToBodyText,
  resolveDocumentText,
} from "@/lib/flce/documents/text";
import { ui } from "./ui";

type Props = {
  template: DocumentTemplateId;
  draft: AnyDraft;
  onDraftChange: (updater: (prev: AnyDraft) => AnyDraft) => void;
  previewStudent: StudentDocRow | null;
  seasonLabel: string;
  selectedCount: number;
};

export default function DocumentPreview({
  template,
  draft,
  onDraftChange,
  previewStudent,
  seasonLabel,
  selectedCount,
}: Props) {
  if (!previewStudent) {
    return (
      <section className={`${ui.card} space-y-3`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={ui.cardTitle}>Aperçu du document</p>
            <p className={ui.cardSubtle}>Basé sur la sélection et les paramètres actuels.</p>
          </div>
          <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {TEMPLATE_LABEL[template]}
          </span>
        </div>
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          Sélectionne au moins un élève pour voir l’aperçu.
        </div>
      </section>
    );
  }

  const defaultParagraphs = buildDefaultParagraphs({
    template,
    student: previewStudent,
    seasonLabel,
    draft,
  });
  const defaultBodyText = paragraphsToBodyText(defaultParagraphs);
  const bodyTextValue = draft.bodyText ?? defaultBodyText;
  const resolved = resolveDocumentText({
    template,
    student: previewStudent,
    seasonLabel,
    draft,
  });

  return (
    <section className={`${ui.card} space-y-3`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={ui.cardTitle}>Aperçu du document</p>
          <p className={ui.cardSubtle}>Basé sur la sélection et les paramètres actuels.</p>
        </div>
        <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          {TEMPLATE_LABEL[template]}
        </span>
      </div>

      <div className="text-xs text-slate-500">
        Aperçu pour{" "}
        <span className="font-semibold text-slate-700">
          {previewStudent.first_name} {previewStudent.last_name}
        </span>
        {selectedCount > 1 ? ` (+${selectedCount - 1} autre(s))` : ""}
      </div>

      <div className="grid gap-3">
        <label className="text-xs font-semibold text-slate-600">
          Corps du document (modifiable)
          <textarea
            className={`${ui.field} min-h-[160px] leading-6`}
            value={bodyTextValue}
            onChange={(e) =>
              onDraftChange((p) => ({
                ...p,
                bodyText: e.target.value.trim() ? e.target.value : undefined,
              }))
            }
          />
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-slate-600 underline"
            onClick={() => onDraftChange((p) => ({ ...p, bodyText: undefined }))}
          >
            Réinitialiser le texte
          </button>
        </label>
        <p className="text-[11px] text-slate-500">
          Tokens disponibles : {"{{first_name}}"} {"{{last_name}}"} {"{{last_name_upper}}"} {"{{full_name}}"} {"{{civ}}"} {"{{season}}"} {"{{arrival_date}}"} {"{{departure_date}}"} {"{{semester}}"} {"{{level}}"}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 space-y-3">
        {resolved.paragraphs.map((p, idx) => (
          <p key={idx} className="leading-6">
            {p}
          </p>
        ))}
        <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">{resolved.footerLine}</div>
      </div>
    </section>
  );
}
