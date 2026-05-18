import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/crm/api-auth";
import { createPayment, getStudent, listPaymentsByStudent } from "@/lib/crm/db";
import type { PaymentInput } from "@/lib/crm/types";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const payments = await listPaymentsByStudent(params.id);
  return NextResponse.json({ payments });
}

export async function POST(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const student = await getStudent(params.id);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json()) as Partial<PaymentInput>;
  const amount = Number(body.amount);
  const lessonsPurchased = Number(body.lessonsPurchased);
  const paidAt = typeof body.paidAt === "string" ? body.paidAt.trim() : "";

  if (!paidAt || Number.isNaN(amount) || amount < 0) {
    return NextResponse.json(
      { error: "paidAt and valid amount are required" },
      { status: 400 }
    );
  }
  if (Number.isNaN(lessonsPurchased) || lessonsPurchased < 1) {
    return NextResponse.json(
      { error: "lessonsPurchased must be at least 1" },
      { status: 400 }
    );
  }

  const payment = await createPayment(params.id, {
    amount,
    paidAt,
    lessonsPurchased,
    notes: body.notes?.trim() || undefined,
  });

  return NextResponse.json({ payment }, { status: 201 });
}
