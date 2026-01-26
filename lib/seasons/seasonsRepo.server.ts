import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type SeasonRow = {
  id: string;
  code: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
};

export const fetchSeasonsServer = cache(async (): Promise<SeasonRow[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seasons")
    .select("id,code,start_date,end_date,is_current,created_at")
    .order("start_date", { ascending: false });

  if (error) throw error;

  return (data ?? []) as SeasonRow[];
});
