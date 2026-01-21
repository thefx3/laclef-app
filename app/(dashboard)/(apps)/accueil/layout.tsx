import FeaturedSidebar from "@/components/accueil/FeaturedSidebar";
import type { ReactNode } from "react";

export default function AccueilLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_16rem] flex-1 min-w-0">
      <div className="w-full min-w-0">
        {children}
      </div>
      <div className="w-full lg:w-[16rem] shrink-0 lg:sticky lg:top-6">
         <FeaturedSidebar />
      </div>
    </div>
  );
}
