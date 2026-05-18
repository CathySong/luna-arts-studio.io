import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { getDefaultAttendanceReviewPrompt } from "@/lib/crm/attendance-reviews";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  return NextResponse.json({ prompt: getDefaultAttendanceReviewPrompt() });
}
