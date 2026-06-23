-- Luna CRM: daily class logging
-- Adds: students.default_price, students.source, students.source_custom,
--        attendances.price_override, attendances.start_time, attendances.duration_minutes
-- Date: 2026-06-22

-- 1) students: default price per lesson + lead source
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS default_price NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS source_custom TEXT;

CREATE INDEX IF NOT EXISTS idx_students_source ON students(source);

COMMENT ON COLUMN students.default_price IS 'Default price per lesson in USD; copied to attendance.price_override when null';
COMMENT ON COLUMN students.source IS 'Lead source: referral|instagram|wechat|xiaohongshu|google|walkin|summer_camp|other';
COMMENT ON COLUMN students.source_custom IS 'Free-text source when source=other';

-- 2) attendances: per-attendance price + time of day
ALTER TABLE attendances
  ADD COLUMN IF NOT EXISTS price_override NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS start_time TIME,
  ADD COLUMN IF NOT EXISTS duration_minutes INT;

COMMENT ON COLUMN attendances.price_override IS 'Override price for this lesson (USD); falls back to student.default_price';
COMMENT ON COLUMN attendances.start_time IS 'Local class start time, e.g. 15:30';
COMMENT ON COLUMN attendances.duration_minutes IS 'Class duration in minutes; defaults to 60';

CREATE INDEX IF NOT EXISTS idx_attendances_date ON attendances(date DESC);
CREATE INDEX IF NOT EXISTS idx_attendances_price ON attendances(price_override);
