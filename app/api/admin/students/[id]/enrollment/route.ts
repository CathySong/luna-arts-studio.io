import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { getStudent, getStudentEnrollment } from "@/lib/crm/db";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const student = await getStudent(params.id);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const enrollment = await getStudentEnrollment(params.id);
  return NextResponse.json({ student, ...enrollment });
}
