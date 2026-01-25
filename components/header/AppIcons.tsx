"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APPS } from "@/lib/apps";

export default function AppIcons() {
  const pathname = usePathname();
  const firstSeg = (pathname ?? "/").split("/")[1];

  const iconBaseClass =
    "h-9 w-9 rounded-lg border p-2 shadow-sm transition hover:-translate-y-0.5";
  const iconInactiveClass =
    "border-white/70 bg-white/70 text-slate-700 hover:bg-white hover:text-slate-900";
  const iconActiveClass = "border-black/80 bg-black";

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {APPS.map(({ href, label, Icon, colorClass }) => {
        const key = href.replace("/", "");
        const isActive = key === firstSeg;
        const iconStateClass = isActive
          ? `${iconActiveClass} ${colorClass}`
          : iconInactiveClass;

        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            title={label}
            className="inline-flex"
          >
            <Icon
              className={`${iconBaseClass} ${iconStateClass}`}
              size={30}
              aria-current={isActive ? "page" : undefined}
            />
          </Link>
        );
      })}
    </nav>
  );
}
