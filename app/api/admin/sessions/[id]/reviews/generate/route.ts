import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { generateAllSessionReviews } from "@/lib/crm/reviews";

type SegmentContext = {
  params: { id: string };
};

export const runtime = "nodejs";

export async function POST(req: NextRequest, ctx: SegmentContext) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const report = await generateAllSessionReviews(ctx.params.id);
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Generation failed",
      },
      { status: 500 }
    );
  }
}
