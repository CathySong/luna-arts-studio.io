import Link from "next/link";

import {
  listArtworks,
  listReviews,
  listSessions,
  listStudents,
} from "@/lib/crm/db";

export default async function AdminDashboardHomePage() {
  const [students, sessions, artworks, reviews] = await Promise.all([
    listStudents(),
    listSessions(),
    listArtworks(),
    listReviews(),
  ]);

  const approved = reviews.filter((r) => r.status === "approved").length;

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

      <div className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow flex flex-wrap gap-4">
        <Link
          href="/admin/students/new"
          className="rounded-md bg-accent-warm px-4 py-2 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light transition-colors"
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
