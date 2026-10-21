delete from public.website_classes where day = 'Saturday';

insert into public.website_classes
  (day, day_short, title, ages, start_time, end_time, duration_minutes, active, sort_order)
select
  'Wednesday', 'Wed', 'Drawing & Creative', 'Ages 8–10', '4:00 PM', '5:30 PM', 90, true, 29
where not exists (
  select 1 from public.website_classes
  where day = 'Wednesday'
    and title = 'Drawing & Creative'
    and start_time = '4:00 PM'
    and end_time = '5:30 PM'
);
