import type { Student } from "@/lib/crm/types";

const SCHEDULE_PREFIX = "课程与时间：";

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
    .map((day, index) => ({ day, time: student.classTimeSlots?.[index] ?? "" }))
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
