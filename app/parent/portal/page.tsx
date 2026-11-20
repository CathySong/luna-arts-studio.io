import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/crm/supabase-client";
import { getStudentEnrollment } from "@/lib/crm/db";
import ParentPortalClient from "@/components/parent/ParentPortalClient";

export const dynamic = "force-dynamic";

export default async function ParentPortalPage() {
  if (!isSupabaseConfigured()) {
    return <PortalMessage title="家长门户尚未启用" body="请先配置 Supabase 数据库和家长登录所需的公开密钥。" />;
  }
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/parent/login");

  const { data, error } = await getSupabaseAdmin().from("students").select("id, name, age, parent_name, class_days, class_time_slots").ilike("parent_email", user.email).eq("status", "active").order("name");
  if (error) return <PortalMessage title="暂时无法加载档案" body={error.message} />;

  const children = await Promise.all((data ?? []).map(async (student) => ({
    id: String(student.id),
    name: String(student.name),
    age: student.age == null ? null : Number(student.age),
    parentName: student.parent_name == null ? null : String(student.parent_name),
    classDays: (student.class_days as string[] | null) ?? [],
    classTimeSlots: (student.class_time_slots as string[] | null) ?? [],
    enrollment: await getStudentEnrollment(String(student.id)),
  })));

  return <ParentPortalClient email={user.email} students={children} />;
}

function PortalMessage({ title, body }: { title: string; body: string }) {
  return <main className="min-h-screen bg-white-warm px-6 py-16 flex items-center justify-center"><div className="max-w-md rounded-2xl border border-gray-lighter bg-white p-8 card-shadow"><h1 className="font-display text-2xl text-gray-darkest">{title}</h1><p className="mt-3 text-sm text-gray-darker">{body}</p><Link href="/parent/login" className="mt-6 inline-block text-sm text-accent-warm hover:underline">返回家长登录</Link></div></main>;
}
