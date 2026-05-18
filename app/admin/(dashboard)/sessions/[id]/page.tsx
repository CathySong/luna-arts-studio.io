import Link from "next/link";
import { notFound } from "next/navigation";

import SessionWorkspace from "@/components/crm/SessionWorkspace";
import { getSessionContext, listStudents } from "@/lib/crm/db";

type Props = {
  params: { id: string };
};

export default async function AdminSessionDetailPage({ params }: Props) {
  const ctx = await getSessionContext(params.id);
  if (!ctx) notFound();

  const students = await listStudents();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Link href="/admin/sessions" className="text-xs uppercase tracking-ultra text-gray-dark hover:text-accent-warm">
          ← Sessions
        </Link>
      </div>

      <SessionWorkspace
        sessionId={ctx.session.id}
        sessionTitle={ctx.session.title}
        artworks={ctx.artworks}
        reviews={ctx.reviews}
        students={students}
      />
    </div>
  );
}
