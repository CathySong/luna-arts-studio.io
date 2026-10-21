"use client";

import { useEffect, useState } from "react";
import { fallEnrollmentConfig, type WeeklyDaySchedule } from "@/config/fall-enrollment";
import type { WebsiteClass } from "@/lib/crm/website-classes";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function classesToWeeklySchedule(classes: WebsiteClass[]): WeeklyDaySchedule[] {
  const grouped = new Map<string, WeeklyDaySchedule>();
  for (const item of classes.filter((item) => item.active)) {
    const day = grouped.get(item.day) ?? { day: item.day, dayShort: item.dayShort, slots: [] };
    day.slots.push({ time: `${item.startTime}–${item.endTime}`, title: item.title, ages: item.ages, duration: `${item.durationMinutes} min` });
    grouped.set(item.day, day);
  }
  return Array.from(grouped.values()).sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));
}

export function useWebsiteSchedule(): WeeklyDaySchedule[] {
  const [schedule, setSchedule] = useState(fallEnrollmentConfig.weeklySchedule);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/classes", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { classes?: WebsiteClass[] }) => {
        if (data.classes?.length) setSchedule(classesToWeeklySchedule(data.classes));
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  return schedule;
}
