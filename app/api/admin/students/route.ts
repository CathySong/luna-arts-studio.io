import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { createStudent, listStudents } from "@/lib/crm/db";
import type { StudentInput } from "@/lib/crm/types";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("search")?.trim().toLowerCase();
  let students = await listStudents();
  if (q) {
    students = students.filter((s) => {
      const hay = `${s.name} ${s.parentName ?? ""} ${s.parentEmail ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }
  return NextResponse.json({ students });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = await safeJson<{ student?: Partial<StudentInput> }>(req);
  const studentPayload = coerceStudent(body?.student ?? (body as unknown as StudentInput));

  try {
    const created = await createStudent(studentPayload);
    return NextResponse.json({ student: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unable to create student" },
      { status: 400 }
    );
  }
}

function coerceStudent(candidate: Partial<StudentInput>): StudentInput {
  if (!candidate || typeof candidate.name !== "string" || candidate.name.trim() === "") {
    throw new Error("name is required");
  }

  return {
    name: candidate.name.trim(),
    age:
      typeof candidate.age === "number"
        ? candidate.age
        : candidate.age !== undefined
          ? Number(candidate.age)
          : undefined,
    parentName: optionalString(candidate.parentName),
    parentEmail: optionalString(candidate.parentEmail),
    parentPhone: optionalString(candidate.parentPhone),
    hobbies: coerceStringArray(candidate.hobbies ?? []),
    lovedArts: coerceStringArray(candidate.lovedArts ?? []),
    notes: optionalString(candidate.notes),
    classesTaken:
      typeof candidate.classesTaken === "number"
        ? candidate.classesTaken
        : candidate.classesTaken !== undefined
          ? Number(candidate.classesTaken) || 0
          : 0,
  };
}

async function safeJson<T>(req: NextRequest): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

function optionalString(value?: string | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function coerceStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) =>
      typeof entry === "string" ? entry.trim() : `${entry ?? ""}`
    )
    .filter(Boolean);
}
