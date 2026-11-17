import Link from "next/link";

import StudentsAutoRefresh from "@/components/crm/StudentsAutoRefresh";

import {
  listAllAttendances,
  listAllPayments,
  listArtworks,
  listReviews,
  listSessions,
  listStudents,
} from "@/lib/crm/db";
import { getStructuredStudentSchedule } from "@/lib/crm/student-schedule";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function scheduleStartMinutes(value: string): number {
  const start = value.split(/[–—-]/)[0]?.trim() ?? "";
  const suffix = value.match(/\b(AM|PM)\b/i)?.[1]?.toUpperCase();
  const match = start.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const period = match[3]?.toUpperCase() ?? suffix;
  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

export default async function AdminDashboardHomePage() {
  const [students, sessions, artworks, reviews, attendances, payments] = await Promise.all([
    listStudents(),
    listSessions(),
    listArtworks(),
    listReviews(),
    listAllAttendances(),
    listAllPayments(),
  ]);

  const approved = reviews.filter((r) => r.status === "approved").length;

  // Quick revenue/last-30-days stats
  const studentMap = new Map(students.map((s) => [s.id, s]));
  const now = new Date();
  const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400_000).toISOString().slice(0, 10);

  let monthRevenue = 0;
  let monthLessons = 0;
  let last30Revenue = 0;
  for (const a of attendances) {
    const s = studentMap.get(a.studentId);
    const price = a.priceOverride ?? s?.defaultPrice ?? 0;
    const total = price * (a.lessonsUsed ?? 1);
    if (a.date.startsWith(monthKey)) {
      monthRevenue += total;
      monthLessons += a.lessonsUsed ?? 1;
    }
    if (a.date >= thirtyDaysAgo) {
      last30Revenue += total;
    }
  }

  const totalPaymentsIn = payments.reduce((sum, p) => sum + p.amount, 0);

  const weekdayOrder = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const calendarEntries = students.flatMap((student) =>
    getStructuredStudentSchedule(student).map((schedule) => ({ student, schedule }))
  );
  const timeSlots = Array.from(
    new Set(calendarEntries.map(({ schedule }) => schedule.time).filter(Boolean))
  ).sort((a, b) => scheduleStartMinutes(a) - scheduleStartMinutes(b) || a.localeCompare(b));

  const stats = [
    { label: "Students", value: students.length, href: "/admin/students" },
    { label: "Sessions", value: sessions.length, href: "/admin/sessions" },
    { label: "Artworks", value: artworks.length, href: "/admin/sessions" },
    { label: "Approved reviews", value: approved, href: "/admin/sessions" },
  ];

  return (
    <div className="space-y-10">
      <StudentsAutoRefresh />
      <div>
        <div className="font-display text-3xl text-gray-darkest tracking-wide">Dashboard</div>
        <p className="mt-2 text-sm text-gray-darker max-w-2xl">
          Overview of Luna CRM records — students, class sessions, uploaded artwork, and review approvals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/admin/analytics"
          className="rounded-xl border border-accent-warm/40 bg-accent-warm/5 p-6 card-shadow card-shadow-hover block"
        >
          <div className="text-xs uppercase tracking-ultra text-gray-dark">This month revenue</div>
          <div className="mt-2 font-display text-3xl text-accent-warm">${monthRevenue.toFixed(2)}</div>
          <div className="mt-1 text-xs text-gray-darker">{monthLessons} lessons</div>
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow card-shadow-hover block"
        >
          <div className="text-xs uppercase tracking-ultra text-gray-dark">Last 30 days</div>
          <div className="mt-2 font-display text-3xl text-gray-darkest">${last30Revenue.toFixed(2)}</div>
          <div className="mt-1 text-xs text-gray-darker">revenue from attendance</div>
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow card-shadow-hover block"
        >
          <div className="text-xs uppercase tracking-ultra text-gray-dark">Total payments</div>
          <div className="mt-2 font-display text-3xl text-gray-darkest">${totalPaymentsIn.toFixed(2)}</div>
          <div className="mt-1 text-xs text-gray-darker">across {payments.length} records</div>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow card-shadow-hover block"
          >
            <div className="text-xs uppercase tracking-ultra text-gray-dark">{s.label}</div>
            <div className="mt-3 font-display text-4xl text-gray-darkest">{s.value}</div>
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-gray-darkest">Weekly class schedule</h2>
            <p className="mt-1 text-sm text-gray-darker">固定上课日期、时间和学生名单</p>
          </div>
          <Link href="/admin/students" className="text-sm font-medium text-accent-warm hover:text-gray-darkest">
            View students →
          </Link>
        </div>
        {timeSlots.length > 0 ? (
          <div className="mt-5 overflow-x-auto rounded-lg border border-gray-lighter">
            <table className="w-full min-w-[1120px] table-fixed border-collapse text-sm">
              <thead>
                <tr className="bg-white-warm">
                  <th className="w-36 border-b border-r border-gray-lighter px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark">
                    Time
                  </th>
                  {weekdayOrder.map((weekday) => (
                    <th key={weekday} className="border-b border-r border-gray-lighter px-3 py-3 text-left text-xs font-semibold tracking-wide text-accent-warm last:border-r-0">
                      {weekday}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time} className="align-top even:bg-white-warm/30">
                    <th className="border-b border-r border-gray-lighter px-3 py-4 text-left text-xs font-semibold text-gray-darkest">
                      {time}
                    </th>
                    {weekdayOrder.map((weekday) => {
                      const studentsInSlot = calendarEntries
                        .filter(({ schedule }) => schedule.day === weekday && schedule.time === time)
                        .map(({ student }) => student)
                        .sort((a, b) => a.name.localeCompare(b.name));
                      return (
                        <td key={`${weekday}-${time}`} className="border-b border-r border-gray-lighter px-3 py-3 last:border-r-0">
                          {studentsInSlot.length > 0 ? (
                            <div className="space-y-1.5">
                              {studentsInSlot.map((student) => (
                                <Link
                                  key={student.id}
                                  href={`/admin/students/${student.id}`}
                                  className="block rounded-md bg-accent-warm/10 px-2.5 py-1.5 font-medium text-gray-darkest transition-colors hover:bg-accent-warm/20 hover:text-accent-warm"
                                >
                                  {student.name}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-lighter">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-5 text-sm text-gray-dark">No fixed class times saved yet.</p>
        )}
      </section>

      <div className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow flex flex-wrap gap-4">
        <Link
          href="/admin/classes"
          className="rounded-md bg-accent-warm px-4 py-2 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light transition-colors"
        >
          📝 Daily class log
        </Link>
        <Link
          href="/admin/students/new"
          className="rounded-md border border-gray-lighter px-4 py-2 text-sm font-medium text-gray-darkest hover:border-accent-warm transition-colors"
        >
          New student
        </Link>
        <Link
          href="/admin/sessions/new"
          className="rounded-md border border-gray-lighter px-4 py-2 text-sm font-medium text-gray-darkest hover:border-accent-warm transition-colors"
        >
          New session
        </Link>
      </div>
    </div>
  );
}
