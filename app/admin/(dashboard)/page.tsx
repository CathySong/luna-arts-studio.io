import Link from "next/link";

import {
  listAllAttendances,
  listAllPayments,
  listArtworks,
  listReviews,
  listSessions,
  listStudents,
} from "@/lib/crm/db";
import { getStructuredStudentSchedule } from "@/lib/crm/student-schedule";

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
  const weeklyClasses = weekdayOrder
    .map((weekday) => ({
      weekday,
      classes: students.flatMap((student) =>
        getStructuredStudentSchedule(student)
          .filter((schedule) => schedule.day === weekday)
          .map((schedule) => ({ student, schedule }))
      ),
    }))
    .filter((group) => group.classes.length > 0);

  const stats = [
    { label: "Students", value: students.length, href: "/admin/students" },
    { label: "Sessions", value: sessions.length, href: "/admin/sessions" },
    { label: "Artworks", value: artworks.length, href: "/admin/sessions" },
    { label: "Approved reviews", value: approved, href: "/admin/sessions" },
  ];

  return (
    <div className="space-y-10">
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
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {weeklyClasses.map((group) => (
            <div key={group.weekday} className="rounded-lg border border-gray-lighter bg-white-warm/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-ultra text-accent-warm">
                {group.weekday}
              </div>
              <div className="mt-3 space-y-3">
                {group.classes.map(({ student, schedule }) => (
                  <Link key={`${student.id}-${schedule}`} href={`/admin/students/${student.id}`} className="block group">
                    <div className="text-sm font-medium text-gray-darkest group-hover:text-accent-warm">
                      {student.name}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-darker">{schedule.time}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {weeklyClasses.length === 0 ? (
            <p className="text-sm text-gray-dark">No fixed class times saved yet.</p>
          ) : null}
        </div>
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
