import {
  getSession,
  getStudent,
  getSessionContext,
  getStudentEnrollment,
  listArtworksBySession,
  upsertReview,
} from "./db";
import { buildSessionContextBlock } from "./knowledge";
import { formatLlmError, generateClaudeText } from "./llm";
import { isNotebookLmConfigured } from "./notebooklm";
import type { ClassReview } from "./types";

const SYSTEM_PROMPT = `You are a warm, encouraging art instructor at Luna Art Studio writing personalized class reviews for students and their parents.

Write in English unless the student profile suggests another language preference.

Guidelines:
- Reference the student's hobbies, favorite art forms, and class history naturally
- Comment specifically on today's artwork when details are provided
- Highlight growth, effort, creativity, and one gentle suggestion for next time
- Tone: professional yet caring, 150–250 words
- Do NOT use bullet points; write flowing paragraphs
- Sign off warmly as "— Luna Art Studio"`;

async function generateReviewText(contextBlock: string): Promise<string> {
  const kbNote = isNotebookLmConfigured()
    ? "\n\n(Student background is also synced to our NotebookLM knowledge base for long-term memory.)"
    : "";

  try {
    return await generateClaudeText(
      SYSTEM_PROMPT,
      `Write a personalized class review based on this context:${kbNote}\n\n${contextBlock}`
    );
  } catch (err) {
    throw new Error(formatLlmError(err));
  }
}

export async function generateReviewForStudent(
  sessionId: string,
  studentId: string,
  existingReviewId?: string
): Promise<ClassReview> {
  const session = await getSession(sessionId);
  const student = await getStudent(studentId);
  if (!session || !student) {
    throw new Error("Session or student not found");
  }

  const artworks = await listArtworksBySession(sessionId);
  const studentArtworks = artworks.filter((a) => a.studentId === studentId);

  if (studentArtworks.length === 0) {
    throw new Error(
      `No artwork uploaded for ${student.name}. Upload artwork before generating a review.`
    );
  }

  const enrollment = await getStudentEnrollment(studentId);
  const contextBlock = buildSessionContextBlock(
    session,
    student,
    studentArtworks,
    enrollment
  );
  const content = await generateReviewText(contextBlock);

  return upsertReview({
    id: existingReviewId,
    sessionId,
    studentId,
    content,
    status: "generated",
    artworkIds: studentArtworks.map((a) => a.id),
  });
}

export async function generateAllSessionReviews(sessionId: string) {
  const ctx = await getSessionContext(sessionId);
  if (!ctx) throw new Error("Session not found");

  const studentIds = Array.from(new Set(ctx.artworks.map((a) => a.studentId)));
  const generated: ClassReview[] = [];
  const errors: Array<{ studentId: string; error: string }> = [];

  for (const studentId of studentIds) {
    try {
      const existing = ctx.reviews.find((r) => r.studentId === studentId);
      const review = await generateReviewForStudent(
        sessionId,
        studentId,
        existing?.id
      );
      generated.push(review);
    } catch (e) {
      errors.push({
        studentId,
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  return { generated, errors };
}
