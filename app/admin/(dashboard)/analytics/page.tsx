import Link from "next/link";

import { listAllAttendances, listAllPayments, listStudents } from "@/lib/crm/db";
import { LEAD_SOURCES } from "@/lib/crm/types";

import AnalyticsView from "@/components/crm/AnalyticsView";

function startOfMonth(d: Date): string {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString().slice(0, 10);
}

function startOfYear(d: Date): string {
  return new Date(Date.UTC(d.getUTCFullYear(), 0, 1)).toISOString().slice(0, 10);
}

export default async function AdminAnalyticsPage() {
  const [attendances, payments, students] = await Promise.all([
    listAllAttendances(),
    listAllPayments(),
    listStudents(),
  ]);

  // Build a studentId → student lookup so we can resolve default prices.
  const studentMap = new Map(students.map((s) => [s.id, s]));

  // Effective price for any attendance: override > student.defaultPrice > 0
  function priceFor(att: { studentId: string; priceOverride?: number; lessonsUsed: number }): number {
    if (typeof att.priceOverride === "number") return att.priceOverride;
    const s = studentMap.get(att.studentId);
    return s?.defaultPrice ?? 0;
  }

  // Monthly revenue & lessons for the last 12 months.
  const months: { key: string; label: string; revenue: number; lessons: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });
    months.push({ key, label, revenue: 0, lessons: 0 });
  }

  for (const a of attendances) {
    const key = a.date.slice(0, 7);
    const m = months.find((x) => x.key === key);
    if (!m) continue;
    m.revenue += priceFor(a) * (a.lessonsUsed ?? 1);
    m.lessons += a.lessonsUsed ?? 1;
  }

  // Totals: this month + year + all-time
  const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const yearKey = String(now.getUTCFullYear());
  const monthRow = months.find((m) => m.key === monthKey);
  const monthRevenue = monthRow?.revenue ?? 0;
  const monthLessons = monthRow?.lessons ?? 0;
  const yearRevenue = months
    .filter((m) => m.key.startsWith(yearKey))
    .reduce((sum, m) => sum + m.revenue, 0);
  const allRevenue = attendances.reduce((sum, a) => sum + priceFor(a) * (a.lessonsUsed ?? 1), 0);
  const allLessons = attendances.reduce((sum, a) => sum + (a.lessonsUsed ?? 1), 0);
  const totalPaymentsIn = payments.reduce((sum, p) => sum + p.amount, 0);

  // Source breakdown
  const sourceCounts: Record<string, number> = {};
  for (const s of students) {
    if (s.source) sourceCounts[s.source] = (sourceCounts[s.source] ?? 0) + 1;
  }
  const sourceRows: { value: string; label: string; count: number }[] = LEAD_SOURCES.map((src) => ({
    value: src.value,
    label: src.label,
    count: sourceCounts[src.value] ?? 0,
  })).filter((r) => r.count > 0);
  const otherCount = sourceRows.reduce((sum, r) => sum + r.count, 0);
  sourceRows.push({
    value: "unspecified",
    label: "未填",
    count: Math.max(0, students.length - otherCount),
  });
  sourceRows.sort((a, b) => b.count - a.count);

  // New students per month
  const newStudentsByMonth = new Map<string, number>();
  for (const s of students) {
    const m = s.createdAt.slice(0, 7);
    newStudentsByMonth.set(m, (newStudentsByMonth.get(m) ?? 0) + 1);
  }
  const newStudentsSeries = months.map((m) => ({
    key: m.key,
    label: m.label,
    count: newStudentsByMonth.get(m.key) ?? 0,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="font-display text-3xl text-gray-darkest tracking-wide">Analytics</div>
          <p className="mt-2 text-sm text-gray-darker max-w-2xl">
            Revenue, lesson counts, and lead source breakdown. Prices use the per-attendance
            override when set, otherwise the student's default price.
          </p>
        </div>
        <Link
          href="/admin/classes"
          className="inline-flex justify-center rounded-md bg-accent-warm px-4 py-2 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light transition-colors"
        >
          Open daily log →
        </Link>
      </div>

      <AnalyticsView
        totals={{
          monthRevenue,
          monthLessons,
          yearRevenue,
          allRevenue,
          allLessons,
          totalPaymentsIn,
        }}
        months={months.map((m) => ({
          key: m.key,
          label: m.label,
          revenue: m.revenue,
          lessons: m.lessons,
        }))}
        sources={sourceRows.map((r) => ({ value: r.value, label: r.label, count: r.count }))}
        newStudents={newStudentsSeries.map((s) => ({
          key: s.key,
          label: s.label,
          count: s.count,
        }))}
        currentMonthKey={monthKey}
      />
    </div>
  );
}
