"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ParentRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await Promise.race([
        createClient().auth.signUp({ email: email.trim(), password }),
        new Promise<never>((_, reject) =>
          window.setTimeout(() => reject(new Error("注册请求超时，请检查网络后重试。")), 15000)
        ),
      ]);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.data.session) {
        window.location.href = "/parent/portal";
        return;
      }

      setMessage("注册成功。请先检查邮箱并完成验证，然后返回登录。");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "注册失败，请稍后重试。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-white-warm px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-lighter bg-white p-8 card-shadow">
        <Link href="/" className="text-xs uppercase tracking-ultra text-gray-dark hover:text-accent-warm">← Luna Art Studio</Link>
        <h1 className="mt-8 font-display text-3xl text-gray-darkest">家长注册</h1>
        <p className="mt-2 text-sm text-gray-darker">注册后请使用报名时留在工作室的家长邮箱登录。</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-sm"><span className="text-gray-darker">邮箱</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className="mt-1 w-full rounded-md border border-gray-lighter bg-white px-3 py-2.5 outline-none focus:border-accent-warm" /></label>
          <label className="block text-sm"><span className="text-gray-darker">密码</span><input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required className="mt-1 w-full rounded-md border border-gray-lighter bg-white px-3 py-2.5 outline-none focus:border-accent-warm" /></label>
          {message ? <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-900">{message}</div> : null}
          {error ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900">{error}</div> : null}
          <button disabled={busy} className="w-full rounded-md bg-accent-warm px-4 py-3 text-sm font-medium text-gray-darkest disabled:opacity-60">{busy ? "注册中…" : "注册家长账号"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-darker">已有账号？ <Link href="/parent/login" className="text-accent-warm hover:underline">返回登录</Link></p>
      </div>
    </main>
  );
}
