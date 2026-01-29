import { getSeasonStateServer } from "@/lib/seasons/getSeasonState.server";
import SeasonSwitcher from "@/components/flce/SeasonSwitcher";

export default async function FlceLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams?: { season?: string };
}) {
  const { seasons, selected, selectedId } = await getSeasonStateServer({
    searchSeasonId: searchParams?.season ?? null,
  });

  return (
    <div className="space-y-4">
      <div className="absolute right-10 top-24 z-20 w-max">
        <SeasonSwitcher seasons={seasons} selectedId={selectedId} />
      </div>
        {/* Saison active : <span className="font-semibold">{selected?.code ?? "—"}</span> */}


      {children}
    </div>
  );
}
