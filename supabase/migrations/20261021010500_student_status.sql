ALTER TABLE students
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

UPDATE students SET status = 'active' WHERE status IS NULL OR status NOT IN ('active', 'inactive');

ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check;
ALTER TABLE students ADD CONSTRAINT students_status_check CHECK (status IN ('active', 'inactive'));

CREATE INDEX IF NOT EXISTS idx_students_status ON students (status);

COMMENT ON COLUMN students.status IS 'CRM lifecycle status: active or inactive.';
