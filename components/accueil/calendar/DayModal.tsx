"use client";

import type { Post } from "@/lib/posts/types";
import Modal from "@/components/ui/Modal";
import {
  getPostTypeBadgeClass,
  getPostTypeBorderClass,
} from "@/lib/posts/postTypeStyles";

export default function DayModal({
  day,
  posts,
  onClose,
  onSelectPost,
}: {
  day: Date;
  posts: Post[];
  onClose: () => void;
  onSelectPost: (post: Post) => void;
}) {
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-[var(--foreground)]">
          Évènements du{" "}
          {day.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
          })}
        </div>
      </div>
      <div className="space-y-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`cursor-pointer rounded-xl border border-l-4 border-white/70 bg-white/70 px-3 py-2 shadow-sm hover:bg-white/90 ${getPostTypeBorderClass(
              post.type
            )}`}
            onClick={() => {
              onSelectPost(post);
              onClose();
            }}
            role="button"
          >
            <div className="mb-1">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${getPostTypeBadgeClass(
                  post.type
                )}`}
              >
                {post.type}
              </span>
            </div>
            <div className="font-medium text-[var(--foreground)] line-clamp-1">
              {post.content || "Sans contenu"}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
