"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ClassAttendance,
  PaymentRecord,
  StudentEnrollmentSummary,
} from "@/lib/crm/types";

type Props = {
  studentId: string;
};

type EnrollmentData = {
  payments: PaymentRecord[];
  attendances: ClassAttendance[];
  summary: StudentEnrollmentSummary;
};

export default function StudentEnrollmentPanel({ studentId }: Props) {
  const router = useRouter();
  const [data, setData] = useState<EnrollmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/students/${studentId}/enrollment`, {
      credentials: "include",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error ?? "Failed to load enrollment");
      setLoading(false);
      return;
    }
    setData({
      payments: json.payments ?? [],
      attendances: json.attendances ?? [],
      summary: json.summary,
    });
    setLoading(false);
  }, [studentId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function addPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/students/${studentId}/payments`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paidAt: fd.get("paidAt"),
        amount: fd.get("amount"),
        lessonsPurchased: fd.get("lessonsPurchased"),
        notes: fd.get("notes") || undefined,
      }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error ?? "Failed to add payment");
      return;
    }
    e.currentTarget.reset();
    await load();
    router.refresh();
  }

  async function addAttendance(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/students/${studentId}/attendances`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: fd.get("date"),
        content: fd.get("content"),
        lessonsUsed: fd.get("lessonsUsed") || 1,
      }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error ?? "Failed to add attendance");
      return;
    }
    e.currentTarget.reset();
    await load();
    router.refresh();
  }

  async function removePayment(id: string) {
    if (!confirm("Delete this payment record?")) return;
    await fetch(`/api/admin/students/${studentId}/payments/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await load();
    router.refresh();
  }

  async function removeAttendance(id: string) {
    if (!confirm("Delete this class record?")) return;
    await fetch(`/api/admin/students/${studentId}/attendances/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await load();
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-gray-dark">Loading enrollment…</p>;
  }

  if (error || !data) {
    return <p className="text-sm text-red-700">{error || "No data"}</p>;
  }

  const { summary, payments, attendances } = data;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="总课时" value={String(summary.totalLessons)} />
        <Stat label="已上课时" value={String(summary.usedLessons)} />
        <Stat
          label="剩余课时"
          value={String(summary.remainingLessons)}
          highlight={summary.remainingLessons <= 2}
        />
        <Stat label="累计付款" value={`$${summary.totalPaid.toFixed(2)}`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h3 className="font-display text-lg text-gray-darkest">付款记录</h3>
          <form onSubmit={addPayment} className="space-y-3 text-sm border border-gray-lighter rounded-lg p-4 bg-gray-lightest/40">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="付款日期" name="paidAt" type="date" defaultValue={today} required />
              <Field label="金额 ($)" name="amount" type="number" step="0.01" min="0" required />
            </div>
            <Field label="购买课时数" name="lessonsPurchased" type="number" min="1" defaultValue="8" required />
            <Field label="备注" name="notes" />
            <button
              type="submit"
              className="rounded-md bg-accent-warm px-4 py-2 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light"
            >
              添加付款
            </button>
          </form>
          {payments.length === 0 ? (
            <p className="text-sm text-gray-dark">暂无付款记录</p>
          ) : (
            <ul className="space-y-2">
              {payments.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between gap-2 border border-gray-lighter rounded-lg px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium">{p.paidAt}</span>
                    <span className="text-gray-dark ml-2">${p.amount.toFixed(2)}</span>
                    <span className="text-gray-dark ml-2">· {p.lessonsPurchased} 课时</span>
                    {p.notes ? <p className="text-xs text-gray mt-0.5">{p.notes}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void removePayment(p.id)}
                    className="text-xs text-red-600 shrink-0"
                  >
                    删除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="font-display text-lg text-gray-darkest">上课记录</h3>
          <form onSubmit={addAttendance} className="space-y-3 text-sm border border-gray-lighter rounded-lg p-4 bg-gray-lightest/40">
            <Field label="上课日期" name="date" type="date" defaultValue={today} required />
            <label className="block">
              <span className="text-xs text-gray-darker">上课内容</span>
              <textarea
                name="content"
                required
                rows={2}
                placeholder="例如：水彩风景 · 调色与构图"
                className="mt-1 w-full rounded-md border border-gray-lighter px-3 py-2"
              />
            </label>
            <Field label="消耗课时" name="lessonsUsed" type="number" min="1" defaultValue="1" />
            <button
              type="submit"
              className="rounded-md bg-gray-darkest text-white px-4 py-2 text-sm hover:bg-gray-darker"
            >
              添加上课记录
            </button>
          </form>
          {attendances.length === 0 ? (
            <p className="text-sm text-gray-dark">暂无上课记录</p>
          ) : (
            <ul className="space-y-2 max-h-80 overflow-y-auto">
              {attendances.map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between gap-2 border border-gray-lighter rounded-lg px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium">{a.date}</span>
                    {a.lessonsUsed > 1 ? (
                      <span className="text-gray text-xs ml-1">({a.lessonsUsed} 课时)</span>
                    ) : null}
                    <p className="text-gray-darker mt-0.5">{a.content}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void removeAttendance(a.id)}
                    className="text-xs text-red-600 shrink-0"
                  >
                    删除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-3 py-3 ${
        highlight ? "border-amber-300 bg-amber-50" : "border-gray-lighter bg-white"
      }`}
    >
      <p className="text-xs text-gray uppercase tracking-widest">{label}</p>
      <p className="font-display text-2xl text-gray-darkest mt-1">{value}</p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  min,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  min?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-gray-darker">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        min={min}
        step={step}
        className="mt-1 w-full rounded-md border border-gray-lighter px-3 py-2"
      />
    </label>
  );
}