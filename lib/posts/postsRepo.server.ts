// lib/posts/postsRepo.server.ts
import { createClient } from "@/lib/supabase/server";
import type { Post, PostType } from "@/lib/types";

export type PostRow = {
  id: string;
  content: string;
  type: PostType;
  start_at: string;
  end_at: string | null;
  author_name: string;
  author_email: string | null;
  created_at: string;
  updated_at: string;
};

function splitContent(content: string) {
  const parts = content.split("\n\n");
  const title = parts[0] ?? "";
  const description = parts.length > 1 ? parts.slice(1).join("\n\n") : undefined;
  return { title, description };
}

export function rowToPost(row: PostRow): Post {
  const { title, description } = splitContent(row.content);
  return {
    id: row.id,
    title,
    description,
    type: row.type,
    startAt: new Date(row.start_at),
    endAt: row.end_at ? new Date(row.end_at) : undefined,
    authorName: row.author_name,
    authorEmail: row.author_email ?? "",
    createdAt: new Date(row.created_at),
    lastEditedAt: new Date(row.updated_at),
  };
}

export async function fetchPostsServer(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as PostRow[]).map(rowToPost);
}
