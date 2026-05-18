import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { deleteSession, getSession } from "@/lib/crm/db";

type SegmentContext = {
  params: { id: string };
};

export async function GET(req: NextRequest, ctx: SegmentContext) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const session = await getSession(ctx.params.id);
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ session });
}

export async function DELETE(req: NextRequest, ctx: SegmentContext) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const removed = await deleteSession(ctx.params.id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
