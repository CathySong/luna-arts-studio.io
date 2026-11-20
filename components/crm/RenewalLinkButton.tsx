"use client";

import { useState } from "react";

export default function RenewalLinkButton({ studentId, disabled }: { studentId: string; disabled?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/students/${studentId}/renewal-link`, { method: "POST", credentials: "include" });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setError(body.error ?? "生成失败"); return; }
    setUrl(body.url);
    await navigator.clipboard?.writeText(body.url);
  }

  return <div className="w-full sm:w-auto"><button type="button" onClick={() => void generate()} disabled={disabled || busy} className="w-full sm:w-auto rounded-md border border-accent-warm/60 bg-accent-warm/10 px-3 py-2 text-sm text-gray-darkest hover:bg-accent-warm/20 disabled:opacity-50">{busy ? "生成中…" : "生成续报提醒链接"}</button>{url ? <div className="mt-2 flex max-w-full gap-2"><input readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="min-w-0 flex-1 rounded border border-gray-lighter bg-white px-2 py-1 text-xs text-gray-dark" /><button type="button" onClick={() => void navigator.clipboard?.writeText(url)} className="shrink-0 text-xs text-accent-warm">复制</button></div> : null}{error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}</div>;
}
