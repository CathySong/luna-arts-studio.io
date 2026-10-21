create table if not exists public.website_classes (
  id uuid primary key default gen_random_uuid(),
  day text not null,
  day_short text not null,
  title text not null,
  ages text,
  start_time text not null,
  end_time text not null,
  duration_minutes integer not null default 90 check (duration_minutes > 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.website_classes enable row level security;

insert into public.website_classes (day, day_short, title, ages, start_time, end_time, sort_order)
select * from (values
  ('Wednesday', 'Wed', 'Creative Art', 'Ages 5–9', '5:30 PM', '7:00 PM', 30),
  ('Thursday', 'Thu', 'Sewing', 'Ages 6+', '4:30 PM', '6:00 PM', 40),
  ('Thursday', 'Thu', 'Drawing Fundamentals & Painting', 'Ages 9+', '6:00 PM', '7:30 PM', 41),
  ('Friday', 'Fri', 'Creative Art', 'Ages 4–6', '3:30 PM', '5:00 PM', 50),
  ('Friday', 'Fri', 'Creative Art', 'Ages 6–9', '5:00 PM', '6:30 PM', 51),
  ('Saturday', 'Sat', 'Mixed Media', 'Ages 8+', '2:30 PM', '4:00 PM', 60),
  ('Saturday', 'Sat', 'Creative Art', 'Ages 5–8', '4:15 PM', '5:45 PM', 61)
) as seed(day, day_short, title, ages, start_time, end_time, sort_order)
where not exists (select 1 from public.website_classes);
