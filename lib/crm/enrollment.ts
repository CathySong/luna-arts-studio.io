import type {
  ClassAttendance,
  PaymentRecord,
  StudentEnrollmentSummary,
} from "./types";

export function computeEnrollmentSummary(
  payments: PaymentRecord[],
  attendances: ClassAttendance[]
): StudentEnrollmentSummary {
  const totalLessons = payments.reduce((s, p) => s + (p.lessonsPurchased || 0), 0);
  const usedLessons = attendances.reduce((s, a) => s + (a.lessonsUsed || 1), 0);
  const totalPaid = payments.reduce((s, p) => s + (p.amount || 0), 0);

  return {
    totalLessons,
    usedLessons,
    remainingLessons: Math.max(0, totalLessons - usedLessons),
    totalPaid,
  };
}
