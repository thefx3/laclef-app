import type { StatsTotals } from "@/lib/students/statsTypes";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function StatsSummary({
  totals,
  averageStay,
}: {
  totals: StatsTotals;
  averageStay: string;
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard label="Total élèves" value={totals.total} />
      <StatCard label="Inscrits" value={totals.enrolled} />
      <StatCard label="Pré-inscrits" value={totals.pre} />
      <StatCard label="Leads" value={totals.lead} />
      <StatCard label="Sortis" value={totals.left} />
      <StatCard label="Durée moyenne séjour" value={averageStay} />
    </section>
  );
}
