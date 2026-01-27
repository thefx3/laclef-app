"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/posts/cn";

const tabs = [
  { href: "/settings/seasons", label: "Saisons" },
  { href: "/settings/rooms", label: "Salles" },
];

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 mb-4 w-fit rounded-md bg-[var(--grey)] p-1 inset-shadow-md">
      {tabs.map((tab) => {
        const isActive = pathname?.startsWith(tab.href) ?? false;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn("btn-tab", isActive ?  "btn-tab--active shadow-sm" : "btn-tab--inactive")}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
