import type {
  AnyDraft,
  AssiduiteDraft,
  DocumentTemplateId,
  InscriptionDraft,
  PreinscriptionDraft,
  StudentDocRow,
} from "./documentTypes";

export function frDateLong(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export function frDateShort(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR");
}

export function civilite(gender: "M" | "F" | "X" | null) {
  if (gender === "F") return "Madame";
  if (gender === "M") return "Monsieur";
  return "Madame, Monsieur";
}

export function getSemester(draft: AnyDraft | null | undefined): 1 | 2 {
  const s = (draft as AssiduiteDraft | undefined)?.semester ?? 2;
  return s === 1 ? 1 : 2;
}

export function getStudentLevelForSemester(student: StudentDocRow, semester: 1 | 2) {
  return semester === 1 ? student.class_s1_code ?? "—" : student.class_s2_code ?? "—";
}

export function resolveLevel(student: StudentDocRow, draft: AssiduiteDraft) {
  const levelOverride = draft.levelOverride?.trim();
  if (levelOverride) return levelOverride;
  return getStudentLevelForSemester(student, getSemester(draft));
}

export function buildDefaultParagraphs(params: {
  template: DocumentTemplateId;
  student: StudentDocRow;
  seasonLabel: string;
  draft: AnyDraft;
}) {
  const { template, student, seasonLabel, draft } = params;
  const civ = civilite(student.gender);
  const lastName = student.last_name.toUpperCase();
  const firstName = student.first_name;
  const arrival = frDateLong(student.arrival_date);
  const departure = frDateLong(student.departure_date);

  if (template === "preinscription") {
    const d = draft as PreinscriptionDraft;
    const paragraphs = [
      `Je soussigné(e), déclare que ${civ} ${lastName} ${firstName} est pré-inscrit(e) au programme FLCE pour la saison ${seasonLabel}.`,
      `La période prévue est du ${arrival} au ${departure}.`,
    ];
    if (d.mention150 !== false) {
      paragraphs.push("Les frais de pré-inscription de 150€ ont été pris en compte pour cette demande.");
    }
    paragraphs.push("Cette attestation est délivrée pour servir et valoir ce que de droit.");
    return paragraphs;
  }

  if (template === "inscription") {
    const d = draft as InscriptionDraft;
    const paragraphs = [
      `Je soussigné(e), certifie que ${civ} ${lastName} ${firstName} est inscrit(e) au programme FLCE pour la saison ${seasonLabel}.`,
      `La période prévue est du ${arrival} au ${departure}.`,
    ];
    if (d.mentionPaidTotal !== false) {
      paragraphs.push("La totalité des frais d'inscription non remboursables a été réglée.");
    }
    paragraphs.push("Ce document est délivré pour servir et valoir ce que de droit.");
    return paragraphs;
  }

  const d = draft as AssiduiteDraft;
  const semester = getSemester(d);
  const level = resolveLevel(student, d);
  return [
    `Je soussigné(e), certifie que ${civ} ${lastName} ${firstName} suit les cours FLCE durant la saison ${seasonLabel}.`,
    `Niveau suivi (semestre ${semester}) : ${level}.`,
    "Ce certificat est délivré pour servir et valoir ce que de droit.",
  ];
}

export function buildFooterText(draft: AnyDraft) {
  const place = (draft.place ?? "Saint-Germain-en-Laye").toString();
  const generatedAt = (draft.generatedAt ?? new Date().toISOString().slice(0, 10)).toString();
  return `${place}, le ${frDateLong(generatedAt)}`;
}

export function paragraphsToBodyText(paragraphs: string[]) {
  return paragraphs.join("\n\n");
}

export function bodyTextToParagraphs(bodyText: string) {
  return bodyText
    .split(/\n\s*\n/g)
    .map((block) => block.replace(/\n+/g, " ").trim())
    .filter(Boolean);
}

export function resolveDocumentText(params: {
  template: DocumentTemplateId;
  student: StudentDocRow;
  seasonLabel: string;
  draft: AnyDraft;
}) {
  const { template, student, seasonLabel, draft } = params;
  const defaultParagraphs = buildDefaultParagraphs({ template, student, seasonLabel, draft });
  const bodyText = (draft.bodyText ?? "").toString();
  const paragraphs = bodyText.trim().length > 0 ? bodyTextToParagraphs(bodyText) : defaultParagraphs;

  const footerLine = (draft.footerText ?? "").toString().trim() || buildFooterText(draft);

  return {
    paragraphs,
    footerLine,
    defaultParagraphs,
  };
}
