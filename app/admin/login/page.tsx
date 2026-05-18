"use client";

import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const qs = new URLSearchParams(window.location.search);
      const reason = qs.get("reason");
      const next = qs.get("next");
      if (reason === "missing-admin-secret") {
        setBanner("Admin login is unavailable until ADMIN_PASSWORD is configured.");
      }
      if (next && next.startsWith("/admin")) {
        sessionStorage.setItem("crm_admin_next", next);
      }
    } catch {
      /* ignore */
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Login failed.");
        return;
      }
      let dest = "/admin";
      try {
        const saved = sessionStorage.getItem("crm_admin_next");
        if (saved && saved.startsWith("/admin")) dest = saved;
        sessionStorage.removeItem("crm_admin_next");
      } catch {
        /* ignore */
      }
      window.location.href = dest;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-white-warm flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-lighter bg-white p-8 card-shadow">
        <div className="font-display text-2xl text-gray-darkest tracking-wide">Luna CRM</div>
        <p className="mt-2 text-sm text-gray-darker">Sign in with the studio admin password.</p>

        {banner ? (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
            {banner}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-darker">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
              required
            />
          </label>
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900">
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-accent-warm px-4 py-2.5 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light disabled:opacity-60 transition-colors"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
