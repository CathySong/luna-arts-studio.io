import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { createSession, listSessions } from "@/lib/crm/db";
import type { SessionInput } from "@/lib/crm/types";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const sessions = await listSessions();
  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = await safeJson(req);
  try {
    const payload = coerceSession(body ?? {});
    const session = await createSession(payload);
    return NextResponse.json({ session }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unable to create session" },
      { status: 400 }
    );
  }
}

async function safeJson(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const json = await req.json();
    return typeof json === "object" && json !== null ? (json as Record<string, unknown>) : {};
  } catch {
    return null;
  }
}

function coerceSession(body: Record<string, unknown>): SessionInput {
  const title =
    typeof body.title === "string" && body.title.trim().length > 0
      ? body.title.trim()
      : undefined;
  if (!title) throw new Error("title is required");

  const classType =
    typeof body.classType === "string" && body.classType.trim().length > 0
      ? body.classType.trim()
      : undefined;
  if (!classType) throw new Error("classType is required");

  const date =
    typeof body.date === "string" && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(body.date)
      ? body.date
      : undefined;
  if (!date) throw new Error("date must be formatted as YYYY-MM-DD");

  const instructor =
    typeof body.instructor === "string"
      ? body.instructor.trim() || undefined
      : typeof body.instructor !== "undefined" && body.instructor !== null
        ? String(body.instructor)
        : undefined;

  const notes =
    typeof body.notes === "string"
      ? body.notes.trim() || undefined
      : typeof body.notes !== "undefined"
        ? String(body.notes)
        : undefined;

  return {
    title,
    classType,
    date,
    instructor,
    notes,
  };
}
