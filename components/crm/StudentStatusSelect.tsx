"use client";

import { useState } from "react";

import type { StudentStatus } from "@/lib/crm/types";

type Props = {
  studentId: string;
  initialStatus: StudentStatus;
};

export default function StudentStatusSelect({ studentId, initialStatus }: Props) {
  const [status, setStatus] = useState<StudentStatus>(initialStatus);
  const [saving, setSaving] = useState(false);

  async function updateStatus(nextStatus: StudentStatus) {
    const previous = status;
    setStatus(nextStatus);
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/students/${studentId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) throw new Error("Unable to update status");
    } catch {
      setStatus(previous);
      window.alert("Unable to update student status. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      aria-label="Student status"
      value={status}
      disabled={saving}
      onChange={(event) => void updateStatus(event.target.value as StudentStatus)}
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold outline-none disabled:opacity-60 ${
        status === "active"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-gray-lighter bg-gray-lightest text-gray-darker"
      }`}
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  );
}
