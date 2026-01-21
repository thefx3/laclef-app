"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/lib/posts/types";
import PostsFiltersBar from "./PostsFiltersBar";
import PostsList from "./PostsListClient";

import {
  filterPosts,
  uniqueAuthors,
  type FilterState,
} from "@/lib/posts/postsFilters";

import PostModal from "@/components/accueil/calendar/PostModal";
import PostEditModal from "@/components/accueil/calendar/PostEditModal";
import { deletePostApi, updatePostApi } from "@/lib/posts/postsApi.client";

export default function PostsArchiveClient({
  initialPosts,
  userId,
  userEmail,
}: {
  initialPosts: Post[];
  userId: string;
  userEmail: string | null;
}) {
  const [items, setItems] = useState<Post[]>(initialPosts);
  const [selected, setSelected] = useState<Post | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [filters, setFilters] = useState<FilterState>({
    scope: "ALL",
    secondary: "ALL",
    type: "ALL",
    author: "ALL",
    search: "",
  });

  const authors = useMemo(() => uniqueAuthors(items), [items]);

  const filtered = useMemo(() => {
    return filterPosts({
      posts: items,
      state: filters,
      userId,
      userEmail,
    });
  }, [items, filters, userId, userEmail]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const pagedPosts = filtered.slice(pageStart, pageEnd);

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [page, currentPage]);

  async function handleDelete(post: Post) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== post.id));
    setSelected(null);
    setEditing(null);

    try {
      await deletePostApi(post.id);
    } catch (e) {
      setItems(prev);
      alert((e as Error).message);
    }
  }

  async function handleSave(
    post: Post,
    input: {
      content: string;
      type: Post["type"];
      startAt: Date;
      endAt?: Date;
      authorName: string;
      authorEmail?: string;
    }
  ) {
    setSaving(true);
    try {
      const updated = await updatePostApi(post.id, input);
      setItems((cur) => cur.map((p) => (p.id === updated.id ? updated : p)));
      setEditing(null);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <PostsFiltersBar
          state={filters}
          authors={authors}
          onChange={(next: FilterState) => {
            setFilters(next);
            setPage(1);
          }}
        />
        <div className="mt-3 text-xs text-slate-500">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}.
        </div>
      </div>

      <PostsList posts={pagedPosts} onSelect={setSelected} />

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <div>
          Page {currentPage} / {totalPages}
          {filtered.length > 0 ? (
            <span className="ml-2 text-xs text-slate-500">
              ({pageStart + 1}-{Math.min(pageEnd, filtered.length)} sur {filtered.length})
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            Précédent
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Suivant
          </button>
        </div>
      </div>

      {selected && (
        <PostModal
          post={selected}
          onClose={() => setSelected(null)}
          onEdit={(p) => {
            setEditing(p);
            setSelected(null);
          }}
          onDelete={(p) => void handleDelete(p)}
        />
      )}

      {editing && (
        <PostEditModal
          post={editing}
          saving={saving}
          onCancel={() => setEditing(null)}
          onDelete={() => void handleDelete(editing)}
          onSave={(input) => void handleSave(editing, input)}
        />
      )}
    </div>
  );
}
