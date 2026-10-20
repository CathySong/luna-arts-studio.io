ALTER TABLE students
  ADD COLUMN IF NOT EXISTS class_days TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS class_time_slots TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN students.class_days IS 'Recurring class weekdays, paired by array position with class_time_slots.';
COMMENT ON COLUMN students.class_time_slots IS 'Recurring class time ranges, paired by array position with class_days.';

UPDATE students SET class_days = ARRAY['周一'], class_time_slots = ARRAY['15:00–16:30'] WHERE name IN ('Lihua', 'Elaine');
UPDATE students SET class_days = ARRAY['周三'], class_time_slots = ARRAY['16:00–17:30'] WHERE name = 'Alan';
UPDATE students SET class_days = ARRAY['周三', '周四'], class_time_slots = ARRAY['16:00–17:30', '16:30–18:00'] WHERE name = 'Mira';
UPDATE students SET class_days = ARRAY['周四'], class_time_slots = ARRAY['18:00–19:30'] WHERE name IN ('Tan-Ru', 'Mikael', 'Chelsea', 'Oliver', '安琪', '沐岚');
UPDATE students SET class_days = ARRAY['周五'], class_time_slots = ARRAY['15:30–17:00'] WHERE name IN ('Angela Wu、Andy Wu', 'Isabella', 'Arianna');
UPDATE students SET class_days = ARRAY['周五'], class_time_slots = ARRAY['17:00–18:30'] WHERE name IN ('Olivia Ji、Kayla Ji', 'Angelina、Eddie', 'Nora Karkhanis');
UPDATE students SET class_days = ARRAY['周五', '周五'], class_time_slots = ARRAY['15:00–15:30', '15:30–17:00'] WHERE name = 'Victoria';
UPDATE students SET class_days = ARRAY['周六'], class_time_slots = ARRAY['14:30–16:00'] WHERE name IN ('Fianna、Nuoqi', 'Daisy Chen');

CREATE INDEX IF NOT EXISTS idx_students_class_days ON students USING GIN (class_days);
CREATE INDEX IF NOT EXISTS idx_students_class_time_slots ON students USING GIN (class_time_slots);
