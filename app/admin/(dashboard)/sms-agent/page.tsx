import SmsAgentPanel from "@/components/crm/SmsAgentPanel";

export default function AdminSmsAgentPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="font-display text-3xl tracking-wide text-gray-darkest">SMS Agent</div>
        <p className="mt-2 text-sm text-gray-darker">
          Manage student SMS contacts, initial messages, consent, and conversation history.
        </p>
      </div>

      <SmsAgentPanel />
    </div>
  );
}
