import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { getReview } from "@/lib/crm/db";
import { generateReviewForStudent } from "@/lib/crm/reviews";

type SegmentContext = {
  params: { id: string };
};

export const runtime = "nodejs";

export async function POST(req: NextRequest, ctx: SegmentContext) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const prev = await getReview(ctx.params.id);
  if (!prev) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const review = await generateReviewForStudent(
      prev.sessionId,
      prev.studentId,
      prev.id
    );
    return NextResponse.json({ review });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Regeneration failed" },
      { status: 502 }
    );
  }
}
