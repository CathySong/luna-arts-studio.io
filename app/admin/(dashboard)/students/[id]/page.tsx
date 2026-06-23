import Link from "next/link";
import { notFound } from "next/navigation";

import StudentRecordPanel from "@/components/crm/StudentRecordPanel";
import StudentForm from "@/components/crm/StudentForm";
import SyncKnowledgeButton from "@/components/crm/SyncKnowledgeButton";
import { getStudent, getStudentRecord } from "@/lib/crm/db";
import { getNotebookLmMode, isNotebookLmConfigured } from "@/lib/crm/notebooklm";

type Props = {
  params: { id: string };
};

export default async function AdminStudentDetailPage({ params }: Props) {
  const student = await getStudent(params.id);
  if (!student) notFound();
  const record = await getStudentRecord(params.id);
  if (!record) notFound();

  const { summary } = record;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/students"
          className="text-xs uppercase tracking-ultra text-gray-dark hover:text-accent-warm"
        >
          ← 学生列表
        </Link>
        <div className="font-display text-3xl text-gray-darkest tracking-wide">{student.name}</div>
        <p className="text-sm text-gray-darker">
          {student.parentName ? `${student.parentName} · ` : ""}
          {student.parentEmail ?? student.parentPhone ?? ""}
          <span className="block mt-2 text-xs">
            剩余课时 <strong className={summary.remainingLessons <= 2 ? "text-amber-700" : ""}>{summary.remainingLessons}</strong>
            {" · "}
            上课 {summary.usedLessons} 次 · 点评 {record.reviews.length} 篇
          </span>
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          {student.defaultPrice ? (
            <span className="rounded-md bg-accent-warm/15 border border-accent-warm/40 px-2 py-1 text-gray-darkest">
              💰 ${student.defaultPrice}/课
            </span>
          ) : null}
          {student.source ? (
            <span className="rounded-md bg-gray-lightest border border-gray-lighter px-2 py-1 text-gray-darker">
              📣 来源: {student.source}
              {student.sourceCustom ? ` (${student.sourceCustom})` : ""}
            </span>
          ) : null}
        </div>
      </div>

      <section className="rounded-xl border border-gray-lighter bg-white p-6 md:p-8 card-shadow">
        <div className="font-display text-2xl text-gray-darkest mb-2">学生档案</div>
        <p className="text-sm text-gray-darker mb-8">
          上课记录、课堂点评与付款 — 该学生的完整学习历程
        </p>
        <StudentRecordPanel studentId={student.id} />
      </section>

      {isNotebookLmConfigured() ? (
        <section className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow space-y-4 max-w-xl">
          <div className="font-display text-lg text-gray-darkest">NotebookLM 同步</div>
          <p className="text-sm text-gray-darker">
            将档案同步到 NotebookLM（{getNotebookLmMode() === "google" ? "Google Cloud" : "REST proxy"}）
          </p>
          <SyncKnowledgeButton studentId={student.id} />
        </section>
      ) : null}

      <section className="space-y-4 border-t border-gray-lighter pt-8">
        <div className="font-display text-xl text-gray-darkest">编辑基本信息</div>
        <StudentForm student={student} />
      </section>
    </div>
  );
}
