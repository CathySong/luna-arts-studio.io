"use client";

import { useState } from "react";

type Props = {
  studentId: string;
};

export default function SyncKnowledgeButton({ studentId }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string>("");

  async function sync() {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(`/api/admin/students/${studentId}/sync-kb`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || data.ok === false) {
        setStatus("err");
        setMessage(data.error ?? `Sync failed (${res.status})`);
        return;
      }
      setStatus("ok");
      setMessage("NotebookLM knowledge synced.");
    } catch {
      setStatus("err");
      setMessage("Network error.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => void sync()}
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-md bg-accent-warm px-4 py-2 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light disabled:opacity-60 transition-colors"
      >
        {status === "loading" ? "Syncing…" : "Sync knowledge base"}
      </button>
      {message ? (
        <div
          className={`text-sm ${status === "err" ? "text-red-700" : "text-gray-darker"}`}
          role="status"
        >
          {message}
        </div>
      ) : null}
    </div>
  );
}
