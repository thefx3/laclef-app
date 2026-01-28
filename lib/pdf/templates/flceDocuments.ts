import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { DocumentTemplateId, SeasonRow, StudentDocRow } from "@/lib/flce/documents/documentTypes";
import { resolveDocumentText } from "@/lib/flce/documents/text";

type RenderInput = {
  template: DocumentTemplateId;
  draft: any;
  students: StudentDocRow[];
  seasonsById: Map<string, SeasonRow>;
};

function drawFooter(page: any, font: any, footerLine: string) {
  page.drawLine({ start: { x: 50, y: 70 }, end: { x: 545, y: 70 }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });
  page.drawText(footerLine, { x: 50, y: 50, size: 10, font });
}

function drawBodyParagraphs(page: any, font: any, paragraphs: string[], startY = 720) {
  let y = startY;
  for (const p of paragraphs) {
    const lines = wrapText(p, 90);
    for (const line of lines) {
      page.drawText(line, { x: 50, y, size: 11, font });
      y -= 16;
    }
    y -= 10;
  }
}

function wrapText(text: string, maxLen: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxLen) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderFlceDocumentsPdf(input: RenderInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  for (const student of input.students) {
    const season = student.season_id ? input.seasonsById.get(student.season_id) ?? null : null;
    const seasonLabel = season?.code ?? "—";

    const page = pdf.addPage([595.28, 841.89]); // A4
    const resolved = resolveDocumentText({
      template: input.template,
      student,
      seasonLabel,
      draft: input.draft,
    });

    drawBodyParagraphs(page, font, resolved.paragraphs, 780);
    drawFooter(page, font, resolved.footerLine);
  }

  return await pdf.save();
}
