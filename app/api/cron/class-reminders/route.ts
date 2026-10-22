import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { listStudents } from "@/lib/crm/db";
import { sendBulkReminderSms } from "@/lib/crm/sms-agent";
import { getSupabaseAdmin } from "@/lib/crm/supabase-client";
import { listWebsiteClasses, type WebsiteClass } from "@/lib/crm/website-classes";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const TIME_ZONE = "America/New_York";
const CHINESE_WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const ENGLISH_WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function localDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function timeToMinutes(value: string): number | undefined {
  const normalized = value.trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/);
  if (!match) return undefined;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (minute > 59 || hour > 23) return undefined;
  if (match[3]) {
    if (hour < 1 || hour > 12) return undefined;
    hour = (hour % 12) + (match[3] === "PM" ? 12 : 0);
  }
  return hour * 60 + minute;
}

function formatTime(minutes: number) {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function parseTimeRange(value: string) {
  const [startRaw, endRaw] = value.replaceAll("—", "–").replaceAll("-", "–").split("–").map((part) => part.trim());
  if (!startRaw || !endRaw) return undefined;
  const end = timeToMinutes(endRaw);
  if (end === undefined) return undefined;
  let start: number | undefined;
  if (!/\b[AP]M\b/i.test(startRaw) && /\b[AP]M\b/i.test(endRaw)) {
    start = timeToMinutes(`${startRaw} ${endRaw.match(/([AP]M)\b/i)?.[1] ?? ""}`);
  } else {
    start = timeToMinutes(startRaw);
  }
  if (start === undefined) return undefined;
  return { start, end };
}

function formatTimeRange(value: string) {
  const range = parseTimeRange(value);
  if (!range) return value;
  const start = formatTime(range.start);
  const end = formatTime(range.end);
  const startWithoutSuffix = start.replace(/\s+(AM|PM)$/, "");
  const sameSuffix = start.endsWith(end.slice(-2));
  return sameSuffix ? `${startWithoutSuffix}–${end}` : `${start}–${end}`;
}

function findClass(classes: WebsiteClass[], day: string, time: string) {
  const target = parseTimeRange(time);
  if (!target) return undefined;
  return classes.find((item) => {
    if (item.day !== day) return false;
    const candidate = parseTimeRange(`${item.startTime}–${item.endTime}`);
    return candidate?.start === target.start && candidate.end === target.end;
  });
}

function formatClassDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const local = localDateParts(now);
  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";
  if (local.hour !== "20" && !dryRun) {
    return NextResponse.json({ skipped: true, reason: "Not 8 PM America/New_York" });
  }

  const localTomorrow = new Date(Date.UTC(Number(local.year), Number(local.month) - 1, Number(local.day) + 1));
  const classDate = localTomorrow.toISOString().slice(0, 10);
  const classDay = CHINESE_WEEKDAYS[localTomorrow.getUTCDay()];
  const messageType = `class_reminder:${classDate}`;
  const [allStudents, websiteClasses] = await Promise.all([listStudents(), listWebsiteClasses()]);
  const students = allStudents.filter(
    (student) => student.status === "active" && Boolean(student.parentPhone)
  );

  const { data: priorLogs, error: logError } = await getSupabaseAdmin()
    .from("sms_message_logs")
    .select("student_id,message_type,body")
    .eq("direction", "outbound")
    .gte("created_at", new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString())
    .neq("status", "failed");
  if (logError) return NextResponse.json({ error: logError.message }, { status: 500 });
  const alreadySent = new Set(
    (priorLogs ?? [])
      .filter((row) => row.message_type === messageType || /\b(reminder|tomorrow)\b/i.test(String(row.body ?? "")))
      .map((row) => String(row.student_id))
  );
  const grouped = new Map<string, { studentIds: string[]; title?: string; time: string }>();
  const englishClassDay = ENGLISH_WEEKDAYS[localTomorrow.getUTCDay()];

  for (const student of students) {
    if (alreadySent.has(student.id)) continue;
    const times = student.classDays
      .map((day, index) => day === classDay ? student.classTimeSlots[index] : "")
      .filter(Boolean);
    if (!times.length) continue;
    for (const time of Array.from(new Set(times))) {
      const matchedClass = findClass(websiteClasses, englishClassDay, time);
      const key = `${matchedClass?.title ?? ""}|${time}`;
      const group = grouped.get(key) ?? { studentIds: [], title: matchedClass?.title, time };
      group.studentIds.push(student.id);
      grouped.set(key, group);
    }
  }

  const eligible = Array.from(grouped.values()).reduce((sum, group) => sum + group.studentIds.length, 0);
  if (dryRun) {
    return NextResponse.json({ dryRun: true, classDate, classDay, eligible, alreadySent: alreadySent.size });
  }

  let sent = 0;
  let failed = 0;
  for (const { studentIds, title, time } of Array.from(grouped.values())) {
    const classDescription = title ? ` has ${title}` : " has class";
    const result = await sendBulkReminderSms(
      studentIds,
      `Luna Art Studio: Reminder—{{student_name}}${classDescription} tomorrow, ${formatClassDate(localTomorrow)}, from ${formatTimeRange(time)}. We look forward to seeing you! Reply STOP to opt out.`,
      messageType
    );
    sent += result.sent;
    failed += result.failed;
  }

  return NextResponse.json({ classDate, classDay, eligible, sent, failed });
}
