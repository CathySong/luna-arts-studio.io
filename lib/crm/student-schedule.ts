import type { Student } from "@/lib/crm/types";

const SCHEDULE_PREFIX = "课程与时间：";

const WEEKDAY_ALIASES: Record<string, string> = {
  "周一": "周一", "星期一": "周一", monday: "周一", mon: "周一",
  "周二": "周二", "星期二": "周二", tuesday: "周二", tue: "周二", tues: "周二",
  "周三": "周三", "星期三": "周三", wednesday: "周三", wed: "周三",
  "周四": "周四", "星期四": "周四", thursday: "周四", thu: "周四", thur: "周四", thurs: "周四",
  "周五": "周五", "星期五": "周五", friday: "周五", fri: "周五",
  "周六": "周六", "星期六": "周六", saturday: "周六", sat: "周六",
  "周日": "周日", "周天": "周日", "星期日": "周日", "星期天": "周日", sunday: "周日", sun: "周日",
};

export function normalizeClassDay(value: string): string {
  const trimmed = value.trim();
  return WEEKDAY_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}

function parseTime(value: string, fallbackPeriod?: string): number | undefined {
  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return undefined;
  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const period = match[3]?.toUpperCase() ?? fallbackPeriod;
  if (minute > 59 || hour > 23) return undefined;
  if (period) {
    if (hour < 1 || hour > 12) return undefined;
    hour = (hour % 12) + (period === "PM" ? 12 : 0);
  }
  return hour * 60 + minute;
}

function formatTime(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function normalizeClassTimeSlot(value: string): string {
  const trimmed = value.trim();
  const parts = trimmed.split(/\s*(?:-|–|—|－|~|～|to)\s*/i);
  if (parts.length !== 2) return trimmed.replace(/\s+/g, " ");
  const endPeriod = parts[1].match(/\b(AM|PM)\b/i)?.[1]?.toUpperCase();
  const end = parseTime(parts[1]);
  let start = parseTime(parts[0], endPeriod);
  if (!/\b(?:AM|PM)\b/i.test(parts[0]) && endPeriod && start !== undefined && end !== undefined && start > end) {
    start = parseTime(parts[0], endPeriod === "PM" ? "AM" : "PM");
  }
  if (start === undefined || end === undefined) return trimmed.replace(/\s+/g, " ");
  return `${formatTime(start)}–${formatTime(end)}`;
}

export function getStudentSchedule(student: Pick<Student, "notes">): string {
  const scheduleLine = student.notes
    ?.split(/\r?\n/)
    .find((line) => line.trim().startsWith(SCHEDULE_PREFIX));

  return scheduleLine?.trim().slice(SCHEDULE_PREFIX.length).trim() ?? "";
}

export function getStructuredStudentSchedule(
  student: Pick<Student, "notes" | "classDays" | "classTimeSlots">
): Array<{ day: string; time: string }> {
  const structured = (student.classDays ?? [])
    .map((day, index) => ({
      day: normalizeClassDay(day),
      time: normalizeClassTimeSlot(student.classTimeSlots?.[index] ?? ""),
    }))
    .filter(({ day, time }) => day || time);

  if (structured.length > 0) return structured;

  return splitStudentSchedule(student).map((schedule) => {
    const match = schedule.match(/^(周[一二三四五六日])\s+([^\s]+)(?:\s+.*)?$/);
    return match ? { day: match[1], time: match[2] } : { day: schedule, time: "" };
  });
}

export function splitStudentSchedule(student: Pick<Student, "notes">): string[] {
  return getStudentSchedule(student)
    .split(/[；;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
