"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV, type AppKey } from "@/lib/apps";

const APP_ROUTES = ["accueil", "flce", "musique", "activites"] as const;

function getAppKeyFromPath(pathname: string | null): AppKey {
  const seg = (pathname ?? "/").split("/")[1];
  if (seg === "accueil" || seg === "flce" || seg === "musique" || seg === "activites") return seg;
  return "accueil";
}

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const firstSeg = (pathname ?? "/").split("/")[1];
  const isAppRoute = APP_ROUTES.includes(firstSeg as (typeof APP_ROUTES)[number]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!isAppRoute) return null;

  const appKey = getAppKeyFromPath(pathname);
  const links = APP_NAV[appKey];

  const navLinkClass =
    "group inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide text-slate-700 transition hover:bg-slate-900/5 hover:text-slate-900";
  const navLinkActiveClass =
    "bg-slate-900 text-white shadow-sm hover:bg-slate-900 hover:text-black";

  return (
    <>
      <button
        type="button"
        className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:bg-white"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav"
      >
        <span className="sr-only">Menu</span>
        <span className="flex flex-col gap-1">
          <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
          <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
          <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
        </span>
      </button>

      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          id="mobile-nav"
          className={`relative h-full w-72 max-w-[80vw] bg-white shadow-xl transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
              Navigation
            </span>
            <button
              type="button"
              className="text-sm font-semibold text-slate-600 hover:underline"
              onClick={() => setOpen(false)}
            >
              Fermer
            </button>
          </div>
          <nav className="flex flex-col gap-2 px-4 py-4">
            {links.map((link) => {
              const isBaseRoute = links.some(
                (other) => other.href !== link.href && other.href.startsWith(`${link.href}/`)
              );
              const isActive = isBaseRoute
                ? pathname === link.href
                : (pathname?.startsWith(link.href) ?? false);
              const Icon = link.Icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
