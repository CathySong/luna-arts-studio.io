"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SessionForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      title: String(fd.get("title") ?? "").trim(),
      classType: String(fd.get("classType") ?? "").trim(),
      date: String(fd.get("date") ?? "").trim(),
      instructor: String(fd.get("instructor") ?? "").trim() || undefined,
      notes: String(fd.get("notes") ?? "").trim() || undefined,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Unable to create session.");
        return;
      }
      const id = data.session?.id as string | undefined;
      if (id) router.push(`/admin/sessions/${id}`);
      else router.push("/admin/sessions");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-darker">Title</span>
        <input
          name="title"
          required
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-darker">Class type</span>
        <input
          name="classType"
          required
          placeholder="e.g. Watercolor fundamentals"
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm max-w-xs">
        <span className="text-gray-darker">Date</span>
        <input
          name="date"
          type="date"
          required
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-darker">Instructor</span>
        <input
          name="instructor"
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-darker">Notes</span>
        <textarea
          name="notes"
          rows={4}
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-accent-warm px-5 py-2.5 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light disabled:opacity-60 transition-colors"
      >
        {submitting ? "Creating…" : "Create session"}
      </button>
    </form>
  );
}
