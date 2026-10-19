-- SMS Agent CRM state and message history.
-- The service-role-backed admin API owns access; no public RLS policies are added.

CREATE TABLE IF NOT EXISTS sms_student_settings (
  student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  consent_status TEXT NOT NULL DEFAULT 'unknown'
    CHECK (consent_status IN ('unknown', 'opted_in', 'opted_out')),
  initial_message TEXT NOT NULL DEFAULT '',
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sms_message_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_type TEXT NOT NULL DEFAULT 'conversation',
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  twilio_message_sid TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sms_message_logs_created
  ON sms_message_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_message_logs_student
  ON sms_message_logs(student_id, created_at DESC);

ALTER TABLE sms_student_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_message_logs ENABLE ROW LEVEL SECURITY;

-- Realtime publication is idempotent only through a catalog check.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public'
      AND tablename = 'sms_student_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sms_student_settings;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public'
      AND tablename = 'sms_message_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sms_message_logs;
  END IF;
END $$;
