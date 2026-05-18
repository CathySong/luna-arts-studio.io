import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { computeEnrollmentSummary } from "./enrollment";
import type {
  Artwork,
  AttendanceInput,
  ClassAttendance,
  ClassReview,
  ClassSession,
  CrmDatabase,
  PaymentInput,
  PaymentRecord,
  SessionInput,
  Student,
  StudentEnrollmentSummary,
  StudentInput,
} from "./types";

const DB_PATH = join(process.cwd(), "data/crm/db.json");
const CRM_UPLOAD_ROOT = join(process.cwd(), "public/uploads/crm");

let lockChain: Promise<unknown> = Promise.resolve();

function runQueued<T>(fn: () => Promise<T>): Promise<T> {
  const job = lockChain.then(() => fn());
  lockChain = job.then(
    () => undefined,
    () => undefined
  );
  return job;
}

function ensureReviewShape(r: ClassReview): ClassReview {
  return {
    ...r,
    artworkIds: r.artworkIds ?? [],
    version: r.version ?? 1,
    status: r.status ?? "draft",
    generatedAt: r.generatedAt ?? new Date().toISOString(),
  };
}

async function readDbUnchecked(): Promise<CrmDatabase> {
  try {
    const raw = await readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as CrmDatabase;
    return {
      students: parsed.students ?? [],
      sessions: parsed.sessions ?? [],
      artworks: parsed.artworks ?? [],
      reviews: (parsed.reviews ?? []).map(ensureReviewShape),
      payments: parsed.payments ?? [],
      attendances: (parsed.attendances ?? []).map(ensureAttendanceShape),
    };
  } catch {
    await mkdir(dirname(DB_PATH), { recursive: true });
    return {
      students: [],
      sessions: [],
      artworks: [],
      reviews: [],
      payments: [],
      attendances: [],
    };
  }
}

function ensureAttendanceShape(a: ClassAttendance): ClassAttendance {
  return {
    ...a,
    lessonsUsed: a.lessonsUsed ?? 1,
    content: a.content ?? "",
    imagePaths: a.imagePaths ?? [],
    review: a.review
      ? {
          ...a.review,
          version: a.review.version ?? 1,
          status: a.review.status ?? "generated",
          generatedAt: a.review.generatedAt ?? new Date().toISOString(),
        }
      : undefined,
  };
}

async function writeDbUnchecked(db: CrmDatabase): Promise<void> {
  await mkdir(dirname(DB_PATH), { recursive: true });
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

async function withDb<T>(fn: (db: CrmDatabase) => Promise<{ next: CrmDatabase; result: T }>): Promise<T> {
  return runQueued(async () => {
    const db = await readDbUnchecked();
    const { next, result } = await fn(db);
    await writeDbUnchecked(next);
    return result;
  });
}

export function getUploadDir(): string {
  return CRM_UPLOAD_ROOT;
}

async function validatePaths(): Promise<void> {
  await mkdir(dirname(DB_PATH), { recursive: true });
  await mkdir(CRM_UPLOAD_ROOT, { recursive: true });
}

export async function initDbPaths(): Promise<void> {
  await validatePaths();
}

export async function listStudents(): Promise<Student[]> {
  const db = await readDbUnchecked();
  return db.students;
}

export async function listStudentsWithEnrollment() {
  const db = await readDbUnchecked();
  return db.students.map((student) => {
    const payments = db.payments.filter((p) => p.studentId === student.id);
    const attendances = db.attendances.filter((a) => a.studentId === student.id);
    return {
      student,
      summary: computeEnrollmentSummary(payments, attendances),
    };
  });
}

export async function getStudent(id: string): Promise<Student | undefined> {
  const db = await readDbUnchecked();
  return db.students.find((s) => s.id === id);
}

export async function createStudent(input: StudentInput): Promise<Student> {
  const now = new Date().toISOString();
  const student: Student = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await withDb(async (db) => ({
    next: { ...db, students: [...db.students, student] },
    result: undefined,
  }));
  return student;
}

export async function updateStudent(
  id: string,
  patch: Partial<Omit<Student, "id" | "createdAt" | "updatedAt">>
): Promise<Student | undefined> {
  return withDb(async (db) => {
    const idx = db.students.findIndex((s) => s.id === id);
    if (idx === -1) return { next: db, result: undefined };
    const prev = db.students[idx];
    const nextStudent: Student = {
      ...prev,
      ...patch,
      hobbies: patch.hobbies ?? prev.hobbies,
      lovedArts: patch.lovedArts ?? prev.lovedArts,
      classesTaken:
        patch.classesTaken !== undefined ? patch.classesTaken : prev.classesTaken,
      updatedAt: new Date().toISOString(),
    };
    const students = [...db.students];
    students[idx] = nextStudent;
    return { next: { ...db, students }, result: nextStudent };
  });
}

export async function deleteStudent(id: string): Promise<boolean> {
  return withDb(async (db) => {
    const before = db.students.length;
    const students = db.students.filter((s) => s.id !== id);
    if (students.length === before) return { next: db, result: false };
    const artworks = db.artworks.filter((a) => a.studentId !== id);
    const reviews = db.reviews.filter((r) => r.studentId !== id);
    const payments = db.payments.filter((p) => p.studentId !== id);
    const attendances = db.attendances.filter((a) => a.studentId !== id);
    return {
      next: { ...db, students, artworks, reviews, payments, attendances },
      result: true,
    };
  });
}

export async function listSessions(): Promise<ClassSession[]> {
  const db = await readDbUnchecked();
  return db.sessions;
}

export async function getSession(id: string): Promise<ClassSession | undefined> {
  const db = await readDbUnchecked();
  return db.sessions.find((s) => s.id === id);
}

export async function createSession(input: SessionInput): Promise<ClassSession> {
  const session: ClassSession = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await withDb(async (db) => ({
    next: { ...db, sessions: [...db.sessions, session] },
    result: undefined,
  }));
  return session;
}

export async function updateSession(
  id: string,
  patch: Partial<Omit<SessionInput, never>>
): Promise<ClassSession | undefined> {
  return withDb(async (db) => {
    const idx = db.sessions.findIndex((s) => s.id === id);
    if (idx === -1) return { next: db, result: undefined };
    const prev = db.sessions[idx];
    const nextSession: ClassSession = { ...prev, ...patch };
    const sessions = [...db.sessions];
    sessions[idx] = nextSession;
    return { next: { ...db, sessions }, result: nextSession };
  });
}

export async function deleteSession(id: string): Promise<boolean> {
  return withDb(async (db) => {
    const before = db.sessions.length;
    const sessions = db.sessions.filter((s) => s.id !== id);
    if (sessions.length === before) return { next: db, result: false };
    const artworks = db.artworks.filter((a) => a.sessionId !== id);
    const reviews = db.reviews.filter((r) => r.sessionId !== id);
    return {
      next: { ...db, sessions, artworks, reviews },
      result: true,
    };
  });
}

export async function listArtworks(): Promise<Artwork[]> {
  const db = await readDbUnchecked();
  return db.artworks;
}

export async function listArtworksBySession(sessionId: string): Promise<Artwork[]> {
  const db = await readDbUnchecked();
  return db.artworks.filter((a) => a.sessionId === sessionId);
}

export async function getArtwork(id: string): Promise<Artwork | undefined> {
  const db = await readDbUnchecked();
  return db.artworks.find((a) => a.id === id);
}

export async function deleteArtwork(id: string): Promise<boolean> {
  return withDb(async (db) => {
    const idx = db.artworks.findIndex((a) => a.id === id);
    if (idx === -1) return { next: db, result: false };
    const artworks = db.artworks.filter((a) => a.id !== id);
    const reviews = db.reviews.map((r) => ({
      ...r,
      artworkIds: r.artworkIds.filter((aid) => aid !== id),
    }));
    return { next: { ...db, artworks, reviews }, result: true };
  });
}

/** Public-relative path saved in DB e.g. /uploads/crm/session-student-ts.ext */
export async function createArtworkRecord(input: {
  sessionId: string;
  studentId: string;
  imageRelativePath: string;
  title?: string;
  medium?: string;
  notes?: string;
}): Promise<Artwork> {
  const artwork: Artwork = {
    id: crypto.randomUUID(),
    sessionId: input.sessionId,
    studentId: input.studentId,
    imagePath: input.imageRelativePath,
    title: input.title,
    medium: input.medium,
    notes: input.notes,
    uploadedAt: new Date().toISOString(),
  };
  await withDb(async (db) => ({
    next: { ...db, artworks: [...db.artworks, artwork] },
    result: undefined,
  }));
  return artwork;
}

export async function updateArtwork(id: string, patch: Partial<Artwork>): Promise<Artwork | undefined> {
  return withDb(async (db) => {
    const idx = db.artworks.findIndex((a) => a.id === id);
    if (idx === -1) return { next: db, result: undefined };
    const prev = db.artworks[idx];
    const nextArt: Artwork = { ...prev, ...patch, id: prev.id, sessionId: prev.sessionId, studentId: prev.studentId };
    const artworks = [...db.artworks];
    artworks[idx] = nextArt;
    return { next: { ...db, artworks }, result: nextArt };
  });
}

export async function listReviews(): Promise<ClassReview[]> {
  const db = await readDbUnchecked();
  return db.reviews.map(ensureReviewShape);
}

export async function getReview(id: string): Promise<ClassReview | undefined> {
  const db = await readDbUnchecked();
  const r = db.reviews.find((rev) => rev.id === id);
  return r ? ensureReviewShape(r) : undefined;
}

export async function listReviewsForSession(sessionId: string): Promise<ClassReview[]> {
  const db = await readDbUnchecked();
  return db.reviews.filter((r) => r.sessionId === sessionId).map(ensureReviewShape);
}

export async function listReviewsByStudent(studentId: string): Promise<ClassReview[]> {
  const db = await readDbUnchecked();
  return db.reviews
    .filter((r) => r.studentId === studentId)
    .map(ensureReviewShape)
    .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
}

export type StudentReviewWithContext = {
  review: ClassReview;
  session: ClassSession | null;
  artworks: Artwork[];
};

export async function listStudentReviewsWithContext(
  studentId: string
): Promise<StudentReviewWithContext[]> {
  const db = await readDbUnchecked();
  const reviews = await listReviewsByStudent(studentId);
  return reviews.map((review) => ({
    review,
    session: db.sessions.find((s) => s.id === review.sessionId) ?? null,
    artworks: db.artworks.filter(
      (a) => a.studentId === studentId && review.artworkIds.includes(a.id)
    ),
  }));
}

export type UpsertReviewInput = {
  id?: string;
  sessionId: string;
  studentId: string;
  content: string;
  status: ClassReview["status"];
  artworkIds: string[];
};

export async function upsertReview(input: UpsertReviewInput): Promise<ClassReview> {
  const now = new Date().toISOString();

  return withDb(async (db) => {
    const existingIdx =
      input.id === undefined ? -1 : db.reviews.findIndex((r) => r.id === input.id);

    let version = 1;
    let generatedAt = now;

    if (existingIdx >= 0) {
      const existing = ensureReviewShape(db.reviews[existingIdx]);
      const contentChanged = existing.content !== input.content;
      version = contentChanged ? existing.version + 1 : existing.version;
      generatedAt = contentChanged ? now : existing.generatedAt ?? now;
    }

    const finalized: ClassReview = ensureReviewShape({
      id: input.id ?? crypto.randomUUID(),
      sessionId: input.sessionId,
      studentId: input.studentId,
      content: input.content,
      status: input.status,
      version,
      generatedAt,
      artworkIds: input.artworkIds,
    });

    const reviews =
      existingIdx >= 0
        ? db.reviews.map((r, i) => (i === existingIdx ? finalized : r))
        : [...db.reviews, finalized];

    return { next: { ...db, reviews }, result: finalized };
  });
}

/** Manual patch after generation (approve / edit text without LLM bump) */
export async function patchReview(
  id: string,
  patch: Partial<Pick<ClassReview, "content" | "status">>
): Promise<ClassReview | undefined> {
  return withDb(async (db) => {
    const idx = db.reviews.findIndex((r) => r.id === id);
    if (idx === -1) return { next: db, result: undefined };
    const prev = ensureReviewShape(db.reviews[idx]);
    const bumpVersion =
      patch.content !== undefined && patch.content !== prev.content;
    const next: ClassReview = {
      ...prev,
      ...(patch.content !== undefined ? { content: patch.content } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      version: bumpVersion ? prev.version + 1 : prev.version,
    };
    const reviews = [...db.reviews];
    reviews[idx] = next;
    return { next: { ...db, reviews }, result: next };
  });
}

export async function deleteReview(id: string): Promise<boolean> {
  return withDb(async (db) => {
    const before = db.reviews.length;
    const reviews = db.reviews.filter((r) => r.id !== id);
    if (reviews.length === before) return { next: db, result: false };
    return { next: { ...db, reviews }, result: true };
  });
}

export type SessionContext = {
  session: ClassSession;
  artworks: Artwork[];
  reviews: ClassReview[];
};

export async function getSessionContext(sessionId: string): Promise<SessionContext | null> {
  const db = await readDbUnchecked();
  const session = db.sessions.find((s) => s.id === sessionId);
  if (!session) return null;

  const artworks = db.artworks.filter((a) => a.sessionId === sessionId);
  const reviews = db.reviews.filter((r) => r.sessionId === sessionId).map(ensureReviewShape);

  return { session, artworks, reviews };
}

// ── Payments & attendance ───────────────────────────────────────────────────

export async function listPaymentsByStudent(studentId: string): Promise<PaymentRecord[]> {
  const db = await readDbUnchecked();
  return db.payments
    .filter((p) => p.studentId === studentId)
    .sort((a, b) => b.paidAt.localeCompare(a.paidAt));
}

export async function createPayment(
  studentId: string,
  input: PaymentInput
): Promise<PaymentRecord> {
  const payment: PaymentRecord = {
    id: crypto.randomUUID(),
    studentId,
    amount: input.amount,
    paidAt: input.paidAt,
    lessonsPurchased: input.lessonsPurchased,
    notes: input.notes,
    createdAt: new Date().toISOString(),
  };
  await withDb(async (db) => ({
    next: { ...db, payments: [...db.payments, payment] },
    result: undefined,
  }));
  return payment;
}

export async function deletePayment(id: string): Promise<boolean> {
  return withDb(async (db) => {
    const before = db.payments.length;
    const payments = db.payments.filter((p) => p.id !== id);
    if (payments.length === before) return { next: db, result: false };
    return { next: { ...db, payments }, result: true };
  });
}

export async function listAttendancesByStudent(
  studentId: string
): Promise<ClassAttendance[]> {
  const db = await readDbUnchecked();
  return db.attendances
    .filter((a) => a.studentId === studentId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

async function syncStudentClassesTaken(studentId: string, db: CrmDatabase) {
  const count = db.attendances.filter((a) => a.studentId === studentId).length;
  const idx = db.students.findIndex((s) => s.id === studentId);
  if (idx === -1) return db;
  const students = [...db.students];
  students[idx] = {
    ...students[idx],
    classesTaken: count,
    updatedAt: new Date().toISOString(),
  };
  return { ...db, students };
}

export async function getAttendance(id: string): Promise<ClassAttendance | undefined> {
  const db = await readDbUnchecked();
  const row = db.attendances.find((a) => a.id === id);
  return row ? ensureAttendanceShape(row) : undefined;
}

export async function updateAttendance(
  id: string,
  patch: Partial<
    Pick<
      ClassAttendance,
      | "content"
      | "lessonTheme"
      | "techniquesLearned"
      | "imagePaths"
      | "review"
    >
  >
): Promise<ClassAttendance | undefined> {
  return withDb(async (db) => {
    const idx = db.attendances.findIndex((a) => a.id === id);
    if (idx === -1) return { next: db, result: undefined };
    const prev = ensureAttendanceShape(db.attendances[idx]);
    const nextRow = ensureAttendanceShape({ ...prev, ...patch });
    const attendances = [...db.attendances];
    attendances[idx] = nextRow;
    return { next: { ...db, attendances }, result: nextRow };
  });
}

export async function createAttendance(
  studentId: string,
  input: AttendanceInput
): Promise<ClassAttendance> {
  const attendance: ClassAttendance = ensureAttendanceShape({
    id: crypto.randomUUID(),
    studentId,
    date: input.date,
    content: input.content,
    lessonsUsed: input.lessonsUsed ?? 1,
    sessionId: input.sessionId,
    lessonTheme: input.lessonTheme,
    techniquesLearned: input.techniquesLearned,
    imagePaths: input.imagePaths ?? [],
    review: input.review,
    createdAt: new Date().toISOString(),
  });

  await withDb(async (db) => {
    let next: CrmDatabase = {
      ...db,
      attendances: [...db.attendances, attendance],
    };
    next = await syncStudentClassesTaken(studentId, next);
    return { next, result: undefined };
  });

  return attendance;
}

export async function deleteAttendance(id: string): Promise<boolean> {
  return withDb(async (db) => {
    const row = db.attendances.find((a) => a.id === id);
    if (!row) return { next: db, result: false };
    let next: CrmDatabase = {
      ...db,
      attendances: db.attendances.filter((a) => a.id !== id),
    };
    next = await syncStudentClassesTaken(row.studentId, next);
    return { next, result: true };
  });
}

export type StudentEnrollmentBundle = {
  payments: PaymentRecord[];
  attendances: ClassAttendance[];
  summary: StudentEnrollmentSummary;
};

export async function getStudentEnrollment(
  studentId: string
): Promise<StudentEnrollmentBundle> {
  const payments = await listPaymentsByStudent(studentId);
  const attendances = await listAttendancesByStudent(studentId);
  return {
    payments,
    attendances,
    summary: computeEnrollmentSummary(payments, attendances),
  };
}

export type StudentRecord = StudentEnrollmentBundle & {
  reviews: StudentReviewWithContext[];
};

export async function getStudentRecord(studentId: string): Promise<StudentRecord | null> {
  const student = await getStudent(studentId);
  if (!student) return null;
  const enrollment = await getStudentEnrollment(studentId);
  const reviews = await listStudentReviewsWithContext(studentId);
  return { ...enrollment, reviews };
}
