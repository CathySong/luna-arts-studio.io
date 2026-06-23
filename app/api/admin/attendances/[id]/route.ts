import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { deleteAttendance, updateAttendance } from "@/lib/crm/db";

type Params = { params: { id: string } };

export const runtime = "nodejs";

const NUMERIC_FIELDS = new Set([
  "lessonsUsed",
  "durationMinutes",
  "priceOverride",
]);

/**
 * PATCH /api/admin/attendances/:id
 * Body: any subset of { content, lessonTheme, techniquesLearned,
 *                        priceOverride, startTime, durationMinutes,
 *                        lessonsUsed, date }
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const patch: Record<string, unknown> = {};

  for (const [k, v] of Object.entries(body)) {
    if (NUMERIC_FIELDS.has(k)) {
      if (v === null || v === "") {
        patch[k] = null;
      } else {
        const n = Number(v);
        if (Number.isNaN(n)) {
          return NextResponse.json({ error: `${k} invalid` }, { status: 400 });
        }
        patch[k] = n;
      }
    } else if (k === "startTime") {
      // HH:MM or null
      patch[k] = typeof v === "string" && v !== "" ? v : null;
    } else if (k === "date") {
      if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        return NextResponse.json({ error: "date invalid" }, { status: 400 });
      }
      patch[k] = v;
    } else {
      patch[k] = v;
    }
  }

  const updated = await updateAttendance(params.id, patch as Parameters<typeof updateAttendance>[1]);
  if (!updated) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ attendance: updated });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const ok = await deleteAttendance(params.id);
  if (!ok) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
