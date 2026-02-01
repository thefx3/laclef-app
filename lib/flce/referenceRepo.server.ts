import "server-only";

import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ClassOfferingRow, LevelRow, TeacherRow, TimeSlotRow } from "@/lib/flce/referenceTypes";

const REFERENCE_REVALIDATE_SECONDS = 120;

const fetchTeachersCached = unstable_cache(
  async (): Promise<TeacherRow[]> => {
    const { data, error } = await supabaseAdmin
      .from("teachers")
      .select("id,full_name,code,email,created_at")
      .order("full_name", { ascending: true });
    if (error) throw error;
    return (data ?? []) as TeacherRow[];
  },
  ["flce-reference", "teachers"],
  { revalidate: REFERENCE_REVALIDATE_SECONDS, tags: ["flce-reference"] }
);

export async function fetchTeachersServer(): Promise<TeacherRow[]> {
  return fetchTeachersCached();
}

const fetchLevelsCached = unstable_cache(
  async (): Promise<LevelRow[]> => {
    const { data, error } = await supabaseAdmin
      .from("levels")
      .select("id,code,label,is_active,created_at")
      .order("code", { ascending: true });
    if (error) throw error;
    return (data ?? []) as LevelRow[];
  },
  ["flce-reference", "levels"],
  { revalidate: REFERENCE_REVALIDATE_SECONDS, tags: ["flce-reference"] }
);

export async function fetchLevelsServer(): Promise<LevelRow[]> {
  return fetchLevelsCached();
}

const fetchTimeSlotsCached = unstable_cache(
  async (): Promise<TimeSlotRow[]> => {
    const { data, error } = await supabaseAdmin
      .from("time_slots")
      .select("id,label,start_time,end_time,created_at")
      .order("label", { ascending: true });
    if (error) throw error;
    return (data ?? []) as TimeSlotRow[];
  },
  ["flce-reference", "time-slots"],
  { revalidate: REFERENCE_REVALIDATE_SECONDS, tags: ["flce-reference"] }
);

export async function fetchTimeSlotsServer(): Promise<TimeSlotRow[]> {
  return fetchTimeSlotsCached();
}

const fetchClassOfferingsCached = unstable_cache(
  async (seasonId: string | null): Promise<ClassOfferingRow[]> => {
    let query = supabaseAdmin
      .from("class_offerings")
      .select(
        "id,season_id,semester,day_of_week,teacher_id,level_id,time_slot_id,code,is_active,created_at"
      )
      .order("semester", { ascending: true })
      .order("code", { ascending: true });

    if (seasonId) query = query.eq("season_id", seasonId);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as ClassOfferingRow[];
  },
  ["flce-reference", "class-offerings"],
  { revalidate: REFERENCE_REVALIDATE_SECONDS, tags: ["flce-reference"] }
);

export async function fetchClassOfferingsServer(params?: {
  seasonId?: string | null;
}): Promise<ClassOfferingRow[]> {
  const seasonId = params?.seasonId ?? null;
  return fetchClassOfferingsCached(seasonId);
}
