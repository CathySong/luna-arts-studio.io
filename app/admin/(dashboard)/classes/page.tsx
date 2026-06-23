import Link from "next/link";

import { listAllAttendances, listStudents } from "@/lib/crm/db";

import DailyClassLogger from "@/components/crm/DailyClassLogger";

type Props = {
  searchParams?: { date?: string };
};

function todayIso(): string {
  // Server-rendered page; we use UTC date by default to match schedule.json convention.
  // User can override via ?date=YYYY-MM-DD.
  return new Date().toISOString().slice(0, 10);
}

export default async function AdminClassesPage({ searchParams }: Props) {
  const date = searchParams?.date ?? todayIso();
  const [students, allAttendances] = await Promise.all([
    listStudents(),
    listAllAttendances(),
  ]);
  const todays = allAttendances.filter((a) => a.date === date);

  // Sort students: those with attendance today first, then by name.
  const presentIds = new Set(todays.map((a) => a.studentId));
  const sortedStudents = [...students].sort((a, b) => {
    const ap = presentIds.has(a.id) ? 0 : 1;
    const bp = presentIds.has(b.id) ? 0 : 1;
    if (ap !== bp) return ap - bp;
    return a.name.localeCompare(b.name);
  });

  // Recent dates that had any attendance, for quick-jump links.
  const recentDates = Array.from(new Set(allAttendances.map((a) => a.date)))
    .sort((a, b) => (a < b ? 1 : -1))
    .slice(0, 7);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="font-display text-3xl text-gray-darkest tracking-wide">Daily class log</div>
          <p className="mt-2 text-sm text-gray-darker max-w-2xl">
            Quick roll-call — check who came today, set start time and price, log content.
            Each entry automatically counts as 1 lesson and inherits the student's default price.
          </p>
        </div>
        <form method="get" className="flex gap-2 items-center">
          <input
            type="date"
            name="date"
            defaultValue={date}
            className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-sm text-gray-darkest outline-none focus:border-accent-warm"
          />
          <button
            type="submit"
            className="rounded-md bg-accent-warm px-4 py-2 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light transition-colors"
          >
            Jump
          </button>
        </form>
      </div>

      {recentDates.length > 0 && date !== recentDates[0] ? (
        <div className="flex flex-wrap gap-2 text-xs text-gray-darker">
          <span className="self-center">Recent:</span>
          {recentDates.map((d) => (
            <Link
              key={d}
              href={`/admin/classes?date=${d}`}
              className={`rounded-md border px-2 py-1 transition-colors ${
                d === date
                  ? "border-accent-warm bg-accent-warm/10 text-gray-darkest"
                  : "border-gray-lighter hover:border-accent-warm"
              }`}
            >
              {d}
            </Link>
          ))}
        </div>
      ) : null}

      <DailyClassLogger
        date={date}
        students={sortedStudents.map((s) => ({
          id: s.id,
          name: s.name,
          defaultPrice: s.defaultPrice,
          source: s.source,
        }))}
        todays={todays.map((a) => ({
          id: a.id,
          studentId: a.studentId,
          startTime: a.startTime,
          durationMinutes: a.durationMinutes,
          priceOverride: a.priceOverride,
          lessonsUsed: a.lessonsUsed,
          content: a.content,
          lessonTheme: a.lessonTheme,
          techniquesLearned: a.techniquesLearned,
        }))}
      />
    </div>
  );
}
