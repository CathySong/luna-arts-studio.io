import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/crm/api-auth";
import { getStudent } from "@/lib/crm/db";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/crm/supabase-client";
import { createRenewalToken, hashRenewalToken } from "@/lib/parent/renewal-link";

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Renewal links require Supabase storage" }, { status: 503 });
  }

  const student = await getStudent(params.id);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!student.parentEmail) {
    return NextResponse.json({ error: "请先在学生档案填写家长邮箱" }, { status: 400 });
  }

  const token = createRenewalToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await getSupabaseAdmin().from("parent_renewal_links").insert({
    student_id: student.id,
    token_hash: hashRenewalToken(token),
    expires_at: expiresAt,
  });
  if (error) return NextResponse.json({ error: "无法生成续报链接" }, { status: 500 });

  return NextResponse.json({
    url: new URL(`/parent/renew/${token}`, req.url).toString(),
    expiresAt,
  });
}
