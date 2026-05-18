import Link from "next/link";

import StudentForm from "@/components/crm/StudentForm";

export default function AdminNewStudentPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Link href="/admin/students" className="text-xs uppercase tracking-ultra text-gray-dark hover:text-accent-warm">
          ← Students
        </Link>
        <div className="font-display text-3xl text-gray-darkest tracking-wide">New student</div>
      </div>
      <StudentForm />
    </div>
  );
}
