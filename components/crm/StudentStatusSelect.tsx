"use client";

import { useEffect, useState } from "react";

import type { StudentStatus } from "@/lib/crm/types";

type Props = {
  studentId: string;
  initialStatus: StudentStatus;
};

export default function StudentStatusSelect({ studentId, initialStatus }: Props) {
  const [status, setStatus] = useState<StudentStatus>(initialStatus);
  const [savedStatus, setSavedStatus] = useState<StudentStatus>(initialStatus);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === savedStatus && initialStatus !== savedStatus) {
      setStatus(initialStatus);
      setSavedStatus(initialStatus);
    }
  }, [initialStatus, savedStatus, status]);

  async function saveStatus() {
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/students/${studentId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Unable to update status");
      setSavedStatus(status);
    } catch {
      setStatus(savedStatus);
      window.alert("Unable to update student status. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const dirty = status !== savedStatus;

  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="Student status"
        value={status}
        disabled={saving}
        onChange={(event) => {
          setStatus(event.target.value as StudentStatus);
        }}
        className={`rounded-full border px-2.5 py-1 text-xs font-semibold outline-none disabled:opacity-60 ${
          status === "active"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-gray-lighter bg-gray-lightest text-gray-darker"
        }`}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      {dirty || saving ? (
        <button
          type="button"
          disabled={saving}
          onClick={() => void saveStatus()}
          className="rounded-md bg-accent-warm px-2.5 py-1 text-xs font-semibold text-gray-darkest transition-colors hover:bg-accent-warm-light disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      ) : null}
    </div>
  );
}
