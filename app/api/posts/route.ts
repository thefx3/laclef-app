import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PostType } from "@/lib/posts/types";
import { rowToPost } from "@/lib/posts/mapper";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  const content = String(body?.content ?? "").trim();
  const type = String(body?.type ?? "") as PostType;
  const startAt = String(body?.startAt ?? "");
  const endAt = body?.endAt ? String(body.endAt) : null;

  if (!content || !type || !startAt) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("first_name")
    .eq("user_id", user.id)
    .single();

  const defaultName =
    profile?.first_name || user.email?.split("@")[0] || "Unknown";

  const payload = {
    content,
    type,
    start_at: startAt,
    end_at: endAt,
    author_name: body?.authorName ? String(body.authorName).trim() : defaultName,
    author_email: user.email ?? null,
    author_id: user.id,
  };

  const { data, error } = await supabase
    .from("posts")
    .insert(payload)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Insert failed" }, { status: 400 });
  }

  return NextResponse.json({ post: rowToPost(data) }, { status: 201 });
}
