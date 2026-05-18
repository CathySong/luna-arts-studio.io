import Link from "next/link";

import { listSessions } from "@/lib/crm/db";

export default async function AdminSessionsPage() {
  const sessions = await listSessions();
  const sorted = [...sessions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="font-display text-3xl text-gray-darkest tracking-wide">Sessions</div>
          <p className="mt-2 text-sm text-gray-darker">Class meetings — attach artwork and generate Claude reviews.</p>
        </div>
        <Link
          href="/admin/sessions/new"
          className="inline-flex justify-center rounded-md bg-accent-warm px-4 py-2 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light transition-colors"
        >
          New session
        </Link>
      </div>

      <div className="rounded-xl border border-gray-lighter bg-white overflow-hidden card-shadow">
        <table className="w-full text-sm">
          <thead className="bg-white-warm text-left text-xs uppercase tracking-ultra text-gray-dark">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium w-28"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id} className="border-t border-gray-lighter">
                <td className="px-4 py-3 text-gray-darkest">{s.title}</td>
                <td className="px-4 py-3 text-gray-darker">{s.classType}</td>
                <td className="px-4 py-3 text-gray-darker">{s.date}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/sessions/${s.id}`}
                    className="text-accent-warm hover:text-gray-darkest text-xs font-medium uppercase tracking-wide"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-dark">
                  No sessions yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
