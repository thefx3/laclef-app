import type { AssiduiteDraft, DocumentTemplateId, InscriptionDraft, PreinscriptionDraft } from "./documentTypes";

export const TEMPLATE_LABEL: Record<DocumentTemplateId, string> = {
  preinscription: "Attestation de pré-inscription",
  inscription: "Fiche d'inscription",
  assiduite: "Certificat d'assiduité",
};

export function defaultDraft(template: DocumentTemplateId) {
  const today = new Date().toISOString().slice(0, 10);

  if (template === "preinscription") {
    const d: PreinscriptionDraft = {
      generatedAt: today,
      mention150: true,
      place: "Saint-Germain-en-Laye",
    };
    return d;
  }
  if (template === "inscription") {
    const d: InscriptionDraft = {
      generatedAt: today,
      mentionPaidTotal: true,
      place: "Saint-Germain-en-Laye",
    };
    return d;
  }
  const d: AssiduiteDraft = {
    generatedAt: today,
    semester: 2,
    place: "Saint-Germain-en-Laye",
  };
  return d;
}

export function isAssiduite(template: DocumentTemplateId) {
  return template === "assiduite";
}
