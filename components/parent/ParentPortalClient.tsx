"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { StudentEnrollmentBundle } from "@/lib/crm/db";

type Child = { id: string; name: string; age: number | null; parentName: string | null; classDays: string[]; classTimeSlots: string[]; enrollment: StudentEnrollmentBundle };

export default function ParentPortalClient({ email, students }: { email: string; students: Child[] }) {
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function requestRenewal(child: Child) {
    setBusyId(child.id);
    setStatus("");
    const res = await fetch("/api/parent/renewal-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId: child.id }) });
    const body = await res.json().catch(() => ({}));
    setBusyId(null);
    setStatus(res.ok ? `已提交 ${child.name} 的续报申请，工作室会联系你确认。` : body.error ?? "提交失败");
  }

  async function signOut() { await createClient().auth.signOut(); window.location.href = "/parent/login"; }

  return <main className="min-h-screen bg-white-warm px-6 py-10"><div className="mx-auto max-w-5xl"><header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"><div><p className="text-xs uppercase tracking-ultra text-accent-warm">Luna Parent Portal</p><h1 className="mt-2 font-display text-4xl text-gray-darkest">我的孩子</h1><p className="mt-2 text-sm text-gray-darker">{email}</p></div><button onClick={() => void signOut()} className="text-sm text-gray-dark hover:text-accent-warm">退出登录</button></header>
    {status ? <div className="mt-6 rounded-md border border-accent-warm/50 bg-accent-warm/10 px-4 py-3 text-sm text-gray-darkest">{status}</div> : null}
    {students.length === 0 ? <div className="mt-8 rounded-xl border border-gray-lighter bg-white p-8 card-shadow"><h2 className="font-display text-2xl text-gray-darkest">还没有关联的孩子</h2><p className="mt-2 text-sm text-gray-darker">请使用报名时提供给工作室的家长邮箱注册，或联系工作室绑定学生档案。</p></div> : <div className="mt-8 grid gap-6 md:grid-cols-2">{students.map((child) => { const { summary, attendances } = child.enrollment; return <section key={child.id} className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow"><div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-2xl text-gray-darkest">{child.name}</h2><p className="mt-1 text-sm text-gray-darker">{child.age ? `${child.age} 岁 · ` : ""}{child.classDays.join("、") || "课程时间待确认"}{child.classTimeSlots.length ? ` · ${child.classTimeSlots.join("、")}` : ""}</p></div><span className="rounded-full bg-accent-warm/15 px-3 py-1 text-xs text-gray-darkest">在读</span></div><div className="mt-6 grid grid-cols-3 gap-2"><Stat label="剩余课时" value={String(summary.remainingLessons)} /><Stat label="已上课时" value={String(summary.usedLessons)} /><Stat label="累计付款" value={`$${summary.totalPaid.toFixed(0)}`} /></div><div className="mt-6"><h3 className="text-sm font-medium text-gray-darkest">最近上课</h3>{attendances.slice(0, 3).length ? <ul className="mt-2 space-y-2">{attendances.slice(0, 3).map((a) => <li key={a.id} className="border-t border-gray-lighter pt-2 text-sm"><span className="text-gray-dark">{a.date}</span><p className="mt-0.5 text-gray-darker">{a.content}</p></li>)}</ul> : <p className="mt-2 text-sm text-gray-dark">暂无上课记录</p>}</div><button onClick={() => void requestRenewal(child)} disabled={busyId === child.id} className="mt-6 w-full rounded-md bg-accent-warm px-4 py-3 text-sm font-medium text-gray-darkest disabled:opacity-60">{busyId === child.id ? "提交中…" : "申请续报"}</button></section>; })}</div>}
  </div></main>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-gray-lighter bg-white-warm px-3 py-3"><p className="text-[10px] uppercase tracking-wide text-gray">{label}</p><p className="mt-1 font-display text-xl text-gray-darkest">{value}</p></div>; }
