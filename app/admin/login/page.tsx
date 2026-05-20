"use client";

import Image from "next/image";
import Link from "next/link";
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
    <div className="min-h-screen bg-white-warm flex flex-col items-center justify-center px-6 py-16">
      <Link
        href="/"
        className="mb-10 font-mono text-[10px] tracking-widest uppercase text-gray-darker hover:text-accent-warm transition-colors"
      >
        ← Luna Art Studio
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-gray-lighter bg-white p-8 card-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-10 h-10 shrink-0">
            <Image src="/luna.jpg" alt="" fill className="object-contain" sizes="40px" />
          </div>
          <div>
            <div className="font-display text-2xl text-gray-darkest tracking-wide">工作室后台</div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent-warm mt-0.5">
              Luna Studio Admin
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-darker">
          学生档案、上课记录、课堂点评与付款管理。请输入管理员密码登录。
        </p>

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
            {busy ? "登录中…" : "登录"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray">
          入口地址：{" "}
          <Link href="/admin/login" className="text-accent-warm hover:underline">
            /admin/login
          </Link>
          {" · "}
          <Link href="/studio" className="text-accent-warm hover:underline">
            /studio
          </Link>
        </p>
      </div>
    </div>
  );
}
