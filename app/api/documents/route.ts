import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GenerateDocumentPayload, SeasonRow, StudentDocRow} from "@/lib/flce/documents/documentTypes";
import { renderFlceDocumentsPdf } from "@/lib/pdf/templates/flceDocuments";

export const runtime = "nodejs"; // important pour pdf-lib

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = (await req.json()) as GenerateDocumentPayload;

    if (!body?.template || !Array.isArray(body.studentIds) || body.studentIds.length === 0) {
      return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    // Students (from view to get class_s1_code / class_s2_code)
    const { data: students, error: sErr } = await supabase
      .from("students_with_classes")
      .select("id,first_name,last_name,gender,arrival_date,departure_date,season_id,class_s1_code,class_s2_code")
      .in("id", body.studentIds);

    if (sErr) throw sErr;

    const studentsRows = (students ?? []) as StudentDocRow[];

    // Seasons
    const seasonIds = Array.from(new Set(studentsRows.map((s) => s.season_id).filter(Boolean)));
    const { data: seasons, error: seErr } = await supabase
      .from("seasons")
      .select("id,code,start_date,end_date,is_current")
      .in("id", seasonIds);

    if (seErr) throw seErr;

    const seasonsById = new Map<string, SeasonRow>((seasons ?? []).map((s: any) => [s.id, s]));

    // Keep order as selectedIds (nice UX)
    const byId = new Map(studentsRows.map((s) => [s.id, s]));
    const orderedStudents = body.studentIds.map((id) => byId.get(id)).filter(Boolean) as StudentDocRow[];

    const pdfBytes = await renderFlceDocumentsPdf({
      template: body.template,
      draft: body.draft ?? {},
      students: orderedStudents as any,
      seasonsById,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="document_${body.template}.pdf"`,
      },
    });
  } catch (e) {
    const message = (e as Error)?.message ?? "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
