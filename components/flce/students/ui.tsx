"use client";
import { memo } from "react";
import { cn } from "@/lib/posts/cn";

function TabButtonBase({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={cn("btn-filter", active ? "btn-filter--active" : "btn-filter--inactive")}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export const TabButton = memo(TabButtonBase);
TabButton.displayName = "TabButton";
