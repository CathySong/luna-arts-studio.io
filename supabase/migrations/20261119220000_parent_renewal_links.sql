-- Opaque, expiring links used in parent renewal reminders.
CREATE TABLE IF NOT EXISTS parent_renewal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parent_renewal_links_student ON parent_renewal_links(student_id, created_at DESC);
