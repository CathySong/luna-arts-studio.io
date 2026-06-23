"use client";

import { useState } from "react";

type Month = { key: string; label: string; revenue: number; lessons: number };
type Source = { value: string; label: string; count: number };
type NewStudent = { key: string; label: string; count: number };

type Props = {
  totals: {
    monthRevenue: number;
    monthLessons: number;
    yearRevenue: number;
    allRevenue: number;
    allLessons: number;
    totalPaymentsIn: number;
  };
  months: Month[];
  sources: Source[];
  newStudents: NewStudent[];
  currentMonthKey: string;
};

const SOURCE_COLORS: Record<string, string> = {
  referral: "#c98a6b",
  instagram: "#7b6ef6",
  wechat: "#5dba72",
  xiaohongshu: "#e85d75",
  google: "#4a90e2",
  walkin: "#e8a445",
  summer_camp: "#8b5cf6",
  other: "#999999",
  unspecified: "#cccccc",
};

function Money({ n }: { n: number }) {
  return <span>${n.toFixed(2)}</span>;
}

function Bar({ pct, color, height = 6 }: { pct: number; color: string; height?: number }) {
  const safe = Math.min(100, Math.max(0, pct));
  return (
    <div className="h-full bg-gray-lightest rounded overflow-hidden" style={{ height }}>
      <div className="h-full transition-all" style={{ width: `${safe}%`, background: color }} />
    </div>
  );
}

export default function AnalyticsView({ totals, months, sources, newStudents, currentMonthKey }: Props) {
  const [tab, setTab] = useState<"revenue" | "lessons" | "students">("revenue");

  const maxRevenue = Math.max(1, ...months.map((m) => m.revenue));
  const maxLessons = Math.max(1, ...months.map((m) => m.lessons));
  const maxNew = Math.max(1, ...newStudents.map((m) => m.count));
  const totalSources = sources.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-8">
      {/* Top stats row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="This month"
          primary={<Money n={totals.monthRevenue} />}
          sub={`${totals.monthLessons} lessons`}
          highlight
        />
        <StatCard
          label="This year"
          primary={<Money n={totals.yearRevenue} />}
          sub={`across all months`}
        />
        <StatCard
          label="All-time revenue"
          primary={<Money n={totals.allRevenue} />}
          sub={`${totals.allLessons} lessons logged`}
        />
        <StatCard
          label="Total payments"
          primary={<Money n={totals.totalPaymentsIn} />}
          sub={`${sources.length > 0 ? sources[0].label : "—"} = top source`}
        />
      </div>

      {/* Monthly trend */}
      <div className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <div className="font-display text-xl text-gray-darkest">Monthly trend</div>
            <p className="text-xs text-gray-darker mt-1">Last 12 months</p>
          </div>
          <div className="flex gap-1 rounded-md border border-gray-lighter p-1 text-xs">
            {(["revenue", "lessons", "students"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded px-3 py-1.5 transition-colors ${
                  tab === t
                    ? "bg-accent-warm text-gray-darkest font-medium"
                    : "text-gray-darker hover:text-gray-darkest"
                }`}
              >
                {t === "revenue" ? "Revenue" : t === "lessons" ? "Lessons" : "New students"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {tab === "revenue" &&
            months.map((m) => (
              <div key={m.key} className="grid grid-cols-[60px_1fr_80px] items-center gap-3">
                <div className={`text-xs ${m.key === currentMonthKey ? "text-accent-warm font-semibold" : "text-gray-darker"}`}>
                  {m.label}
                </div>
                <Bar pct={(m.revenue / maxRevenue) * 100} color="#c98a6b" />
                <div className="text-right text-xs font-medium text-gray-darkest tabular-nums">
                  <Money n={m.revenue} />
                </div>
              </div>
            ))}

          {tab === "lessons" &&
            months.map((m) => (
              <div key={m.key} className="grid grid-cols-[60px_1fr_80px] items-center gap-3">
                <div className={`text-xs ${m.key === currentMonthKey ? "text-accent-warm font-semibold" : "text-gray-darker"}`}>
                  {m.label}
                </div>
                <Bar pct={(m.lessons / maxLessons) * 100} color="#7b6ef6" />
                <div className="text-right text-xs font-medium text-gray-darkest tabular-nums">
                  {m.lessons}
                </div>
              </div>
            ))}

          {tab === "students" &&
            newStudents.map((m) => (
              <div key={m.key} className="grid grid-cols-[60px_1fr_80px] items-center gap-3">
                <div className={`text-xs ${m.key === currentMonthKey ? "text-accent-warm font-semibold" : "text-gray-darker"}`}>
                  {m.label}
                </div>
                <Bar pct={(m.count / maxNew) * 100} color="#5dba72" />
                <div className="text-right text-xs font-medium text-gray-darkest tabular-nums">
                  {m.count}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Source breakdown */}
      <div className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow">
        <div className="font-display text-xl text-gray-darkest mb-1">Lead sources</div>
        <p className="text-xs text-gray-darker mb-6">Where your students come from ({totalSources} students)</p>

        {totalSources === 0 ? (
          <div className="text-sm text-gray-dark text-center py-6">No students yet.</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px] items-center">
            <div className="space-y-3">
              {sources.map((s) => {
                const pct = totalSources > 0 ? (s.count / totalSources) * 100 : 0;
                const color = SOURCE_COLORS[s.value] ?? "#999";
                return (
                  <div key={s.value} className="grid grid-cols-[140px_1fr_60px] items-center gap-3">
                    <div className="text-xs text-gray-darkest flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-sm" style={{ background: color }} />
                      {s.label}
                    </div>
                    <Bar pct={pct} color={color} />
                    <div className="text-right text-xs font-medium text-gray-darkest tabular-nums">
                      {s.count} <span className="text-gray-dark">({pct.toFixed(0)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pie chart (simple SVG) */}
            <div className="flex justify-center">
              <PieChart
                data={sources.map((s) => ({
                  label: s.label,
                  value: s.count,
                  color: SOURCE_COLORS[s.value] ?? "#999",
                }))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  primary,
  sub,
  highlight,
}: {
  label: string;
  primary: React.ReactNode;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 card-shadow ${
        highlight
          ? "border-accent-warm/40 bg-accent-warm/5"
          : "border-gray-lighter bg-white"
      }`}
    >
      <div className="text-xs uppercase tracking-ultra text-gray-dark">{label}</div>
      <div className={`mt-2 font-display text-3xl ${highlight ? "text-accent-warm" : "text-gray-darkest"}`}>
        {primary}
      </div>
      {sub ? <div className="mt-1 text-xs text-gray-darker">{sub}</div> : null}
    </div>
  );
}

function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;
  const radius = 80;
  const inner = 45;
  const cx = 100;
  const cy = 100;
  let cumulative = 0;
  const slices = data.map((d, i) => {
    const start = cumulative / total;
    cumulative += d.value;
    const end = cumulative / total;
    return { ...d, start, end, idx: i };
  });
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" aria-label="Source breakdown pie">
      {slices.map((s) => {
        const startAngle = s.start * Math.PI * 2 - Math.PI / 2;
        const endAngle = s.end * Math.PI * 2 - Math.PI / 2;
        const large = s.end - s.start > 0.5 ? 1 : 0;
        const x1 = cx + Math.cos(startAngle) * radius;
        const y1 = cy + Math.sin(startAngle) * radius;
        const x2 = cx + Math.cos(endAngle) * radius;
        const y2 = cy + Math.sin(endAngle) * radius;
        const ix1 = cx + Math.cos(endAngle) * inner;
        const iy1 = cy + Math.sin(endAngle) * inner;
        const ix2 = cx + Math.cos(startAngle) * inner;
        const iy2 = cy + Math.sin(startAngle) * inner;
        const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${inner} ${inner} 0 ${large} 0 ${ix2} ${iy2} Z`;
        return <path key={s.idx} d={path} fill={s.color} />;
      })}
    </svg>
  );
}
