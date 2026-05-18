import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import {
  approveAttendanceReview,
  generateAttendanceReview,
} from "@/lib/crm/attendance-reviews";
import { getAttendance, getStudent } from "@/lib/crm/db";

type Params = { params: { id: string; attendanceId: string } };

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const student = await getStudent(params.id);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const row = await getAttendance(params.attendanceId);
  if (!row || row.studentId !== params.id) {
    return NextResponse.json({ error: "Attendance not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as { customPrompt?: string };

  try {
    const attendance = await generateAttendanceReview(params.attendanceId, {
      customPrompt:
        typeof body.customPrompt === "string" ? body.customPrompt : undefined,
    });
    return NextResponse.json({ attendance });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const row = await getAttendance(params.attendanceId);
  if (!row || row.studentId !== params.id) {
    return NextResponse.json({ error: "Attendance not found" }, { status: 404 });
  }

  const attendance = await approveAttendanceReview(params.attendanceId);
  if (!attendance) {
    return NextResponse.json({ error: "No review to approve" }, { status: 400 });
  }
  return NextResponse.json({ attendance });
}
