import { redirect } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import { createClient } from "@/lib/supabase/server";
import DocumentsClient from "@/components/flce/documents/DocumentsClient";
import { fetchStudentsForDocsServer } from "@/lib/flce/studentsRepo.server";
import { fetchSeasonsServer } from "@/lib/seasons/seasonsRepo.server";

export default async function FlceDocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const seasons = await fetchSeasonsServer();
  const currentSeason = seasons.find((s) => s.is_current) ?? seasons[0] ?? null;

  const students = await fetchStudentsForDocsServer(currentSeason?.id ?? null);

  return (
    <PageShell>
      <PageHeader title="Documents FLCE" />
      <DocumentsClient
        initialStudents={students}
        seasons={seasons}
        defaultSeasonId={currentSeason?.id ?? null}
      />
    </PageShell>
  );
}
