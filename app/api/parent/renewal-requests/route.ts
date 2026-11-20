import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getSupabaseAdmin } from "@/lib/crm/supabase-client";

export async function POST(req: Request) {
  const { data: { user } } = await createClient().auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { studentId?: unknown };
  if (typeof body.studentId !== "string" || !body.studentId) return NextResponse.json({ error: "缺少学生信息" }, { status: 400 });

  const sb = getSupabaseAdmin();
  const { data: student } = await sb.from("students").select("id").eq("id", body.studentId).ilike("parent_email", user.email).maybeSingle();
  if (!student) return NextResponse.json({ error: "无权访问该学生档案" }, { status: 403 });
  const { error } = await sb.from("parent_renewal_requests").insert({ student_id: body.studentId, parent_email: user.email });
  if (error) return NextResponse.json({ error: "续报申请暂时无法提交" }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
