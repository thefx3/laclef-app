import type { ReactNode } from "react";

export default function ActivitesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full p-4">
        {children}
    </div>
  );
}