import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { redirect } from "next/navigation";
import { getViewerServer } from "@/lib/auth/viewer.server";
import { getSeasonStateServer } from "@/lib/seasons/getSeasonState.server";
import { fetchStudentStatsRows, buildStudentStats } from "@/lib/students/stats.server";
import { StatsSummary } from "@/components/flce/stats/StatsComponents";
import StatsCharts from "@/components/flce/stats/StatsCharts.client";

export default async function FlceStats() {
  const { user } = await getViewerServer();
  if (!user) redirect("/login");

  const seasonState = await getSeasonStateServer();
  const seasonId = seasonState.selectedId ?? null;
  const rows = await fetchStudentStatsRows(seasonId);
  const seasonStart = seasonState.selected?.start_date ?? null;
  const seasonEnd = seasonState.selected?.end_date ?? null;
  const seasonDurationDays =
    seasonStart && seasonEnd
      ? Math.max(
          0,
          Math.ceil(
            (new Date(seasonEnd).getTime() - new Date(seasonStart).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;

  const stats = buildStudentStats(rows, seasonDurationDays);

  const avgStayLabel =
    stats.avgStayPercent !== null
      ? `${Math.round(stats.avgStayPercent)}%${
          stats.avgStayDays !== null ? ` (${Math.round(stats.avgStayDays)} j)` : ""
        }`
      : stats.avgStayDays !== null
      ? `${Math.round(stats.avgStayDays)} j`
      : "—";

  return (
    <PageShell>
      <PageHeader title="Statistiques" />

      {stats.totals.total === 0 ? (
        <p className="text-sm text-slate-500">Aucune donnée pour cette saison.</p>
      ) : (
        <div className="space-y-8">
          <StatsSummary totals={stats.totals} averageStay={avgStayLabel} />
          <StatsCharts data={stats} />
        </div>
      )}
    </PageShell>
  );
}
