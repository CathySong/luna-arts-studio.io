import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { generateAttendanceReview } from "@/lib/crm/attendance-reviews";
import { createAttendance, getStudent, listAttendancesByStudent } from "@/lib/crm/db";
import { saveCrmImages } from "@/lib/crm/upload-image";
import type { AttendanceInput } from "@/lib/crm/types";

type Params = { params: { id: string } };

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const attendances = await listAttendancesByStudent(params.id);
  return NextResponse.json({ attendances });
}

export async function POST(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const student = await getStudent(params.id);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    return handleMultipartPost(req, params.id);
  }

  return handleJsonPost(req, params.id);
}

async function handleJsonPost(req: NextRequest, studentId: string) {
  const body = (await req.json()) as Partial<AttendanceInput>;
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const lessonsUsed = body.lessonsUsed !== undefined ? Number(body.lessonsUsed) : 1;
  if (Number.isNaN(lessonsUsed) || lessonsUsed < 1) {
    return NextResponse.json({ error: "lessonsUsed must be at least 1" }, { status: 400 });
  }

  const attendance = await createAttendance(studentId, {
    date,
    content,
    lessonsUsed,
    sessionId: body.sessionId,
    lessonTheme: body.lessonTheme,
    techniquesLearned: body.techniquesLearned,
    imagePaths: body.imagePaths ?? [],
  });

  return NextResponse.json({ attendance }, { status: 201 });
}

async function handleMultipartPost(req: NextRequest, studentId: string) {
  const fd = await req.formData();

  const date = readString(fd, "date");
  const content = readString(fd, "content");
  const lessonTheme = readString(fd, "lessonTheme");
  const techniquesLearned = readString(fd, "techniquesLearned");
  const customPrompt = readString(fd, "customPrompt");
  const generateReview = readBool(fd, "generateReview");

  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const lessonsUsed = Number(readString(fd, "lessonsUsed") || "1");
  if (Number.isNaN(lessonsUsed) || lessonsUsed < 1) {
    return NextResponse.json({ error: "lessonsUsed must be at least 1" }, { status: 400 });
  }

  const files: Blob[] = [];
  for (const value of [...fd.getAll("files"), ...fd.getAll("file")]) {
    if (value instanceof Blob && value.size > 0) files.push(value);
  }

  const imagePaths = await saveCrmImages(`att-${studentId}`, files);

  let attendance = await createAttendance(studentId, {
    date,
    content,
    lessonsUsed,
    lessonTheme: lessonTheme || undefined,
    techniquesLearned: techniquesLearned || undefined,
    imagePaths,
  });

  if (generateReview) {
    try {
      attendance = await generateAttendanceReview(attendance.id, { customPrompt });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Review generation failed";
      return NextResponse.json(
        { attendance, reviewError: message },
        { status: 201 }
      );
    }
  }

  return NextResponse.json({ attendance }, { status: 201 });
}

function readString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function readBool(fd: FormData, key: string): boolean {
  const v = readString(fd, key).toLowerCase();
  return v === "1" || v === "true" || v === "on" || v === "yes";
}
