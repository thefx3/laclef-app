import type { ReactNode } from "react";

export default async function FLCELayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
        {children}
    </div>
  );
}
