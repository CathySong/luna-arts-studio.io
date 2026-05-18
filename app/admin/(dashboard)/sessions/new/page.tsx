import Link from "next/link";

import SessionForm from "@/components/crm/SessionForm";

export default function AdminNewSessionPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Link href="/admin/sessions" className="text-xs uppercase tracking-ultra text-gray-dark hover:text-accent-warm">
          ← Sessions
        </Link>
        <div className="font-display text-3xl text-gray-darkest tracking-wide">New session</div>
      </div>
      <SessionForm />
    </div>
  );
}
