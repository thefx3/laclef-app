"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SeasonRow } from "@/lib/seasons/seasonsRepo.server";

export default function SeasonSwitcher({
  seasons,
  selectedId,
}: {
  seasons: SeasonRow[];
  selectedId: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  async function selectSeason(seasonId: string) {
    await fetch("/api/seasons/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seasonId }),
    });

    // Optionnel: si tu veux enlever ?season=... après sélection
    // (on garde l’app “clean”)
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("season");
    const next = sp.toString();
    startTransition(() => {
      router.replace(next ? `?${next}` : `?`);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-md tracking-widest uppercase font-semibold text-slate-500">Saison</span>

      <select
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
        value={selectedId ?? ""}
        disabled={pending || seasons.length === 0}
        onChange={(e) => void selectSeason(e.target.value)}
      >
        {seasons.map((s) => (
          <option key={s.id} value={s.id}>
            {s.code}{s.is_current ? " (actuelle)" : ""}
          </option>
        ))}
      </select>

      {pending ? <span className="text-xs text-slate-500">…</span> : null}
    </div>
  );
}
