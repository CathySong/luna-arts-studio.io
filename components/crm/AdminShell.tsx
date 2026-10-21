"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/classes", label: "Daily Class" },
  { href: "/admin/website-classes", label: "Website Classes" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/sms-agent", label: "SMS Agent" },
  { href: "/admin/sessions", label: "Sessions" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE", credentials: "include" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white-warm text-gray-darkest font-body">
      <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-gray-lighter bg-white flex flex-col">
        <div className="px-4 py-3 md:p-6 border-b border-gray-lighter">
          <div className="font-display text-xl tracking-wide text-gray-darkest">Luna CRM</div>
          <div className="hidden md:block text-xs text-gray-dark mt-1 uppercase tracking-ultra">Admin</div>
        </div>
        <nav className="flex-1 p-2 md:p-4 flex flex-row md:flex-col gap-1 overflow-x-auto">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent-warm/15 text-gray-darkest border border-accent-warm/40"
                    : "text-gray-darker hover:bg-gray-lightest hover:text-gray-darkest"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block p-4 border-t border-gray-lighter">
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full rounded-md border border-gray-lighter px-3 py-2 text-sm text-gray-darker hover:border-accent-warm hover:text-accent-warm transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
