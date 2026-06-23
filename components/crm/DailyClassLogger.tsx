"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Student = {
  id: string;
  name: string;
  defaultPrice?: number;
  source?: string;
};

type AttendanceRow = {
  id: string;
  studentId: string;
  startTime?: string;
  durationMinutes?: number;
  priceOverride?: number;
  lessonsUsed: number;
  content: string;
  lessonTheme?: string;
  techniquesLearned?: string;
};

type Props = {
  date: string;
  students: Student[];
  todays: AttendanceRow[];
};

function getEffectivePrice(s: Student, a?: AttendanceRow): number | undefined {
  return a?.priceOverride ?? s.defaultPrice;
}

export default function DailyClassLogger({ date, students, todays }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const byStudent = useMemo(() => {
    const m = new Map<string, AttendanceRow>();
    for (const a of todays) m.set(a.studentId, a);
    return m;
  }, [todays]);

  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [students, search]);

  const presentCount = todays.length;
  const totalRevenue = todays.reduce((sum, a) => {
    const s = students.find((x) => x.id === a.studentId);
    const p = getEffectivePrice(s ?? { id: "", name: "" }, a) ?? 0;
    return sum + p * (a.lessonsUsed ?? 1);
  }, 0);

  async function togglePresent(student: Student) {
    setError(null);
    const existing = byStudent.get(student.id);
    if (existing) {
      // Delete
      setBusy(student.id);
      const res = await fetch(`/api/admin/attendances/${existing.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setBusy(null);
      if (!res.ok) {
        setError(`Failed to remove: ${res.status}`);
        return;
      }
      router.refresh();
      return;
    }
    // Create with sensible defaults
    setBusy(student.id);
    const res = await fetch(`/api/admin/classes/quick-log`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student.id,
        date,
        content: "Class attendance",
        lessonsUsed: 1,
        durationMinutes: 60,
        priceOverride: student.defaultPrice ?? null,
      }),
    });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : `Failed: ${res.status}`);
      return;
    }
    router.refresh();
  }

  async function updateField(
    studentId: string,
    field: "startTime" | "durationMinutes" | "priceOverride" | "lessonsUsed" | "content" | "lessonTheme" | "techniquesLearned",
    value: string | number | null,
  ) {
    const existing = byStudent.get(studentId);
    if (!existing) return;
    setError(null);
    setBusy(`${existing.id}-${field}`);
    const body: Record<string, unknown> = {};
    if (field === "content" || field === "lessonTheme" || field === "techniquesLearned" || field === "startTime") {
      body[field] = value === "" ? null : value;
    } else {
      body[field] = value === "" || value === null ? null : Number(value);
    }
    const res = await fetch(`/api/admin/attendances/${existing.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : `Failed: ${res.status}`);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="rounded-xl border border-gray-lighter bg-white p-4 card-shadow flex flex-wrap items-center gap-6">
        <div>
          <div className="text-xs uppercase tracking-ultra text-gray-dark">Date</div>
          <div className="font-display text-lg text-gray-darkest">{date}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-ultra text-gray-dark">Present</div>
          <div className="font-display text-2xl text-gray-darkest">{presentCount}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-ultra text-gray-dark">Revenue (today)</div>
          <div className="font-display text-2xl text-accent-warm">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="flex-1" />
        <input
          type="search"
          placeholder="Search students…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-sm text-gray-darkest outline-none focus:border-accent-warm min-w-[200px]"
        />
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border border-gray-lighter bg-white overflow-hidden card-shadow">
        <table className="w-full text-sm">
          <thead className="bg-white-warm text-left text-xs uppercase tracking-ultra text-gray-dark">
            <tr>
              <th className="px-3 py-3 w-10"></th>
              <th className="px-3 py-3 font-medium">Student</th>
              <th className="px-3 py-3 font-medium">Source</th>
              <th className="px-3 py-3 font-medium">Start time</th>
              <th className="px-3 py-3 font-medium">Duration</th>
              <th className="px-3 py-3 font-medium text-right">Price</th>
              <th className="px-3 py-3 font-medium text-center">Lessons</th>
              <th className="px-3 py-3 font-medium">Notes / theme</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const att = byStudent.get(s.id);
              const isPresent = Boolean(att);
              return (
                <tr
                  key={s.id}
                  className={`border-t border-gray-lighter ${
                    isPresent ? "bg-accent-warm/5" : ""
                  }`}
                >
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={isPresent}
                      disabled={busy === s.id}
                      onChange={() => void togglePresent(s)}
                      className="h-4 w-4 cursor-pointer accent-accent-warm"
                      aria-label={`Mark ${s.name} present on ${date}`}
                    />
                  </td>
                  <td className="px-3 py-2 text-gray-darkest font-medium">
                    {s.name}
                    {isPresent ? (
                      <span className="ml-2 text-xs text-accent-warm">● present</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-darker">
                    {s.source ?? <span className="text-gray-dark">—</span>}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="time"
                      defaultValue={att?.startTime ?? ""}
                      disabled={!isPresent}
                      onBlur={(e) =>
                        isPresent &&
                        e.target.value !== (att?.startTime ?? "") &&
                        void updateField(s.id, "startTime", e.target.value)
                      }
                      className="rounded-md border border-gray-lighter bg-white px-2 py-1 text-xs text-gray-darkest outline-none focus:border-accent-warm w-24 disabled:opacity-40"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      defaultValue={att?.durationMinutes ?? 60}
                      disabled={!isPresent}
                      onChange={(e) => isPresent && void updateField(s.id, "durationMinutes", e.target.value)}
                      className="rounded-md border border-gray-lighter bg-white px-2 py-1 text-xs text-gray-darkest outline-none focus:border-accent-warm w-20 disabled:opacity-40"
                    >
                      <option value={30}>30m</option>
                      <option value={45}>45m</option>
                      <option value={60}>60m</option>
                      <option value={75}>75m</option>
                      <option value={90}>90m</option>
                      <option value={120}>120m</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-gray-dark text-xs">$</span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        defaultValue={att?.priceOverride ?? s.defaultPrice ?? ""}
                        placeholder={s.defaultPrice ? String(s.defaultPrice) : "—"}
                        disabled={!isPresent}
                        onBlur={(e) => {
                          if (!isPresent) return;
                          const v = e.target.value;
                          const newVal = v === "" ? null : Number(v);
                          if (newVal === s.defaultPrice) {
                            // Treat as "use default" — send null
                            void updateField(s.id, "priceOverride", null);
                          } else {
                            void updateField(s.id, "priceOverride", v);
                          }
                        }}
                        className="rounded-md border border-gray-lighter bg-white px-2 py-1 text-xs text-gray-darkest outline-none focus:border-accent-warm w-20 text-right disabled:opacity-40"
                      />
                    </div>
                    {s.defaultPrice && !att?.priceOverride ? (
                      <div className="text-[10px] text-gray-dark mt-0.5">using default</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      defaultValue={att?.lessonsUsed ?? 1}
                      disabled={!isPresent}
                      onBlur={(e) =>
                        isPresent &&
                        e.target.value !== String(att?.lessonsUsed ?? 1) &&
                        void updateField(s.id, "lessonsUsed", e.target.value)
                      }
                      className="rounded-md border border-gray-lighter bg-white px-2 py-1 text-xs text-gray-darkest outline-none focus:border-accent-warm w-14 text-center disabled:opacity-40"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      defaultValue={att?.lessonTheme ?? att?.content ?? ""}
                      disabled={!isPresent}
                      placeholder={isPresent ? "Theme / what was done" : "—"}
                      onBlur={(e) =>
                        isPresent &&
                        e.target.value !== (att?.lessonTheme ?? att?.content ?? "") &&
                        void updateField(s.id, "lessonTheme", e.target.value)
                      }
                      className="rounded-md border border-gray-lighter bg-white px-2 py-1 text-xs text-gray-darkest outline-none focus:border-accent-warm w-full min-w-[180px] disabled:opacity-40"
                    />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-dark">
                  {search ? "No matching students." : "No students yet. Add students first."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
