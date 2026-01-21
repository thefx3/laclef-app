"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { TYPE_OPTIONS, type PostType } from "@/lib/posts/types";
import { fromDateInputValue, toDateInputValue } from "@/lib/posts/calendarUtils";
import Modal from "@/components/ui/Modal";

type Props = {
  onClose: () => void;
  saving?: boolean;
  onCreate: (input: {
    content: string;
    type: PostType;
    startAt: Date;
    endAt?: Date;
  }) => void | Promise<void>;
  
};

function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}


export default function PostCreateModal({ onClose, onCreate, saving }: Props) {
  const [content, setContent] = useState("");
  const [type, setType] = useState<PostType>("EVENT");
  const [isFeatured, setIsFeatured] = useState(false);
  const [startDate, setStartDate] = useState(() => toDateInputValue(new Date()));
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = content.trim();
    if (!trimmed) return;

    const startAt = fromDateInputValue(startDate);
    const endAt = endDate ? fromDateInputValue(endDate) : undefined;

    if (endAt && endAt < startAt) {
      setError("La date de fin doit être après la date de début.");
      return;
    }

    const finalType: PostType = isFeatured ? "A_LA_UNE" : type;

    await onCreate({
      content: trimmed,
      type: finalType,
      startAt,
      endAt
    });

    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <div className="w-full max-w-2xl overflow-x-hidden">
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-800">
            Nouvelle publication
          </h2>
        </div>

        <form className="mt-4 grid grid-cols-1 gap-4" onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PostType)}
                disabled={isFeatured}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 mt-2 text-sm"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Mettre à la une
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Début">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 mt-2 text-sm"
                  required
                />
              </FormField>

              <FormField label="Fin (optionnel)">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 mt-2 text-sm"
                />
              </FormField>
            </div>
          </div>

          <FormField label="Contenu">
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Texte de la publication…"
            />
          </FormField>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Création…" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
