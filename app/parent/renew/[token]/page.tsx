import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/crm/supabase-client";
import { getStudentEnrollment } from "@/lib/crm/db";
import { hashRenewalToken } from "@/lib/parent/renewal-link";
import RenewalAction from "@/components/parent/RenewalAction";

type Props = { params: { token: string } };

export const dynamic = "force-dynamic";

export default async function ParentRenewPage({ params }: Props) {
  if (!isSupabaseConfigured()) return <Message title="续报链接暂不可用" body="家长门户尚未完成数据库配置。" />;
  const sb = getSupabaseAdmin();
  const { data: link } = await sb.from("parent_renewal_links").select("student_id, expires_at").eq("token_hash", hashRenewalToken(params.token)).maybeSingle();
  if (!link || new Date(String(link.expires_at)).getTime() < Date.now()) return <Message title="续报链接已失效" body="请联系工作室重新发送续报提醒。" />;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect(`/parent/login?next=/parent/renew/${params.token}`);

  const { data: student } = await sb.from("students").select("id, name, parent_email").eq("id", link.student_id).maybeSingle();
  if (!student || String(student.parent_email ?? "").toLowerCase() !== user.email.toLowerCase()) return <Message title="无法访问此续报" body="当前登录邮箱不是该学生档案中的家长邮箱。" />;
  const enrollment = await getStudentEnrollment(String(student.id));

  return <main className="min-h-screen bg-white-warm px-5 py-10 flex items-center justify-center"><section className="w-full max-w-lg rounded-2xl border border-gray-lighter bg-white p-6 sm:p-8 card-shadow"><Link href="/parent/portal" className="text-xs uppercase tracking-ultra text-gray-dark hover:text-accent-warm">← 家长门户</Link><p className="mt-8 text-xs uppercase tracking-ultra text-accent-warm">Luna Art Studio</p><h1 className="mt-2 font-display text-3xl text-gray-darkest">{student.name} 续报</h1><p className="mt-2 text-sm text-gray-darker">确认后会提交续报申请，工作室会联系你确认课包和付款。</p><div className="mt-6 grid grid-cols-2 gap-3"><Stat label="剩余课时" value={String(enrollment.summary.remainingLessons)} /><Stat label="已上课时" value={String(enrollment.summary.usedLessons)} /></div><RenewalAction studentId={String(student.id)} studentName={String(student.name)} /><p className="mt-4 text-center text-xs text-gray">链接有效期至 {new Date(String(link.expires_at)).toLocaleDateString("zh-CN")}</p></section></main>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-gray-lighter bg-white-warm px-4 py-3"><p className="text-xs text-gray">{label}</p><p className="mt-1 font-display text-2xl text-gray-darkest">{value}</p></div>; }
function Message({ title, body }: { title: string; body: string }) { return <main className="min-h-screen bg-white-warm px-5 py-16 flex items-center justify-center"><section className="max-w-md rounded-2xl border border-gray-lighter bg-white p-8 card-shadow"><h1 className="font-display text-2xl text-gray-darkest">{title}</h1><p className="mt-3 text-sm text-gray-darker">{body}</p><Link href="/parent/login" className="mt-6 inline-block text-sm text-accent-warm hover:underline">家长登录</Link></section></main>; }
