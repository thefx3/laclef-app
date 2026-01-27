import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import { redirect } from "next/navigation";

import StudentsClient from "@/components/flce/students/StudentsClient";
import { getViewerServer } from "@/lib/auth/viewer.server";
import { getSeasonStateServer } from "@/lib/seasons/getSeasonState.server";
import { fetchStudentsServer } from "@/lib/flce/studentsRepo.server";
import {
  fetchClassOfferingsServer,
  fetchLevelsServer,
  fetchTeachersServer,
  fetchTimeSlotsServer,
} from "@/lib/flce/referenceRepo.server";

export default async function FlceStudentsPage() {
  const { user } = await getViewerServer();
  if (!user) redirect("/login");

  const seasonState = await getSeasonStateServer();
  const seasonId = seasonState.selectedId ?? null;

  const [students, teachers, levels, timeSlots, classOfferings] = await Promise.all([
    fetchStudentsServer({ seasonId }),
    fetchTeachersServer(),
    fetchLevelsServer(),
    fetchTimeSlotsServer(),
    fetchClassOfferingsServer({ seasonId }),
  ]);

  return (
    <PageShell>
      <PageHeader title="Élèves FLCE" />
      <StudentsClient
        initialStudents={students}
        selectedSeasonId={seasonId}
        seasons={seasonState.seasons}
        referenceData={{
          teachers,
          levels,
          timeSlots,
          classOfferings,
        }}
      />
    </PageShell>
  );
}
