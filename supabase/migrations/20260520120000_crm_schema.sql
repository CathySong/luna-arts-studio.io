-- Luna CRM schema for Supabase (free tier)
-- Run in Supabase Dashboard → SQL Editor, or: supabase db push

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INT,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  hobbies JSONB NOT NULL DEFAULT '[]'::jsonb,
  loved_arts JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  classes_taken INT NOT NULL DEFAULT 0,
  notebooklm_source_id TEXT,
  notebooklm_source_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  class_type TEXT NOT NULL,
  date DATE NOT NULL,
  instructor TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  title TEXT,
  medium TEXT,
  notes TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS class_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'generated', 'approved')),
  version INT NOT NULL DEFAULT 1,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  artwork_ids JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  paid_at DATE NOT NULL,
  lessons_purchased INT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  session_id UUID REFERENCES class_sessions(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  lessons_used INT NOT NULL DEFAULT 1,
  lesson_theme TEXT,
  techniques_learned TEXT,
  image_paths JSONB NOT NULL DEFAULT '[]'::jsonb,
  review JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attendances_student_date ON attendances(student_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id, paid_at DESC);
CREATE INDEX IF NOT EXISTS idx_artworks_session ON artworks(session_id);
CREATE INDEX IF NOT EXISTS idx_reviews_student ON class_reviews(student_id);
