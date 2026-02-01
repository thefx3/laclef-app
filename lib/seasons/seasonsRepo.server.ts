import "server-only";

import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { SeasonRow } from "@/lib/seasons/types";

export type { SeasonRow } from "@/lib/seasons/types";

const SEASONS_REVALIDATE_SECONDS = 120;

export const fetchSeasonsServer = unstable_cache(
  async (): Promise<SeasonRow[]> => {
    const { data, error } = await supabaseAdmin
      .from("seasons")
      .select("id,code,start_date,end_date,is_current,created_at")
      .order("start_date", { ascending: false });

    if (error) throw error;

    return (data ?? []) as SeasonRow[];
  },
  ["seasons"],
  { revalidate: SEASONS_REVALIDATE_SECONDS, tags: ["seasons"] }
);
