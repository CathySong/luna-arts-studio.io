import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { getReview, patchReview } from "@/lib/crm/db";
import type { ClassReview, ReviewStatus } from "@/lib/crm/types";

const STATUSES = new Set<ReviewStatus>(["draft", "generated", "approved"]);

type SegmentContext = {
  params: { id: string };
};

export async function GET(req: NextRequest, ctx: SegmentContext) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const review = await getReview(ctx.params.id);
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ review });
}

export async function PATCH(req: NextRequest, ctx: SegmentContext) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const payload = body as Partial<{ content: unknown; status: unknown }>;

  try {
    const patchPayload: Partial<Pick<ClassReview, "content" | "status">> = {};

    if (payload.content !== undefined) {
      if (typeof payload.content !== "string") throw new Error("content must be a string");
      patchPayload.content = payload.content;
    }

    if (payload.status !== undefined) {
      if (typeof payload.status !== "string" || !STATUSES.has(payload.status as ReviewStatus)) {
        throw new Error("status must be draft, generated, or approved");
      }
      patchPayload.status = payload.status as ReviewStatus;
    }

    if (Object.keys(patchPayload).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updated = await patchReview(ctx.params.id, patchPayload);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ review: updated });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unable to patch review" },
      { status: 400 }
    );
  }
}
