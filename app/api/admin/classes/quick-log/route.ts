import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { createAttendance, getStudent } from "@/lib/crm/db";

export const runtime = "nodejs";

/**
 * Quick-log endpoint for the daily class page.
 * POST /api/admin/classes/quick-log
 * Body: { studentId, date, content?, lessonsUsed?, priceOverride?, startTime?, durationMinutes? }
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const studentId = typeof body.studentId === "string" ? body.studentId.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  if (!studentId) {
    return NextResponse.json({ error: "studentId is required" }, { status: 400 });
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  }

  const student = await getStudent(studentId);
  if (!student) {
    return NextResponse.json({ error: "student not found" }, { status: 404 });
  }

  const content = typeof body.content === "string" && body.content.trim() !== ""
    ? body.content.trim()
    : "Class attendance";

  const lessonsUsed = Number(body.lessonsUsed ?? 1);
  if (Number.isNaN(lessonsUsed) || lessonsUsed < 1) {
    return NextResponse.json({ error: "lessonsUsed must be at least 1" }, { status: 400 });
  }

  const durationMinutes = body.durationMinutes != null ? Number(body.durationMinutes) : 60;
  if (Number.isNaN(durationMinutes) || durationMinutes < 1) {
    return NextResponse.json({ error: "durationMinutes invalid" }, { status: 400 });
  }

  const startTime = typeof body.startTime === "string" && body.startTime !== ""
    ? body.startTime
    : undefined;

  const priceOverride =
    body.priceOverride === null || body.priceOverride === undefined || body.priceOverride === ""
      ? undefined
      : Number(body.priceOverride);
  if (priceOverride !== undefined && Number.isNaN(priceOverride)) {
    return NextResponse.json({ error: "priceOverride invalid" }, { status: 400 });
  }

  const attendance = await createAttendance(studentId, {
    date,
    content,
    lessonsUsed,
    durationMinutes,
    startTime,
    priceOverride,
    imagePaths: [],
  });

  return NextResponse.json({ attendance }, { status: 201 });
}
