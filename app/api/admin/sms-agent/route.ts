import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import {
  listSmsAgentData,
  saveSmsStudent,
  sendBulkReminderSms,
  sendInitialSms,
  type SmsConsentStatus,
} from "@/lib/crm/sms-agent";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const range = req.nextUrl.searchParams.get("range") || "30d";
    const rangeDays: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };
    const days = rangeDays[range];
    const since = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString() : undefined;
    return NextResponse.json(await listSmsAgentData(since));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load SMS Agent" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.studentId !== "string") {
    return NextResponse.json({ error: "studentId is required" }, { status: 400 });
  }
  const consentStatus = body.consentStatus;
  if (!['unknown', 'opted_in', 'opted_out'].includes(String(consentStatus))) {
    return NextResponse.json({ error: "Invalid consent status" }, { status: 400 });
  }
  try {
    return NextResponse.json(await saveSmsStudent({
      studentId: body.studentId,
      parentName: typeof body.parentName === "string" ? body.parentName : undefined,
      parentPhone: typeof body.parentPhone === "string" ? body.parentPhone : undefined,
      enabled: Boolean(body.enabled),
      consentStatus: consentStatus as SmsConsentStatus,
      initialMessage: typeof body.initialMessage === "string" ? body.initialMessage : "",
    }));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save SMS settings" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const body = (await req.json().catch(() => null)) as {
    mode?: string;
    studentId?: string;
    studentIds?: string[];
    message?: string;
  } | null;
  if (body?.mode === "bulk_reminder") {
    try {
      return NextResponse.json(await sendBulkReminderSms(
        Array.isArray(body.studentIds) ? body.studentIds.filter((id): id is string => typeof id === "string") : [],
        typeof body.message === "string" ? body.message : ""
      ));
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unable to send reminders" },
        { status: 400 }
      );
    }
  }
  if (!body?.studentId) return NextResponse.json({ error: "studentId is required" }, { status: 400 });
  try {
    const sid = await sendInitialSms(body.studentId);
    return NextResponse.json({ ok: true, sid });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to send SMS" },
      { status: 400 }
    );
  }
}
