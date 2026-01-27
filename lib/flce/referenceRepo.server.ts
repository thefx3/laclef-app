import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ClassOfferingRow, LevelRow, TeacherRow, TimeSlotRow } from "@/lib/flce/referenceTypes";

export async function fetchTeachersServer(): Promise<TeacherRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teachers")
    .select("id,full_name,code,email,created_at")
    .order("full_name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TeacherRow[];
}

export async function fetchLevelsServer(): Promise<LevelRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("levels")
    .select("id,code,label,is_active,created_at")
    .order("code", { ascending: true });
  if (error) throw error;
  return (data ?? []) as LevelRow[];
}

export async function fetchTimeSlotsServer(): Promise<TimeSlotRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("time_slots")
    .select("id,label,start_time,end_time,created_at")
    .order("label", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TimeSlotRow[];
}

export async function fetchClassOfferingsServer(params?: {
  seasonId?: string | null;
}): Promise<ClassOfferingRow[]> {
  const supabase = await createClient();
  const seasonId = params?.seasonId ?? null;

  let query = supabase
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
}
