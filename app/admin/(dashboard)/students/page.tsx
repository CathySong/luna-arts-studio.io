import Link from "next/link";

import { listStudentsWithEnrollment } from "@/lib/crm/db";

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

      <div className="rounded-xl border border-gray-lighter bg-white overflow-hidden card-shadow">
        <table className="w-full text-sm">
          <thead className="bg-white-warm text-left text-xs uppercase tracking-ultra text-gray-dark">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Parent</th>
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
                <td colSpan={5} className="px-4 py-8 text-center text-gray-dark">
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
