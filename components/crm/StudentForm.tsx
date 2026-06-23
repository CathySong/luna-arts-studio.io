"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LEAD_SOURCES, type Student } from "@/lib/crm/types";

function splitTags(raw: string): string[] {
  return raw
    .split(/[,|\n]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

type Props = {
  student?: Student | null;
};

export default function StudentForm({ student }: Props) {
  const router = useRouter();
  const isEdit = Boolean(student?.id);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get("name") ?? "").trim();
    const ageRaw = String(fd.get("age") ?? "").trim();
    const classesTakenRaw = String(fd.get("classesTaken") ?? "").trim();
    const defaultPriceRaw = String(fd.get("defaultPrice") ?? "").trim();
    const source = String(fd.get("source") ?? "").trim() || undefined;
    const sourceCustom = String(fd.get("sourceCustom") ?? "").trim() || undefined;

    const payload = {
      name,
      age: ageRaw === "" ? undefined : Number(ageRaw),
      parentName: String(fd.get("parentName") ?? "").trim() || undefined,
      parentEmail: String(fd.get("parentEmail") ?? "").trim() || undefined,
      parentPhone: String(fd.get("parentPhone") ?? "").trim() || undefined,
      hobbies: splitTags(String(fd.get("hobbies") ?? "")),
      lovedArts: splitTags(String(fd.get("lovedArts") ?? "")),
      notes: String(fd.get("notes") ?? "").trim() || undefined,
      classesTaken:
        classesTakenRaw === "" ? (isEdit ? undefined : 0) : Number(classesTakenRaw) || 0,
      defaultPrice:
        defaultPriceRaw === "" ? undefined : Number(defaultPriceRaw) || undefined,
      source,
      sourceCustom,
    };

    if (!payload.name) {
      setError("Name is required.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && student) {
        const body: Record<string, unknown> = {
          name: payload.name,
          hobbies: payload.hobbies,
          lovedArts: payload.lovedArts,
        };
        if (payload.age !== undefined && !Number.isNaN(payload.age)) body.age = payload.age;
        if (payload.parentName !== undefined) body.parentName = payload.parentName;
        if (payload.parentEmail !== undefined) body.parentEmail = payload.parentEmail;
        if (payload.parentPhone !== undefined) body.parentPhone = payload.parentPhone;
        if (payload.notes !== undefined) body.notes = payload.notes;
        if (payload.classesTaken !== undefined) body.classesTaken = payload.classesTaken;
        if (payload.defaultPrice !== undefined) body.defaultPrice = payload.defaultPrice;
        body.source = payload.source ?? null;
        body.sourceCustom = payload.sourceCustom ?? null;

        const res = await fetch(`/api/admin/students/${student.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(typeof data.error === "string" ? data.error : "Unable to save student.");
          return;
        }
        router.push(`/admin/students/${student.id}`);
        router.refresh();
        return;
      }

      const res = await fetch("/api/admin/students", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student: payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Unable to create student.");
        return;
      }
      const created = data.student as Student | undefined;
      if (created?.id) {
        router.push(`/admin/students/${created.id}`);
      } else {
        router.push("/admin/students");
      }
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-darker">Name</span>
          <input
            name="name"
            required
            defaultValue={student?.name ?? ""}
            className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-darker">Age</span>
          <input
            name="age"
            type="number"
            min={0}
            defaultValue={student?.age ?? ""}
            className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-darker">Parent name</span>
          <input
            name="parentName"
            defaultValue={student?.parentName ?? ""}
            className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-darker">Parent email</span>
          <input
            name="parentEmail"
            type="email"
            defaultValue={student?.parentEmail ?? ""}
            className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-darker">Parent phone</span>
        <input
          name="parentPhone"
          defaultValue={student?.parentPhone ?? ""}
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-darker">Hobbies (comma or newline separated)</span>
        <textarea
          name="hobbies"
          rows={3}
          defaultValue={(student?.hobbies ?? []).join(", ")}
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-darker">Loved arts (comma or newline separated)</span>
        <textarea
          name="lovedArts"
          rows={3}
          defaultValue={(student?.lovedArts ?? []).join(", ")}
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-darker">Notes</span>
        <textarea
          name="notes"
          rows={4}
          defaultValue={student?.notes ?? ""}
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm max-w-xs">
        <span className="text-gray-darker">Classes taken</span>
        <input
          name="classesTaken"
          type="number"
          min={0}
          defaultValue={student?.classesTaken ?? 0}
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
        />
      </label>

      <div className="border-t border-gray-lighter pt-6">
        <div className="font-display text-base text-gray-darkest mb-3">💰 Pricing & source</div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-darker">Default price per lesson (USD)</span>
            <input
              name="defaultPrice"
              type="number"
              min={0}
              step="0.01"
              defaultValue={student?.defaultPrice ?? ""}
              placeholder="e.g. 60"
              className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-darker">Lead source</span>
            <select
              name="source"
              defaultValue={student?.source ?? ""}
              className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
            >
              <option value="">— select —</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-darker">Source (custom, if other)</span>
            <input
              name="sourceCustom"
              defaultValue={student?.sourceCustom ?? ""}
              placeholder="e.g. flyer at coffee shop"
              className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-accent-warm px-5 py-2.5 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light disabled:opacity-60 transition-colors"
        >
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Create student"}
        </button>
      </div>
    </form>
  );
}
