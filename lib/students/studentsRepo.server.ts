import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { StudentRow } from "./types";

export async function fetchStudentsBySeasonServer(seasonId: string | null) {
  const supabase = await createClient();

  let q = supabase
    .from("students")
    .select("*, au_pair_details(*)")
    .order("created_at", { ascending: false });

  if (seasonId) q = q.eq("season_id", seasonId);

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? []) as StudentRow[];
}
