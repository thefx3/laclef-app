// components/accueil/FeaturedSidebarClient.tsx
"use client";

import { useMemo, useState } from "react";
import type { Post } from "@/lib/posts/types";
import { sortByCreatedDesc, formatRemainingDays } from "@/lib/posts/calendarUtils";
import PostModal from "@/components/accueil/calendar/PostModal";

type Props = {
  posts: Post[];
};

export function FeaturedSidebarClient({ posts }: Props) {
  const [selected, setSelected] = useState<Post | null>(null);

  const sorted = useMemo(() => sortByCreatedDesc(posts ?? []), [posts]);

  return (
    <aside className="flex w-full flex-col rounded-sm border bg-white shadow-sm lg:w-64 h-[fit-content]">
      <div className="bg-black py-4 text-center text-xl font-bold uppercase tracking-[0.25em] text-white">
        A la une
      </div>

      <div className="flex flex-1 flex-col">
        {sorted.length === 0 ? (
          <p className="flex flex-1 items-center justify-center text-center text-sm text-gray-500 p-4">
            Rien pour le moment
          </p>
        ) : (
          <ul className="space-y-3 p-3">
            {sorted.map((post) => (
              <li
                key={post.id}
                className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-colors hover:bg-gray-100"
                onClick={() => setSelected(post)}
              >
                <div className="font-semibold text-gray-900 leading-snug line-clamp-2">
                  {post.content || "Sans contenu"}
                </div>

                <div className="text-xs text-gray-600">
                  {formatRemainingDays(post.startAt, post.endAt)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <PostModal
          post={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </aside>
  );
}
