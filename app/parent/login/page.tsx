"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ParentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: authError } = await createClient().auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setBusy(false);
      return;
    }
    window.location.href = "/parent/portal";
  }

  return (
    <AuthShell title="家长登录" subtitle="查看孩子的课程进度、作品和剩余课时">
      <form onSubmit={submit} className="space-y-4">
        <Field label="邮箱" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field label="密码" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        {error ? <ErrorBox>{error}</ErrorBox> : null}
        <button disabled={busy} className="w-full rounded-md bg-accent-warm px-4 py-3 text-sm font-medium text-gray-darkest disabled:opacity-60">
          {busy ? "登录中…" : "登录"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-darker">
        还没有账号？ <Link href="/parent/register" className="text-accent-warm hover:underline">注册家长账号</Link>
      </p>
    </AuthShell>
  );
}

function Field(props: { label: string; type: string; value: string; onChange: (value: string) => void; autoComplete: string }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-darker">{props.label}</span>
      <input type={props.type} value={props.value} onChange={(e) => props.onChange(e.target.value)} autoComplete={props.autoComplete} required className="mt-1 w-full rounded-md border border-gray-lighter bg-white px-3 py-2.5 outline-none focus:border-accent-warm" />
    </label>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900">{children}</div>;
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white-warm px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-lighter bg-white p-8 card-shadow">
        <Link href="/" className="text-xs uppercase tracking-ultra text-gray-dark hover:text-accent-warm">← Luna Art Studio</Link>
        <h1 className="mt-8 font-display text-3xl text-gray-darkest">{title}</h1>
        <p className="mt-2 text-sm text-gray-darker">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
