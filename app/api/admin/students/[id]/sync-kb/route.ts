import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { getStudent, updateStudent } from "@/lib/crm/db";
import { syncStudentNotebook } from "@/lib/crm/notebooklm";

type SegmentContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, ctx: SegmentContext) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const student = await getStudent((await ctx.params).id);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const result = await syncStudentNotebook(student);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  await updateStudent((await ctx.params).id, {
    ...(result.sourceId
      ? { notebooklmSourceId: result.sourceId, notebooklmSourceName: result.sourceName }
      : {}),
  });

  const hydrated = await getStudent((await ctx.params).id);

  return NextResponse.json({ ok: true, student: hydrated, notebook: result });
}
