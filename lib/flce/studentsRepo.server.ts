import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { StudentRow } from "@/lib/students/types";

export async function fetchStudentsServer(params?: { seasonId?: string | null }) {
  const supabase = await createClient();
  const seasonId = params?.seasonId ?? null;

  let query = supabase
    .from("students_with_classes")
    .select("*")
    .order("created_at", { ascending: false });

  if (seasonId) query = query.eq("season_id", seasonId);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []) as StudentRow[];
}
