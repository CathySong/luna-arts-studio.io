import Link from "next/link";

import StudentStatusSelect from "@/components/crm/StudentStatusSelect";
import StudentsAutoRefresh from "@/components/crm/StudentsAutoRefresh";
import { listStudentsWithEnrollment } from "@/lib/crm/db";
import { getStructuredStudentSchedule } from "@/lib/crm/student-schedule";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type Props = {
  searchParams?: { search?: string };
};

export default async function AdminStudentsPage({ searchParams }: Props) {
  const q = searchParams?.search?.trim().toLowerCase();
  let rows = await listStudentsWithEnrollment();
  if (q) {
    rows = rows.filter(({ student: s }) => {
      const hay = `${s.name} ${s.parentName ?? ""} ${s.parentEmail ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }

  return (
    <div className="space-y-8">
      <StudentsAutoRefresh />
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="font-display text-3xl text-gray-darkest tracking-wide">Students</div>
          <p className="mt-2 text-sm text-gray-darker">Profiles used for CRM notes and Claude reviews.</p>
        </div>
        <Link
          href="/admin/students/new"
          className="inline-flex justify-center rounded-md bg-accent-warm px-4 py-2 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light transition-colors"
        >
          Add student
        </Link>
      </div>

      <form method="get" className="flex flex-wrap gap-2 items-center">
        <input
          name="search"
          defaultValue={searchParams?.search ?? ""}
          placeholder="Search name or parent…"
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-sm text-gray-darkest outline-none focus:border-accent-warm min-w-[220px]"
        />
        <button
          type="submit"
          className="rounded-md border border-gray-lighter px-4 py-2 text-sm text-gray-darkest hover:border-accent-warm transition-colors"
        >
          Search
        </button>
      </form>

      <div className="grid gap-3 md:hidden">
        {rows.map(({ student: s, summary }) => {
          const schedule = getStructuredStudentSchedule(s);
          return (
            <div
              key={s.id}
              className="rounded-xl border border-gray-lighter bg-white p-4 card-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/admin/students/${s.id}`} className="font-medium text-gray-darkest hover:text-accent-warm">
                    {s.name}
                  </Link>
                  <div className="mt-1 text-xs text-gray-darker">{s.parentName ?? "—"}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StudentStatusSelect studentId={s.id} initialStatus={s.status} />
                  <Link href={`/admin/students/${s.id}`} className="text-xs font-medium text-accent-warm">Edit</Link>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-accent-warm/10 px-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-dark">周几</div>
                    <div className="mt-1 text-sm font-medium text-gray-darkest">
                      {schedule.map((item) => item.day).join("；") || "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-dark">时间段</div>
                    <div className="mt-1 text-sm font-medium text-gray-darkest">
                      {schedule.map((item) => item.time).join("；") || "—"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-darker">
                剩余课时 {summary.remainingLessons} · 已上 {summary.usedLessons} / 总计 {summary.totalLessons}
              </div>
            </div>
          );
        })}
        {rows.length === 0 ? (
          <div className="rounded-xl border border-gray-lighter bg-white px-4 py-8 text-center text-gray-dark">
            No students yet.
          </div>
        ) : null}
      </div>

      <div className="hidden md:block rounded-xl border border-gray-lighter bg-white overflow-x-auto card-shadow">
        <table className="w-full text-sm">
          <thead className="bg-white-warm text-left text-xs uppercase tracking-ultra text-gray-dark">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Parent</th>
              <th className="px-4 py-3 font-medium">周几</th>
              <th className="px-4 py-3 font-medium">时间段</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium">剩余课时</th>
              <th className="px-4 py-3 font-medium">已上 / 总计</th>
              <th className="px-4 py-3 font-medium w-28"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ student: s, summary }) => (
              <tr key={s.id} className="border-t border-gray-lighter">
                <td className="px-4 py-3 text-gray-darkest">{s.name}</td>
                <td className="px-4 py-3 text-gray-darker">
                  {s.parentName ?? "—"}
                  {s.parentEmail ? (
                    <span className="block text-xs text-gray-dark">{s.parentEmail}</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-gray-darker text-xs whitespace-nowrap">
                  {getStructuredStudentSchedule(s).map((item) => item.day).join("；") || "—"}
                </td>
                <td className="px-4 py-3 text-gray-darker text-xs whitespace-nowrap">
                  {getStructuredStudentSchedule(s).map((item) => item.time).join("；") || "—"}
                </td>
                <td className="px-4 py-3">
                  <StudentStatusSelect studentId={s.id} initialStatus={s.status} />
                </td>
                <td className="px-4 py-3 text-gray-darker text-xs">
                  {s.source ? (
                    <span>
                      {s.source}
                      {s.sourceCustom ? ` (${s.sourceCustom})` : ""}
                    </span>
                  ) : (
                    <span className="text-gray-dark">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-darkest text-right">
                  {s.defaultPrice ? `$${s.defaultPrice}` : "—"}
                </td>
                <td
                  className={`px-4 py-3 font-medium ${
                    summary.remainingLessons <= 2 ? "text-amber-700" : "text-gray-darkest"
                  }`}
                >
                  {summary.remainingLessons}
                </td>
                <td className="px-4 py-3 text-gray-darker">
                  {summary.usedLessons} / {summary.totalLessons}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/students/${s.id}`}
                    className="text-accent-warm hover:text-gray-darkest text-xs font-medium uppercase tracking-wide"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-dark">
                  No students yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
