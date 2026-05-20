import { readFileSync } from "fs";
import { join } from "path";

const DEFAULT_PROMPT_REL = "lib/crm/prompts/attendance-review.md";

let cachedFilePrompt: string | null = null;

function resolvePromptFilePath(): string {
  const custom = process.env.ATTENDANCE_REVIEW_PROMPT_PATH?.trim();
  if (custom) {
    return custom.startsWith("/") ? custom : join(process.cwd(), custom);
  }
  return join(process.cwd(), DEFAULT_PROMPT_REL);
}

const PROMPT_FALLBACK =
  "你是 Luna Art Studio 的老师，为学生撰写温暖、专业的课堂点评，夸赞创造力并给出 1–2 条可操作建议。";

/** Load structured prompt from markdown (cached per process). */
export function loadAttendanceReviewPromptFromFile(): string {
  if (cachedFilePrompt) return cachedFilePrompt;
  try {
    cachedFilePrompt = readFileSync(resolvePromptFilePath(), "utf8").trim();
  } catch {
    cachedFilePrompt = PROMPT_FALLBACK;
  }
  return cachedFilePrompt;
}

/**
 * System prompt for 上课记录 AI 点评.
 * Priority: per-request override → ATTENDANCE_REVIEW_SYSTEM_PROMPT env → attendance-review.md
 */
export function getAttendanceReviewSystemPrompt(override?: string): string {
  if (override?.trim()) return override.trim();
  const fromEnv = process.env.ATTENDANCE_REVIEW_SYSTEM_PROMPT?.trim();
  if (fromEnv) return fromEnv;
  return loadAttendanceReviewPromptFromFile();
}
