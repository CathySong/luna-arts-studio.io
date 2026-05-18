import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import {
  deleteStudent,
  getStudent,
  updateStudent,
} from "@/lib/crm/db";

type SegmentContext = {
  params: { id: string };
};

export async function GET(req: NextRequest, ctx: SegmentContext) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const student = await getStudent(ctx.params.id);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ student });
}

export async function PATCH(req: NextRequest, ctx: SegmentContext) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  try {
    const patch = coercePatch(body);
    const updated = await updateStudent(ctx.params.id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ student: updated });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unable to patch student" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: SegmentContext) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const removed = await deleteStudent(ctx.params.id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

function coercePatch(body: Record<string, unknown>): Record<string, unknown> {
  const patch: Record<string, unknown> = {};

  mapString(body, patch, "name");
  mapNumber(body, patch, "age");
  mapString(body, patch, "parentName");
  mapString(body, patch, "parentEmail");
  mapString(body, patch, "parentPhone");
  mapString(body, patch, "notes");

  if (body.hobbies !== undefined) patch.hobbies = stringArray(body.hobbies);
  if (body.lovedArts !== undefined) patch.lovedArts = stringArray(body.lovedArts);
  mapNumber(body, patch, "classesTaken");

  if (Object.keys(patch).length === 0) throw new Error("No updatable keys supplied.");
  return patch;
}

function mapString(body: Record<string, unknown>, out: Record<string, unknown>, key: string) {
  if (body[key] === undefined) return;
  const raw = body[key];
  if (typeof raw !== "string") throw new Error(`${key} must be a string`);
  const trimmed = raw.trim();
  if (trimmed === "") delete out[key];
  else out[key] = trimmed;
}

function mapNumber(body: Record<string, unknown>, out: Record<string, unknown>, key: string) {
  if (body[key] === undefined) return;
  const raw = body[key];
  if (typeof raw === "number" && Number.isFinite(raw)) out[key] = raw;
  else if (typeof raw === "string" && raw.trim()) {
    const num = Number(raw);
    if (!Number.isFinite(num)) throw new Error(`${key} must be numeric`);
    out[key] = num;
  } else throw new Error(`${key} must be numeric`);
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) throw new Error("Expected array field");
  return value.map((v) => (typeof v === "string" ? v.trim() : `${v ?? ""}`)).filter(Boolean);
}
