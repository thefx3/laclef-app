"use client";

import { useMemo, useState } from "react";
import type { Post } from "@/lib/posts/types";
import { startOfDay } from "@/lib/posts/calendarUtils";


import { FeaturedSidebar } from "./FeaturedSidebar";

import PostModal from "@/components/accueil/calendar/PostModal";

import { usePosts } from "@/lib/usePosts";
import { PostEditModal } from "@/components/accueil/posts/PostEditModal";

export default function FeaturedSidebarClient() {
  const { posts, loading, error, updatePost, deletePost } = usePosts();
  const [selected, setSelected] = useState<Post | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);

  const featured = useMemo(() => {
    return posts.filter((post) => {
      if (post.type !== "A_LA_UNE") return false;
      const start = startOfDay(post.startAt);
      const end = startOfDay(post.endAt ?? post.startAt);
      return start <= today && end >= today;
    });
  }, [posts, today]);

  return (
    <div className="w-64 shrink-0">
      {loading && <p className="p-3 text-sm text-gray-500">Chargement...</p>}
      {error && <p className="p-3 text-sm text-red-600">Erreur: {error}</p>}

      <FeaturedSidebar posts={featured} onSelect={setSelected} />

      {selected && (
        <PostModal
          post={selected}
          onClose={() => setSelected(null)}
          onEdit={(post) => {
            setEditing(post);
            setSelected(null);
          }}
          onDelete={(post) => {
            void deletePost(post);
            setSelected(null);
          }}
        />
      )}

      {editing && (
        <PostEditModal
          key={editing.id}
          post={editing}
          onSave={(updated) => {
            void updatePost(updated);
            setEditing(null);
          }}
          onDelete={(post) => {
            void deletePost(post);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
