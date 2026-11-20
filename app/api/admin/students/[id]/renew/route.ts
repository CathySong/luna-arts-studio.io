import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createPayment, getStudent, listPaymentsByStudent } from "@/lib/crm/db";
import { requireAdmin } from "@/lib/crm/api-auth";

type Params = { params: { id: string } };

/**
 * Create a renewal payment using the student's most recent package.
 * This records the renewal in CRM only; it does not charge a card.
 */
export async function POST(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const student = await getStudent(params.id);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const payments = await listPaymentsByStudent(params.id);
  const latest = payments[0];
  if (!latest) {
    return NextResponse.json(
      { error: "No previous package found for renewal" },
      { status: 400 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    amount?: unknown;
    lessonsPurchased?: unknown;
    paidAt?: unknown;
  };
  const amount = body.amount === undefined ? latest.amount : Number(body.amount);
  const lessonsPurchased =
    body.lessonsPurchased === undefined
      ? latest.lessonsPurchased
      : Number(body.lessonsPurchased);
  const paidAt =
    typeof body.paidAt === "string" && body.paidAt.trim()
      ? body.paidAt.trim()
      : new Date().toISOString().slice(0, 10);

  if (!Number.isFinite(amount) || amount < 0) {
    return NextResponse.json({ error: "Invalid renewal amount" }, { status: 400 });
  }
  if (!Number.isInteger(lessonsPurchased) || lessonsPurchased < 1) {
    return NextResponse.json(
      { error: "lessonsPurchased must be at least 1" },
      { status: 400 }
    );
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(paidAt)) {
    return NextResponse.json({ error: "Invalid renewal date" }, { status: 400 });
  }

  const payment = await createPayment(params.id, {
    amount,
    paidAt,
    lessonsPurchased,
    notes: `一键续报 · 复制 ${latest.lessonsPurchased} 课时课包`,
  });

  return NextResponse.json({ payment }, { status: 201 });
}
