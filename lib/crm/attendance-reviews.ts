import {
  getAttendance,
  getStudent,
  getStudentEnrollment,
  updateAttendance,
} from "./db";
import { buildAttendanceContextBlock } from "./knowledge";
import { readImageAsClaudeBlock } from "./upload-image";
import { formatLlmError, generateClaudeText } from "./llm";
import { getAttendanceReviewSystemPrompt } from "./prompts/attendance-review";
import type { AttendanceReview, ClassAttendance } from "./types";

export function getDefaultAttendanceReviewPrompt(): string {
  return getAttendanceReviewSystemPrompt();
}

export async function generateAttendanceReview(
  attendanceId: string,
  options?: { customPrompt?: string }
): Promise<ClassAttendance> {
  const row = await getAttendance(attendanceId);
  if (!row) throw new Error("Attendance not found");

  const student = await getStudent(row.studentId);
  if (!student) throw new Error("Student not found");

  const enrollment = await getStudentEnrollment(row.studentId);
  const contextBlock = buildAttendanceContextBlock(student, row, enrollment);
  const systemPrompt = getAttendanceReviewSystemPrompt(options?.customPrompt);

  const images = [];
  for (const p of row.imagePaths) {
    const block = await readImageAsClaudeBlock(p);
    if (block) images.push(block);
  }

  const userMessage = [
    "请根据以下学生与本次上课信息，撰写发给家长的个性化课堂点评。",
    images.length
      ? `已附上 ${images.length} 张课堂作品照片，请结合画面具体点评。`
      : "本次未附作品照片，请根据文字记录撰写。",
    "",
    contextBlock,
  ].join("\n");

  let content: string;
  try {
    content = await generateClaudeText(systemPrompt, userMessage, images);
  } catch (err) {
    throw new Error(formatLlmError(err));
  }

  const prev = row.review;
  const review: AttendanceReview = {
    content,
    status: "generated",
    version: prev ? prev.version + 1 : 1,
    generatedAt: new Date().toISOString(),
    systemPrompt,
  };

  const updated = await updateAttendance(attendanceId, { review });
  if (!updated) throw new Error("Failed to save review");
  return updated;
}

export async function approveAttendanceReview(
  attendanceId: string
): Promise<ClassAttendance | undefined> {
  const row = await getAttendance(attendanceId);
  if (!row?.review) return undefined;
  return updateAttendance(attendanceId, {
    review: { ...row.review, status: "approved" },
  });
}
