"use client";

import { useState } from "react";

export default function RenewalAction({ studentId, studentName }: { studentId: string; studentName: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/parent/renewal-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId }) });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    setMessage(res.ok ? `已提交 ${studentName} 的续报申请。` : body.error ?? "提交失败，请稍后重试。");
  }

  return <div className="mt-8"><button onClick={() => void submit()} disabled={busy} className="w-full rounded-md bg-accent-warm px-4 py-3 text-sm font-medium text-gray-darkest disabled:opacity-60">{busy ? "提交中…" : "一键申请续报"}</button>{message ? <p className="mt-3 rounded-md bg-accent-warm/10 px-3 py-2 text-center text-sm text-gray-darkest">{message}</p> : null}</div>;
}
