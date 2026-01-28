export type DocumentTemplateId = "preinscription" | "inscription" | "assiduite";
export type Semester = 1 | 2;

export type StudentDocRow = {
  id: string;
  first_name: string;
  last_name: string;
  gender: "M" | "F" | "X" | null;
  arrival_date: string | null;    // ISO date
  departure_date: string | null;  // ISO date
  season_id: string | null;

  // si tu utilises ta view students_with_classes:
  class_s1_code?: string | null;
  class_s2_code?: string | null;
};

export type SeasonRow = {
  id: string;
  code: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
};

export type DocumentDraftCommon = {
  place?: string;           // ex: "Saint-Germain-en-Laye"
  generatedAt?: string;     // ISO date string (yyyy-mm-dd)
  bodyText?: string;        // texte complet (paragraphes séparés par lignes vides)
  footerText?: string;      // override du footer
};

export type PreinscriptionDraft = DocumentDraftCommon & {
  mention150?: boolean;     // true par défaut
};

export type InscriptionDraft = DocumentDraftCommon & {
  mentionPaidTotal?: boolean; // true par défaut
};

export type AssiduiteDraft = DocumentDraftCommon & {
  semester: Semester;       // défaut 2
  levelOverride?: string;   // optionnel : si tu veux forcer le niveau affiché
};

export type AnyDraft = PreinscriptionDraft | InscriptionDraft | AssiduiteDraft;

export type GenerateDocumentPayload = {
  template: DocumentTemplateId;
  studentIds: string[];
  draft: AnyDraft;
};
