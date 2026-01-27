export type StatColorDatum = {
  name: string;
  value: number;
  color: string;
};

export type StatLabelDatum = {
  label: string;
  value: number;
};

export type StatsTotals = {
  total: number;
  enrolled: number;
  pre: number;
  lead: number;
  left: number;
};

export type StatsDashboardData = {
  totals: StatsTotals;
  avgStayDays: number | null;
  avgStayPercent: number | null;
  statusData: StatColorDatum[];
  genderData: StatColorDatum[];
  auPairData: StatColorDatum[];
  enrolledPreRegData: StatColorDatum[];
  classData: StatLabelDatum[];
  birthPlaceData: StatLabelDatum[];
  ageBuckets: StatLabelDatum[];
  arrivals: { month: string; value: number }[];
};
