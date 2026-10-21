insert into public.website_classes
  (day, day_short, title, ages, start_time, end_time, duration_minutes, active, sort_order)
select
  'Saturday', 'Sat', 'Mixed Media', 'Ages 8+', '2:30 PM', '4:00 PM', 90, true, 60
where not exists (
  select 1 from public.website_classes
  where day = 'Saturday'
    and title = 'Mixed Media'
    and start_time = '2:30 PM'
    and end_time = '4:00 PM'
);
