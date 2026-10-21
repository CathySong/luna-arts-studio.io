"use client";

import { useState } from "react";
import type { WebsiteClass } from "@/lib/crm/website-classes";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const emptyClass: Omit<WebsiteClass, "id"> = { day: "Wednesday", dayShort: "Wed", title: "", ages: "", startTime: "", endTime: "", durationMinutes: 90, active: true, sortOrder: 0 };

export default function WebsiteClassesManager({ initialClasses }: { initialClasses: WebsiteClass[] }) {
  const [items, setItems] = useState(initialClasses);
  const [draft, setDraft] = useState(emptyClass);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function request(url: string, method: string, body?: unknown) {
    const res = await fetch(url, { method, credentials: "include", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Unable to save");
    return data;
  }

  async function add() {
    setBusy("new"); setError(null);
    try {
      const data = await request("/api/admin/website-classes", "POST", draft);
      setItems((current) => [...current, data.class]);
      setDraft(emptyClass);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save"); }
    finally { setBusy(null); }
  }

  async function save(item: WebsiteClass) {
    setBusy(item.id); setError(null);
    try {
      const data = await request(`/api/admin/website-classes/${item.id}`, "PUT", item);
      setItems((current) => current.map((row) => row.id === item.id ? data.class : row));
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save"); }
    finally { setBusy(null); }
  }

  async function remove(item: WebsiteClass) {
    if (!window.confirm(`Delete ${item.title}?`)) return;
    setBusy(item.id); setError(null);
    try {
      await request(`/api/admin/website-classes/${item.id}`, "DELETE");
      setItems((current) => current.filter((row) => row.id !== item.id));
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to delete"); }
    finally { setBusy(null); }
  }

  const update = (id: string, patch: Partial<WebsiteClass>) => setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  const fields = (item: Omit<WebsiteClass, "id">, change: (patch: Partial<WebsiteClass>) => void) => (
    <>
      <select value={item.day} onChange={(e) => change({ day: e.target.value })} className="rounded-md border border-gray-lighter px-2 py-2"><>{DAYS.map((day) => <option key={day}>{day}</option>)}</></select>
      <input value={item.title} onChange={(e) => change({ title: e.target.value })} placeholder="Class name" className="rounded-md border border-gray-lighter px-3 py-2" />
      <input value={item.ages ?? ""} onChange={(e) => change({ ages: e.target.value })} placeholder="Ages 5–9" className="rounded-md border border-gray-lighter px-3 py-2" />
      <input value={item.startTime} onChange={(e) => change({ startTime: e.target.value })} placeholder="5:30 PM" className="rounded-md border border-gray-lighter px-3 py-2" />
      <input value={item.endTime} onChange={(e) => change({ endTime: e.target.value })} placeholder="7:00 PM" className="rounded-md border border-gray-lighter px-3 py-2" />
      <label className="flex items-center gap-2 px-2 text-sm"><input type="checkbox" checked={item.active} onChange={(e) => change({ active: e.target.checked })} /> Active</label>
    </>
  );

  return <div className="space-y-5">
    {error ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}
    <section className="rounded-xl border border-accent-warm/30 bg-accent-warm/5 p-4">
      <h2 className="mb-3 font-medium">Add a class</h2>
      <div className="grid gap-3 md:grid-cols-6">{fields(draft, (patch) => setDraft((value) => ({ ...value, ...patch })))} </div>
      <button onClick={() => void add()} disabled={busy === "new" || !draft.title || !draft.startTime || !draft.endTime} className="mt-4 rounded-md bg-accent-warm px-5 py-2 text-sm font-medium disabled:opacity-50">{busy === "new" ? "Adding…" : "Add class"}</button>
    </section>
    <div className="space-y-3">{items.map((item) => <div key={item.id} className="rounded-xl border border-gray-lighter bg-white p-4 card-shadow">
      <div className="grid gap-3 md:grid-cols-6">{fields(item, (patch) => update(item.id, patch))}</div>
      <div className="mt-3 flex gap-3"><button onClick={() => void save(item)} disabled={busy === item.id} className="rounded-md bg-gray-darkest px-4 py-2 text-xs text-white disabled:opacity-50">{busy === item.id ? "Saving…" : "Save"}</button><button onClick={() => void remove(item)} disabled={busy === item.id} className="rounded-md border border-red-200 px-4 py-2 text-xs text-red-700">Delete</button></div>
    </div>)}</div>
  </div>;
}
