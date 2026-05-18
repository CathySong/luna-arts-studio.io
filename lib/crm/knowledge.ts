import { computeEnrollmentSummary } from "./enrollment";
import type {
  Artwork,
  ClassAttendance,
  ClassSession,
  PaymentRecord,
  Student,
} from "./types";

function joinLines(lines: Array<string | undefined | null>): string {
  return lines.filter(Boolean).join("\n") + "\n";
}

/** Plain-text corpus for NotebookLM sync (exported as document). */
export function buildStudentKnowledgeDocument(student: Student): string {
  const hobbies =
    student.hobbies?.length ?? 0 ? student.hobbies.join(", ") : "—";
  const lovedArts =
    student.lovedArts?.length ?? 0 ? student.lovedArts.join(", ") : "—";

  return joinLines([
    `# ${student.name}`,
    "",
    "## Profile",
    `- Age (if known): ${student.age ?? "—"}`,
    `- Guardian: ${student.parentName ?? "—"}`,
    `- Email: ${student.parentEmail ?? "—"}`,
    `- Phone: ${student.parentPhone ?? "—"}`,
    `- Classes taken (attendance count): ${String(student.classesTaken ?? 0)}`,
    `- Hobbies: ${hobbies}`,
    `- Art interests: ${lovedArts}`,
    "",
    "## Notes",
    student.notes?.trim()
      ? student.notes.trim()
      : "No free-form notes recorded yet.",
  ]);
}

/** Rich prompt block for Claude review drafting. */
export function buildEnrollmentContextBlock(
  payments: PaymentRecord[],
  attendances: ClassAttendance[]
): string {
  const s = computeEnrollmentSummary(payments, attendances);
  const recent = attendances
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return [
    "### Enrollment & attendance",
    `Total lessons purchased: ${s.totalLessons}`,
    `Lessons used: ${s.usedLessons}`,
    `Remaining lessons: ${s.remainingLessons}`,
    `Total amount paid (USD): ${s.totalPaid.toFixed(2)}`,
    recent.length
      ? "Recent classes:\n" +
        recent
          .map(
            (a) =>
              `- ${a.date}: ${a.content}${a.lessonsUsed > 1 ? ` (${a.lessonsUsed} lessons)` : ""}`
          )
          .join("\n")
      : "Recent classes: none recorded yet.",
  ].join("\n");
}

export function buildAttendanceContextBlock(
  student: Student,
  attendance: ClassAttendance,
  enrollment?: { payments: PaymentRecord[]; attendances: ClassAttendance[] }
): string {
  const hobbies =
    student.hobbies?.length ?? 0 ? student.hobbies.join(", ") : "(none)";
  const loves =
    student.lovedArts?.length ?? 0 ? student.lovedArts.join(", ") : "(none)";

  const prior = (enrollment?.attendances ?? [])
    .filter((a) => a.id !== attendance.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const growthSection =
    prior.length === 0
      ? "Prior class logs: none yet — this may be an early lesson in our records."
      : "Prior class logs:\n" +
        prior
          .map((a) => {
            const theme = a.lessonTheme ? ` [${a.lessonTheme}]` : "";
            const tech = a.techniquesLearned ? ` · 技法: ${a.techniquesLearned}` : "";
            return `- ${a.date}${theme}: ${a.content}${tech}`;
          })
          .join("\n");

  return [
    "### Today's class (上课记录)",
    `Date: ${attendance.date}`,
    `Lesson theme / 课程主题: ${attendance.lessonTheme ?? attendance.content}`,
    `Class summary / 上课内容: ${attendance.content}`,
    `Techniques covered / 所学技法: ${attendance.techniquesLearned ?? "—"}`,
    `Photos attached: ${attendance.imagePaths.length}`,
    "",
    "### Student profile",
    `Name: ${student.name}`,
    `Approx. age: ${student.age ?? "—"}`,
    `Parents / guardian: ${student.parentName ?? "—"}`,
    `Hobbies: ${hobbies}`,
    `Preferred media / motifs: ${loves}`,
    `Teacher notes: ${student.notes ?? "—"}`,
    `Total classes on file: ${student.classesTaken ?? prior.length + 1}`,
    "",
    "### Growth path",
    growthSection,
    enrollment
      ? ["", buildEnrollmentContextBlock(enrollment.payments, enrollment.attendances)].join("\n")
      : "",
  ].join("\n");
}

export function buildSessionContextBlock(
  session: ClassSession,
  student: Student,
  artworksForStudent: Artwork[],
  enrollment?: { payments: PaymentRecord[]; attendances: ClassAttendance[] }
): string {
  const hobbies =
    student.hobbies?.length ?? 0 ? student.hobbies.join(", ") : "(none)";
  const loves =
    student.lovedArts?.length ?? 0 ? student.lovedArts.join(", ") : "(none)";

  const artSection =
    artworksForStudent.length === 0
      ? "Today’s artwork uploads: none on file yet."
      : artworksForStudent
          .map((a, i) => {
            const bits = [
              `${i + 1}. Title: ${a.title ?? "(untitled)"}`,
              `   Medium: ${a.medium ?? "—"}`,
              `   Instructor notes about piece: ${a.notes ?? "—"}`,
            ];
            return bits.join("\n");
          })
          .join("\n");

  return [
    "### Class session",
    `Title: ${session.title}`,
    `Type / theme: ${session.classType}`,
    `Date: ${session.date}`,
    `Lead instructor: ${session.instructor ?? "—"}`,
    `Lesson notes for this day: ${session.notes ?? "—"}`,
    "",
    "### Student profile",
    `Name: ${student.name}`,
    `Approx. age: ${student.age ?? "—"}`,
    `Parents / guardian: ${student.parentName ?? "—"}`,
    `Hobbies outside class: ${hobbies}`,
    `Preferred media / motifs: ${loves}`,
    `General teacher notes about the learner: ${student.notes ?? "—"}`,
    "",
    "### Today’s uploads for this student",
    artSection,
    enrollment
      ? ["", buildEnrollmentContextBlock(enrollment.payments, enrollment.attendances)].join("\n")
      : "",
  ].join("\n");
}
