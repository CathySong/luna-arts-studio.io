"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AttendanceReview,
  ClassAttendance,
  ClassReview,
  ClassSession,
  PaymentRecord,
  StudentEnrollmentSummary,
} from "@/lib/crm/types";

type ReviewEntry = {
  review: ClassReview;
  session: ClassSession | null;
  artworks: Array<{ id: string; imagePath: string; title?: string }>;
};

type RecordData = {
  payments: PaymentRecord[];
  attendances: ClassAttendance[];
  summary: StudentEnrollmentSummary;
  reviews: ReviewEntry[];
};

type Props = { studentId: string };

const STATUS_LABEL: Record<ClassReview["status"], string> = {
  draft: "草稿",
  generated: "已生成",
  approved: "已批准",
};

const REVIEW_STATUS_LABEL = STATUS_LABEL;

export default function StudentRecordPanel({ studentId }: Props) {
  const router = useRouter();
  const [data, setData] = useState<RecordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyReviewId, setBusyReviewId] = useState<string | null>(null);
  const [busyAttendanceId, setBusyAttendanceId] = useState<string | null>(null);
  const [defaultPrompt, setDefaultPrompt] = useState("");
  const [submittingAttendance, setSubmittingAttendance] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/students/${studentId}/record`, {
      credentials: "include",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error ?? "加载失败");
      setLoading(false);
      return;
    }
    setData({
      payments: json.payments ?? [],
      attendances: json.attendances ?? [],
      summary: json.summary,
      reviews: json.reviews ?? [],
    });
    setLoading(false);
  }, [studentId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void (async () => {
      const res = await fetch(
        `/api/admin/students/${studentId}/attendances/review-prompt`,
        { credentials: "include" }
      );
      const json = await res.json().catch(() => ({}));
      if (res.ok && typeof json.prompt === "string") {
        setDefaultPrompt(json.prompt);
      }
    })();
  }, [studentId]);

  async function addAttendance(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmittingAttendance(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("generateReview", fd.get("generateReview") ? "true" : "false");

    const res = await fetch(`/api/admin/students/${studentId}/attendances`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const json = await res.json().catch(() => ({}));
    setSubmittingAttendance(false);

    if (!res.ok) {
      alert(json.error ?? "添加失败");
      return;
    }
    if (json.reviewError) {
      alert(`上课记录已保存，但点评生成失败：${json.reviewError}`);
    }
    form.reset();
    const fileInput = form.querySelector<HTMLInputElement>('input[name="files"]');
    if (fileInput) fileInput.value = "";
    await load();
    router.refresh();
  }

  async function regenerateAttendanceReview(attendanceId: string, customPrompt?: string) {
    setBusyAttendanceId(attendanceId);
    const res = await fetch(
      `/api/admin/students/${studentId}/attendances/${attendanceId}/review`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customPrompt: customPrompt || undefined }),
      }
    );
    setBusyAttendanceId(null);
    if (!res.ok) {
      alert((await res.json().catch(() => ({}))).error ?? "重新生成失败");
      return;
    }
    await load();
    router.refresh();
  }

  async function approveAttendanceReview(attendanceId: string) {
    await fetch(
      `/api/admin/students/${studentId}/attendances/${attendanceId}/review`,
      { method: "PATCH", credentials: "include" }
    );
    await load();
    router.refresh();
  }

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
      alert((await res.json().catch(() => ({}))).error ?? "添加失败");
      return;
    }
    e.currentTarget.reset();
    await load();
    router.refresh();
  }

  async function regenerateReview(reviewId: string) {
    setBusyReviewId(reviewId);
    const res = await fetch(`/api/admin/reviews/${reviewId}/regenerate`, {
      method: "POST",
      credentials: "include",
    });
    setBusyReviewId(null);
    if (!res.ok) {
      alert((await res.json().catch(() => ({}))).error ?? "重新生成失败");
      return;
    }
    await load();
    router.refresh();
  }

  async function approveReview(reviewId: string) {
    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    await load();
  }

  if (loading) return <p className="text-sm text-gray-dark">加载学生档案…</p>;
  if (error || !data) return <p className="text-sm text-red-700">{error || "无数据"}</p>;

  const today = new Date().toISOString().slice(0, 10);
  const { summary, attendances, reviews, payments } = data;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="总课时" value={String(summary.totalLessons)} />
        <Stat label="已上课时" value={String(summary.usedLessons)} />
        <Stat
          label="剩余课时"
          value={String(summary.remainingLessons)}
          highlight={summary.remainingLessons <= 2}
        />
        <Stat label="课堂点评" value={String(reviews.length)} />
      </div>

      {/* 上课 Log */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h3 className="font-display text-xl text-gray-darkest">上课记录</h3>
          <span className="text-xs text-gray-dark">{attendances.length} 条记录</span>
        </div>

        <form
          onSubmit={addAttendance}
          encType="multipart/form-data"
          className="space-y-3 text-sm border border-gray-lighter rounded-lg p-4 bg-gray-lightest/40 max-w-2xl"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="上课日期" name="date" type="date" defaultValue={today} required />
            <Field label="消耗课时" name="lessonsUsed" type="number" min="1" defaultValue="1" />
          </div>
          <Field label="课程主题" name="lessonTheme" placeholder="例如：水彩风景写生" />
          <Field
            label="所学技法"
            name="techniquesLearned"
            placeholder="例如：湿画法、远近景构图、调色"
          />
          <label className="block">
            <span className="text-xs text-gray-darker">上课内容摘要</span>
            <textarea
              name="content"
              required
              rows={2}
              placeholder="简要描述本节课做了什么"
              className="mt-1 w-full rounded-md border border-gray-lighter px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-darker">课堂作品照片（可多选）</span>
            <input
              name="files"
              type="file"
              accept="image/*"
              multiple
              className="mt-1 w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-gray-lighter file:px-3 file:py-1.5"
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-darker">
              AI 点评 Prompt（留空用默认；全局模板见{" "}
              <code className="text-[11px] bg-gray-lighter px-1 rounded">
                lib/crm/prompts/attendance-review.md
              </code>
              ）
            </span>
            <textarea
              name="customPrompt"
              key={defaultPrompt ? "loaded" : "loading"}
              defaultValue={defaultPrompt}
              rows={6}
              placeholder="加载默认 prompt…"
              className="mt-1 w-full rounded-md border border-gray-lighter px-3 py-2 font-mono text-xs leading-relaxed"
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="generateReview"
              defaultChecked
              className="rounded border-gray-light"
            />
            <span className="text-sm text-gray-darker">
              保存后自动生成 AI 课堂点评（结合学生档案与照片）
            </span>
          </label>
          <button
            type="submit"
            disabled={submittingAttendance}
            className="rounded-md bg-gray-darkest text-white px-4 py-2 text-sm hover:bg-gray-darker disabled:opacity-50"
          >
            {submittingAttendance ? "保存并生成中…" : "添加上课记录"}
          </button>
        </form>

        {attendances.length === 0 ? (
          <p className="text-sm text-gray-dark">暂无上课记录</p>
        ) : (
          <ol className="relative border-l border-gray-lighter ml-3 space-y-6">
            {attendances.map((a) => (
              <li key={a.id} className="ml-6 space-y-3">
                <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-accent-warm border-2 border-white" />
                <div>
                  <time className="text-xs font-mono text-gray-dark">{a.date}</time>
                  {a.lessonsUsed > 1 ? (
                    <span className="text-xs text-gray ml-2">· {a.lessonsUsed} 课时</span>
                  ) : null}
                  {a.lessonTheme ? (
                    <p className="text-sm font-medium text-gray-darkest mt-1">{a.lessonTheme}</p>
                  ) : null}
                  <p className="text-sm text-gray-darker mt-0.5">{a.content}</p>
                  {a.techniquesLearned ? (
                    <p className="text-xs text-gray-dark mt-1">技法：{a.techniquesLearned}</p>
                  ) : null}
                </div>
                {(a.imagePaths?.length ?? 0) > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {a.imagePaths.map((src) => (
                      <div
                        key={src}
                        className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-lighter"
                      >
                        <Image
                          src={src}
                          alt="课堂作品"
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
                {a.review ? (
                  <AttendanceReviewCard
                    review={a.review}
                    busy={busyAttendanceId === a.id}
                    onRegenerate={() => {
                      const prompt = window.prompt(
                        "可选：输入自定义 Prompt（留空用默认）",
                        a.review?.systemPrompt ?? ""
                      );
                      if (prompt === null) return;
                      void regenerateAttendanceReview(a.id, prompt || undefined);
                    }}
                    onApprove={() => void approveAttendanceReview(a.id)}
                  />
                ) : (
                  <button
                    type="button"
                    disabled={busyAttendanceId === a.id}
                    onClick={() => void regenerateAttendanceReview(a.id)}
                    className="text-xs border border-gray-light px-3 py-1.5 rounded-lg hover:border-accent-warm disabled:opacity-50"
                  >
                    {busyAttendanceId === a.id ? "生成中…" : "生成 AI 点评"}
                  </button>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* 课堂点评 */}
      <section className="space-y-4 border-t border-gray-lighter pt-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h3 className="font-display text-xl text-gray-darkest">课堂点评</h3>
          <span className="text-xs text-gray-dark">
            可在上方「上课记录」中上传照片自动生成，或在{" "}
            <Link href="/admin/sessions" className="text-accent-warm hover:underline">
              课堂场次
            </Link>{" "}
            批量生成
          </span>
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-dark bg-gray-lightest rounded-lg px-4 py-3">
            暂无课堂点评。请先在课堂场次中上传该学生的作品，再点击生成评语。
          </p>
        ) : (
          <ul className="space-y-6">
            {reviews.map(({ review, session, artworks }) => (
              <li
                key={review.id}
                className="border border-gray-lighter rounded-xl p-5 bg-white space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-darkest">
                      {session?.title ?? "未知课堂"}
                    </p>
                    <p className="text-xs text-gray-dark mt-0.5">
                      {session?.date ?? "—"} · {session?.classType ?? "—"} · v{review.version}{" "}
                      · {STATUS_LABEL[review.status]}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {session ? (
                      <Link
                        href={`/admin/sessions/${session.id}`}
                        className="text-xs border border-gray-light px-3 py-1.5 rounded-lg hover:border-accent-warm"
                      >
                        查看课堂
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      disabled={busyReviewId === review.id}
                      onClick={() => void regenerateReview(review.id)}
                      className="text-xs border border-gray-light px-3 py-1.5 rounded-lg hover:border-accent-warm disabled:opacity-50"
                    >
                      {busyReviewId === review.id ? "生成中…" : "重新生成"}
                    </button>
                    {review.status !== "approved" ? (
                      <button
                        type="button"
                        onClick={() => void approveReview(review.id)}
                        className="text-xs bg-accent-warm px-3 py-1.5 rounded-lg text-gray-darkest"
                      >
                        批准
                      </button>
                    ) : null}
                  </div>
                </div>

                {artworks.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {artworks.map((art) => (
                      <div
                        key={art.id}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-lighter"
                      >
                        <Image
                          src={art.imagePath}
                          alt={art.title ?? "Artwork"}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                <p className="text-sm text-gray-darkest leading-relaxed whitespace-pre-wrap">
                  {review.content}
                </p>
                <p className="text-xs text-gray">
                  生成于 {new Date(review.generatedAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 付款 */}
      <section className="space-y-4 border-t border-gray-lighter pt-8">
        <h3 className="font-display text-xl text-gray-darkest">付款记录</h3>
        <form
          onSubmit={addPayment}
          className="space-y-3 text-sm border border-gray-lighter rounded-lg p-4 bg-gray-lightest/40 max-w-xl"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="付款日期" name="paidAt" type="date" defaultValue={today} required />
            <Field label="金额 ($)" name="amount" type="number" step="0.01" min="0" required />
          </div>
          <Field label="购买课时数" name="lessonsPurchased" type="number" min="1" defaultValue="8" required />
          <Field label="备注" name="notes" />
          <button
            type="submit"
            className="rounded-md bg-accent-warm px-4 py-2 text-sm font-medium text-gray-darkest"
          >
            添加付款
          </button>
        </form>
        {payments.length === 0 ? (
          <p className="text-sm text-gray-dark">暂无付款记录</p>
        ) : (
          <ul className="space-y-2 max-w-xl">
            {payments.map((p) => (
              <li
                key={p.id}
                className="text-sm border border-gray-lighter rounded-lg px-3 py-2 flex justify-between"
              >
                <span>
                  {p.paidAt} · ${p.amount.toFixed(2)} · {p.lessonsPurchased} 课时
                  {p.notes ? ` · ${p.notes}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-gray-dark">累计付款 ${summary.totalPaid.toFixed(2)}</p>
      </section>
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

function AttendanceReviewCard({
  review,
  busy,
  onRegenerate,
  onApprove,
}: {
  review: AttendanceReview;
  busy: boolean;
  onRegenerate: () => void;
  onApprove: () => void;
}) {
  return (
    <div className="rounded-lg border border-accent-warm/30 bg-accent-warm/5 p-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-darkest">
          AI 课堂点评 · v{review.version} · {REVIEW_STATUS_LABEL[review.status]}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={onRegenerate}
            className="text-xs border border-gray-light px-2 py-1 rounded hover:border-accent-warm disabled:opacity-50"
          >
            {busy ? "生成中…" : "重新生成"}
          </button>
          {review.status !== "approved" ? (
            <button
              type="button"
              onClick={onApprove}
              className="text-xs bg-accent-warm px-2 py-1 rounded text-gray-darkest"
            >
              批准
            </button>
          ) : null}
        </div>
      </div>
      <p className="text-sm text-gray-darkest leading-relaxed whitespace-pre-wrap">
        {review.content}
      </p>
      <p className="text-xs text-gray">
        生成于 {new Date(review.generatedAt).toLocaleString()}
      </p>
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
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  min?: string;
  step?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-gray-lighter px-3 py-2"
      />
    </label>
  );
}
