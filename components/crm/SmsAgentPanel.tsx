"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Consent = "unknown" | "opted_in" | "opted_out";
type Student = { id: string; name: string; parentName?: string; parentPhone?: string };
type Setting = {
  studentId: string;
  enabled: boolean;
  consentStatus: Consent;
  initialMessage: string;
  lastSentAt?: string;
};
type Log = {
  id: string;
  studentId?: string;
  phone: string;
  direction: "inbound" | "outbound";
  body: string;
  status: string;
  createdAt: string;
};
type Row = Student & Setting;
type ApiData = { students: Student[]; settings: Setting[]; logs: Log[]; defaultTemplate: string };

function buildRows(data: ApiData): Row[] {
  const settings = new Map(data.settings.map((item) => [item.studentId, item]));
  return data.students.map((student) => ({
    ...student,
    studentId: student.id,
    enabled: settings.get(student.id)?.enabled ?? false,
    consentStatus: settings.get(student.id)?.consentStatus ?? "unknown",
    initialMessage: settings.get(student.id)?.initialMessage || data.defaultTemplate,
    lastSentAt: settings.get(student.id)?.lastSentAt,
  }));
}

export default function SmsAgentPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState<Record<string, string>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    const res = await fetch("/api/admin/sms-agent", { cache: "no-store" });
    const data = (await res.json()) as ApiData & { error?: string };
    if (!res.ok) {
      setError(data.error || "Unable to load SMS Agent");
    } else {
      if (!quiet) setRows(buildRows(data));
      setLogs(data.logs);
      setError("");
    }
    if (!quiet) setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(true), 10000);
    return () => clearInterval(interval);
  }, [load]);

  async function save(row: Row) {
    setSaveState((current) => ({ ...current, [row.id]: "Saving…" }));
    const res = await fetch("/api/admin/sms-agent", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: row.id,
        parentName: row.parentName || "",
        parentPhone: row.parentPhone || "",
        enabled: row.enabled,
        consentStatus: row.consentStatus,
        initialMessage: row.initialMessage,
      }),
    });
    const data = (await res.json()) as { error?: string };
    setSaveState((current) => ({
      ...current,
      [row.id]: res.ok ? "Saved" : data.error || "Save failed",
    }));
  }

  function update(id: string, patch: Partial<Row>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
    setSaveState((current) => ({ ...current, [id]: "Unsaved" }));
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => {
      const next = rowsRef.current.find((row) => row.id === id);
      if (next) void save(next);
    }, 700);
  }

  async function sendInitial(row: Row) {
    if (!window.confirm(`Send the initial SMS to ${row.parentPhone || "this student"}?`)) return;
    await save(row);
    setSaveState((current) => ({ ...current, [row.id]: "Sending…" }));
    const res = await fetch("/api/admin/sms-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: row.id }),
    });
    const data = (await res.json()) as { error?: string };
    setSaveState((current) => ({
      ...current,
      [row.id]: res.ok ? "Sent" : data.error || "Send failed",
    }));
    if (res.ok) void load(true);
  }

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? rows.filter((row) => `${row.name} ${row.parentName || ""} ${row.parentPhone || ""}`.toLowerCase().includes(q))
      : rows;
  }, [rows, search]);
  const studentNames = useMemo(() => new Map(rows.map((row) => [row.id, row.name])), [rows]);

  if (loading) return <div className="rounded-xl border border-gray-lighter bg-white p-8 text-sm text-gray-darker">Loading SMS Agent…</div>;

  return (
    <section className="space-y-5 rounded-xl border border-gray-lighter bg-white p-5 md:p-7 card-shadow">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="font-display text-2xl text-gray-darkest">SMS Agent</div>
          <p className="mt-1 text-sm text-gray-darker">
            Edit the contact list and first message. Changes autosave to Supabase; message logs refresh every 10 seconds.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-darker">Live sync</span>
          <button type="button" onClick={() => void load()} className="ml-2 rounded-md border border-gray-lighter px-3 py-1.5 text-xs hover:border-accent-warm">
            Refresh
          </button>
        </div>
      </div>

      {error ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}. Run the SMS Agent Supabase migration, then refresh.</div> : null}

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search student, parent, or phone…"
        className="w-full max-w-md rounded-md border border-gray-lighter px-3 py-2 text-sm outline-none focus:border-accent-warm"
      />

      <div className="overflow-x-auto rounded-lg border border-gray-lighter">
        <table className="min-w-[1120px] w-full text-sm">
          <thead className="bg-white-warm text-left text-xs uppercase tracking-wide text-gray-dark">
            <tr>
              <th className="px-3 py-3">Active</th><th className="px-3 py-3">Student</th><th className="px-3 py-3">Parent</th>
              <th className="px-3 py-3">Phone</th><th className="px-3 py-3">Consent</th><th className="px-3 py-3 min-w-[360px]">Initial message template</th><th className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id} className="border-t border-gray-lighter align-top">
                <td className="px-3 py-3"><input type="checkbox" checked={row.enabled} onChange={(e) => update(row.id, { enabled: e.target.checked })} aria-label={`Enable SMS for ${row.name}`} /></td>
                <td className="px-3 py-3 font-medium text-gray-darkest">{row.name}</td>
                <td className="px-3 py-3"><input value={row.parentName || ""} onChange={(e) => update(row.id, { parentName: e.target.value })} className="w-36 rounded border border-gray-lighter px-2 py-1.5 outline-none focus:border-accent-warm" /></td>
                <td className="px-3 py-3"><input value={row.parentPhone || ""} onChange={(e) => update(row.id, { parentPhone: e.target.value })} placeholder="+1…" className="w-36 rounded border border-gray-lighter px-2 py-1.5 outline-none focus:border-accent-warm" /></td>
                <td className="px-3 py-3">
                  <select value={row.consentStatus} onChange={(e) => update(row.id, { consentStatus: e.target.value as Consent })} className="rounded border border-gray-lighter px-2 py-1.5 outline-none focus:border-accent-warm">
                    <option value="unknown">Unknown</option><option value="opted_in">Opted in</option><option value="opted_out">Opted out</option>
                  </select>
                </td>
                <td className="px-3 py-3">
                  <textarea value={row.initialMessage} onChange={(e) => update(row.id, { initialMessage: e.target.value })} rows={3} className="w-full resize-y rounded border border-gray-lighter px-2 py-1.5 text-xs leading-5 outline-none focus:border-accent-warm" />
                  <div className="mt-1 text-[11px] text-gray-dark">Tokens: {"{{student_name}}"}, {"{{parent_name}}"}</div>
                </td>
                <td className="px-3 py-3">
                  <button type="button" disabled={!row.parentPhone || row.consentStatus === "opted_out"} onClick={() => void sendInitial(row)} className="whitespace-nowrap rounded-md bg-accent-warm px-3 py-1.5 text-xs font-medium text-gray-darkest disabled:cursor-not-allowed disabled:opacity-40">Send initial</button>
                  <div className={`mt-2 max-w-32 text-[11px] ${saveState[row.id]?.includes("failed") ? "text-red-600" : "text-gray-dark"}`}>{saveState[row.id] || (row.lastSentAt ? `Sent ${new Date(row.lastSentAt).toLocaleDateString()}` : "Ready")}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-3">
        <div className="font-display text-xl text-gray-darkest">Message log</div>
        <p className="mt-1 text-xs text-gray-darker">Inbound messages, automated replies, and initial sends synced from Twilio.</p>
        <div className="mt-3 max-h-80 overflow-auto rounded-lg border border-gray-lighter">
          <table className="w-full min-w-[760px] text-xs">
            <thead className="sticky top-0 bg-white-warm text-left uppercase tracking-wide text-gray-dark"><tr><th className="px-3 py-2">Time</th><th className="px-3 py-2">Student</th><th className="px-3 py-2">Direction</th><th className="px-3 py-2">Message</th><th className="px-3 py-2">Status</th></tr></thead>
            <tbody>
              {logs.map((log) => <tr key={log.id} className="border-t border-gray-lighter"><td className="whitespace-nowrap px-3 py-2 text-gray-darker">{new Date(log.createdAt).toLocaleString()}</td><td className="px-3 py-2">{log.studentId ? studentNames.get(log.studentId) || log.phone : log.phone}</td><td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 ${log.direction === "inbound" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{log.direction}</span></td><td className="max-w-xl px-3 py-2 text-gray-darkest">{log.body}</td><td className="px-3 py-2 text-gray-darker">{log.status}</td></tr>)}
              {logs.length === 0 ? <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-dark">No SMS activity yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
