import { mkdir, writeFile } from "fs/promises";
import path from "path";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import {
  createArtworkRecord,
  getSession,
  getStudent,
  getUploadDir,
} from "@/lib/crm/db";

type SegmentContext = {
  params: { id: string };
};

export const runtime = "nodejs";

export async function POST(req: NextRequest, ctx: SegmentContext) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const session = await getSession(ctx.params.id);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const fd = await req.formData();
  const file = fd.get("file");

  const studentRaw = fd.get("studentId");
  if (typeof studentRaw !== "string" || studentRaw.trim().length === 0) {
    return NextResponse.json({ error: "studentId is required" }, { status: 400 });
  }

  const studentId = studentRaw.trim();
  const student = await getStudent(studentId);
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 400 });
  }

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "file multipart field is required" }, { status: 400 });
  }

  const ext = inferExtension(typeof file.type === "string" ? file.type : "", file instanceof File ? file.name : undefined);
  const baseName = `${ctx.params.id}-${studentId}-${Date.now()}.${ext}`;
  await mkdir(getUploadDir(), { recursive: true });
  const absPath = path.join(getUploadDir(), baseName);

  const arrayBuffer = await file.arrayBuffer();
  await writeFile(absPath, Buffer.from(arrayBuffer));

  const imagePath = `/uploads/crm/${baseName}`;
  const title = readOptionalString(fd, "title");
  const medium = readOptionalString(fd, "medium");
  const notes = readOptionalString(fd, "notes");

  const artwork = await createArtworkRecord({
    sessionId: ctx.params.id,
    studentId,
    imageRelativePath: imagePath,
    title,
    medium,
    notes,
  });

  return NextResponse.json({ artwork }, { status: 201 });
}

function readOptionalString(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  return trimmed === "" ? undefined : trimmed;
}

function inferExtension(mime: string | undefined, fileName?: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default: {
      if (fileName && fileName.includes(".")) {
        const ext = fileName.split(".").pop();
        if (ext && /^[a-z0-9]+$/i.test(ext)) return ext.toLowerCase();
      }
      return "jpg";
    }
  }
}
