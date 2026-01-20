// components/accueil/FeaturedSidebar.tsx
import { fetchPostsServer } from "@/lib/posts/postsRepo.server";
import { startOfDay } from "@/lib/posts/calendarUtils";
import { FeaturedSidebarClient } from "./FeaturedSidebarClient";

export default async function FeaturedSidebar() {
  const posts = await fetchPostsServer();

  const today = startOfDay(new Date());

  const featured = posts.filter((post) => {
    if (post.type !== "A_LA_UNE") return false;

    const start = startOfDay(post.startAt);
    const end = startOfDay(post.endAt ?? post.startAt);

    return start <= today && end >= today;
  });

  return <FeaturedSidebarClient posts={featured} />;
}
