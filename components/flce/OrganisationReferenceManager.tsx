import { redirect } from "next/navigation";
import { getViewerServer } from "@/lib/auth/viewer.server";
import { fetchSeasonsServer } from "@/lib/seasons/seasonsRepo.server";
import {
  fetchClassOfferingsServer,
  fetchLevelsServer,
  fetchTeachersServer,
  fetchTimeSlotsServer,
} from "@/lib/flce/referenceRepo.server";
import OrganisationReferenceClient from "@/components/flce/OrganisationReferenceClient";

export default async function OrganisationReferenceManager() {
  const { user, role } = await getViewerServer();
  if (!user) redirect("/login");

  const [seasons, teachers, levels, timeSlots, classOfferings] = await Promise.all([
    fetchSeasonsServer(),
    fetchTeachersServer(),
    fetchLevelsServer(),
    fetchTimeSlotsServer(),
    fetchClassOfferingsServer(),
  ]);

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  return (
    <OrganisationReferenceClient
      seasons={seasons}
      teachers={teachers}
      levels={levels}
      timeSlots={timeSlots}
      classOfferings={classOfferings}
      isAdmin={isAdmin}
    />
  );
}
