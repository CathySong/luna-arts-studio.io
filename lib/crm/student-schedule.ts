import type { Student } from "@/lib/crm/types";

const SCHEDULE_PREFIX = "课程与时间：";

export function getStudentSchedule(student: Pick<Student, "notes">): string {
  const scheduleLine = student.notes
    ?.split(/\r?\n/)
    .find((line) => line.trim().startsWith(SCHEDULE_PREFIX));

  return scheduleLine?.trim().slice(SCHEDULE_PREFIX.length).trim() ?? "";
}

export function splitStudentSchedule(student: Pick<Student, "notes">): string[] {
  return getStudentSchedule(student)
    .split(/[；;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
