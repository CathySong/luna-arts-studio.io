import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { listStudents } from "@/lib/crm/db";
import { sendBulkReminderSms } from "@/lib/crm/sms-agent";
import { getSupabaseAdmin } from "@/lib/crm/supabase-client";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const TIME_ZONE = "America/New_York";
const CHINESE_WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

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
  const students = (await listStudents()).filter(
    (student) => student.status === "active" && Boolean(student.parentPhone)
  );

  const { data: priorLogs, error: logError } = await getSupabaseAdmin()
    .from("sms_message_logs")
    .select("student_id")
    .eq("message_type", messageType)
    .neq("status", "failed");
  if (logError) return NextResponse.json({ error: logError.message }, { status: 500 });
  const alreadySent = new Set((priorLogs ?? []).map((row) => String(row.student_id)));
  const grouped = new Map<string, string[]>();

  for (const student of students) {
    if (alreadySent.has(student.id)) continue;
    const times = student.classDays
      .map((day, index) => day === classDay ? student.classTimeSlots[index] : "")
      .filter(Boolean);
    if (!times.length) continue;
    const timeLabel = Array.from(new Set(times)).join(" and ");
    grouped.set(timeLabel, [...(grouped.get(timeLabel) ?? []), student.id]);
  }

  const eligible = Array.from(grouped.values()).reduce((sum, ids) => sum + ids.length, 0);
  if (dryRun) {
    return NextResponse.json({ dryRun: true, classDate, classDay, eligible, alreadySent: alreadySent.size });
  }

  let sent = 0;
  let failed = 0;
  for (const [timeLabel, studentIds] of Array.from(grouped.entries())) {
    const result = await sendBulkReminderSms(
      studentIds,
      `Luna Art Studio: Reminder: {{student_name}} has class tomorrow at ${timeLabel}. Reply STOP to opt out.`,
      messageType
    );
    sent += result.sent;
    failed += result.failed;
  }

  return NextResponse.json({ classDate, classDay, eligible, sent, failed });
}
