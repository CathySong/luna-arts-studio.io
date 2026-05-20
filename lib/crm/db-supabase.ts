import { computeEnrollmentSummary } from "./enrollment";
import { getSupabaseAdmin } from "./supabase-client";
import type {
  Artwork,
  AttendanceInput,
  AttendanceReview,
  ClassAttendance,
  ClassReview,
  ClassSession,
  PaymentInput,
  PaymentRecord,
  ReviewStatus,
  SessionInput,
  Student,
  StudentEnrollmentSummary,
  StudentInput,
} from "./types";

export type StudentReviewWithContext = {
  review: ClassReview;
  session: ClassSession | null;
  artworks: Artwork[];
};

export type UpsertReviewInput = {
  id?: string;
  sessionId: string;
  studentId: string;
  content: string;
  status: ClassReview["status"];
  artworkIds: string[];
};

export type SessionContext = {
  session: ClassSession;
  artworks: Artwork[];
  reviews: ClassReview[];
};

export type StudentEnrollmentBundle = {
  payments: PaymentRecord[];
  attendances: ClassAttendance[];
  summary: StudentEnrollmentSummary;
};

export type StudentRecord = StudentEnrollmentBundle & {
  reviews: StudentReviewWithContext[];
};

// ── Row mappers ─────────────────────────────────────────────────────────────

function studentFromRow(r: Record<string, unknown>): Student {
  return {
    id: String(r.id),
    name: String(r.name),
    age: r.age != null ? Number(r.age) : undefined,
    parentName: r.parent_name != null ? String(r.parent_name) : undefined,
    parentEmail: r.parent_email != null ? String(r.parent_email) : undefined,
    parentPhone: r.parent_phone != null ? String(r.parent_phone) : undefined,
    hobbies: (r.hobbies as string[]) ?? [],
    lovedArts: (r.loved_arts as string[]) ?? [],
    notes: r.notes != null ? String(r.notes) : undefined,
    classesTaken: Number(r.classes_taken ?? 0),
    notebooklmSourceId:
      r.notebooklm_source_id != null ? String(r.notebooklm_source_id) : undefined,
    notebooklmSourceName:
      r.notebooklm_source_name != null ? String(r.notebooklm_source_name) : undefined,
    createdAt: new Date(String(r.created_at)).toISOString(),
    updatedAt: new Date(String(r.updated_at)).toISOString(),
  };
}

function studentToRow(s: Partial<Student> & { name?: string }) {
  return {
    name: s.name,
    age: s.age ?? null,
    parent_name: s.parentName ?? null,
    parent_email: s.parentEmail ?? null,
    parent_phone: s.parentPhone ?? null,
    hobbies: s.hobbies ?? [],
    loved_arts: s.lovedArts ?? [],
    notes: s.notes ?? null,
    classes_taken: s.classesTaken ?? 0,
    notebooklm_source_id: s.notebooklmSourceId ?? null,
    notebooklm_source_name: s.notebooklmSourceName ?? null,
    updated_at: new Date().toISOString(),
  };
}

function sessionFromRow(r: Record<string, unknown>): ClassSession {
  return {
    id: String(r.id),
    title: String(r.title),
    classType: String(r.class_type),
    date: String(r.date).slice(0, 10),
    instructor: r.instructor != null ? String(r.instructor) : undefined,
    notes: r.notes != null ? String(r.notes) : undefined,
    createdAt: new Date(String(r.created_at)).toISOString(),
  };
}

function artworkFromRow(r: Record<string, unknown>): Artwork {
  return {
    id: String(r.id),
    sessionId: String(r.session_id),
    studentId: String(r.student_id),
    imagePath: String(r.image_path),
    title: r.title != null ? String(r.title) : undefined,
    medium: r.medium != null ? String(r.medium) : undefined,
    notes: r.notes != null ? String(r.notes) : undefined,
    uploadedAt: new Date(String(r.uploaded_at)).toISOString(),
  };
}

function reviewFromRow(r: Record<string, unknown>): ClassReview {
  return {
    id: String(r.id),
    sessionId: String(r.session_id),
    studentId: String(r.student_id),
    content: String(r.content),
    status: r.status as ReviewStatus,
    version: Number(r.version ?? 1),
    generatedAt: new Date(String(r.generated_at)).toISOString(),
    artworkIds: (r.artwork_ids as string[]) ?? [],
  };
}

function paymentFromRow(r: Record<string, unknown>): PaymentRecord {
  return {
    id: String(r.id),
    studentId: String(r.student_id),
    amount: Number(r.amount),
    paidAt: String(r.paid_at).slice(0, 10),
    lessonsPurchased: Number(r.lessons_purchased),
    notes: r.notes != null ? String(r.notes) : undefined,
    createdAt: new Date(String(r.created_at)).toISOString(),
  };
}

function attendanceFromRow(r: Record<string, unknown>): ClassAttendance {
  return {
    id: String(r.id),
    studentId: String(r.student_id),
    date: String(r.date).slice(0, 10),
    content: String(r.content),
    lessonsUsed: Number(r.lessons_used ?? 1),
    sessionId: r.session_id != null ? String(r.session_id) : undefined,
    lessonTheme: r.lesson_theme != null ? String(r.lesson_theme) : undefined,
    techniquesLearned:
      r.techniques_learned != null ? String(r.techniques_learned) : undefined,
    imagePaths: (r.image_paths as string[]) ?? [],
    review: r.review as AttendanceReview | undefined,
    createdAt: new Date(String(r.created_at)).toISOString(),
  };
}

function sbError(context: string, error: { message: string } | null): never {
  throw new Error(`${context}: ${error?.message ?? "unknown"}`);
}

// ── Paths (local dev fallback dir; uploads use Supabase Storage) ────────────

export function getUploadDir(): string {
  return `${process.cwd()}/public/uploads/crm`;
}

export async function initDbPaths(): Promise<void> {
  /* no-op for Supabase */
}

async function syncStudentClassesTaken(studentId: string): Promise<void> {
  const sb = getSupabaseAdmin();
  const { count, error: cErr } = await sb
    .from("attendances")
    .select("*", { count: "exact", head: true })
    .eq("student_id", studentId);
  if (cErr) sbError("count attendances", cErr);

  const { error } = await sb
    .from("students")
    .update({ classes_taken: count ?? 0, updated_at: new Date().toISOString() })
    .eq("id", studentId);
  if (error) sbError("sync classes_taken", error);
}

// ── Students ────────────────────────────────────────────────────────────────

export async function listStudents(): Promise<Student[]> {
  const { data, error } = await getSupabaseAdmin().from("students").select("*").order("name");
  if (error) sbError("listStudents", error);
  return (data ?? []).map((r) => studentFromRow(r));
}

export async function listStudentsWithEnrollment() {
  const students = await listStudents();
  return Promise.all(
    students.map(async (student) => {
      const enrollment = await getStudentEnrollment(student.id);
      return { student, summary: enrollment.summary };
    })
  );
}

export async function getStudent(id: string): Promise<Student | undefined> {
  const { data, error } = await getSupabaseAdmin()
    .from("students")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) sbError("getStudent", error);
  return data ? studentFromRow(data) : undefined;
}

export async function createStudent(input: StudentInput): Promise<Student> {
  const now = new Date().toISOString();
  const row = {
    ...studentToRow({ ...input, classesTaken: input.classesTaken ?? 0 }),
    hobbies: input.hobbies ?? [],
    loved_arts: input.lovedArts ?? [],
    created_at: now,
    updated_at: now,
  };
  const { data, error } = await getSupabaseAdmin()
    .from("students")
    .insert(row)
    .select()
    .single();
  if (error) sbError("createStudent", error);
  return studentFromRow(data);
}

export async function updateStudent(
  id: string,
  patch: Partial<Omit<Student, "id" | "createdAt" | "updatedAt">>
): Promise<Student | undefined> {
  const prev = await getStudent(id);
  if (!prev) return undefined;
  const { data, error } = await getSupabaseAdmin()
    .from("students")
    .update({
      ...studentToRow({
        ...prev,
        ...patch,
        hobbies: patch.hobbies ?? prev.hobbies,
        lovedArts: patch.lovedArts ?? prev.lovedArts,
      }),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) sbError("updateStudent", error);
  return studentFromRow(data);
}

export async function deleteStudent(id: string): Promise<boolean> {
  const { error, count } = await getSupabaseAdmin()
    .from("students")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) sbError("deleteStudent", error);
  return (count ?? 0) > 0;
}

// ── Sessions ────────────────────────────────────────────────────────────────

export async function listSessions(): Promise<ClassSession[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("class_sessions")
    .select("*")
    .order("date", { ascending: false });
  if (error) sbError("listSessions", error);
  return (data ?? []).map((r) => sessionFromRow(r));
}

export async function getSession(id: string): Promise<ClassSession | undefined> {
  const { data, error } = await getSupabaseAdmin()
    .from("class_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) sbError("getSession", error);
  return data ? sessionFromRow(data) : undefined;
}

export async function createSession(input: SessionInput): Promise<ClassSession> {
  const { data, error } = await getSupabaseAdmin()
    .from("class_sessions")
    .insert({
      title: input.title,
      class_type: input.classType,
      date: input.date,
      instructor: input.instructor ?? null,
      notes: input.notes ?? null,
    })
    .select()
    .single();
  if (error) sbError("createSession", error);
  return sessionFromRow(data);
}

export async function updateSession(
  id: string,
  patch: Partial<SessionInput>
): Promise<ClassSession | undefined> {
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.classType !== undefined) row.class_type = patch.classType;
  if (patch.date !== undefined) row.date = patch.date;
  if (patch.instructor !== undefined) row.instructor = patch.instructor;
  if (patch.notes !== undefined) row.notes = patch.notes;
  if (Object.keys(row).length === 0) return getSession(id);

  const { data, error } = await getSupabaseAdmin()
    .from("class_sessions")
    .update(row)
    .eq("id", id)
    .select()
    .single();
  if (error) sbError("updateSession", error);
  return sessionFromRow(data);
}

export async function deleteSession(id: string): Promise<boolean> {
  const { error, count } = await getSupabaseAdmin()
    .from("class_sessions")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) sbError("deleteSession", error);
  return (count ?? 0) > 0;
}

// ── Artworks ────────────────────────────────────────────────────────────────

export async function listArtworks(): Promise<Artwork[]> {
  const { data, error } = await getSupabaseAdmin().from("artworks").select("*");
  if (error) sbError("listArtworks", error);
  return (data ?? []).map((r) => artworkFromRow(r));
}

export async function listArtworksBySession(sessionId: string): Promise<Artwork[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("artworks")
    .select("*")
    .eq("session_id", sessionId);
  if (error) sbError("listArtworksBySession", error);
  return (data ?? []).map((r) => artworkFromRow(r));
}

export async function getArtwork(id: string): Promise<Artwork | undefined> {
  const { data, error } = await getSupabaseAdmin()
    .from("artworks")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) sbError("getArtwork", error);
  return data ? artworkFromRow(data) : undefined;
}

export async function deleteArtwork(id: string): Promise<boolean> {
  const { error, count } = await getSupabaseAdmin()
    .from("artworks")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) sbError("deleteArtwork", error);
  return (count ?? 0) > 0;
}

export async function createArtworkRecord(input: {
  sessionId: string;
  studentId: string;
  imageRelativePath: string;
  title?: string;
  medium?: string;
  notes?: string;
}): Promise<Artwork> {
  const { data, error } = await getSupabaseAdmin()
    .from("artworks")
    .insert({
      session_id: input.sessionId,
      student_id: input.studentId,
      image_path: input.imageRelativePath,
      title: input.title ?? null,
      medium: input.medium ?? null,
      notes: input.notes ?? null,
    })
    .select()
    .single();
  if (error) sbError("createArtworkRecord", error);
  return artworkFromRow(data);
}

export async function updateArtwork(
  id: string,
  patch: Partial<Artwork>
): Promise<Artwork | undefined> {
  const row: Record<string, unknown> = {};
  if (patch.imagePath !== undefined) row.image_path = patch.imagePath;
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.medium !== undefined) row.medium = patch.medium;
  if (patch.notes !== undefined) row.notes = patch.notes;
  if (Object.keys(row).length === 0) return getArtwork(id);

  const { data, error } = await getSupabaseAdmin()
    .from("artworks")
    .update(row)
    .eq("id", id)
    .select()
    .single();
  if (error) sbError("updateArtwork", error);
  return artworkFromRow(data);
}

// ── Reviews ─────────────────────────────────────────────────────────────────

export async function listReviews(): Promise<ClassReview[]> {
  const { data, error } = await getSupabaseAdmin().from("class_reviews").select("*");
  if (error) sbError("listReviews", error);
  return (data ?? []).map((r) => reviewFromRow(r));
}

export async function getReview(id: string): Promise<ClassReview | undefined> {
  const { data, error } = await getSupabaseAdmin()
    .from("class_reviews")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) sbError("getReview", error);
  return data ? reviewFromRow(data) : undefined;
}

export async function listReviewsForSession(sessionId: string): Promise<ClassReview[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("class_reviews")
    .select("*")
    .eq("session_id", sessionId);
  if (error) sbError("listReviewsForSession", error);
  return (data ?? []).map((r) => reviewFromRow(r));
}

export async function listReviewsByStudent(studentId: string): Promise<ClassReview[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("class_reviews")
    .select("*")
    .eq("student_id", studentId)
    .order("generated_at", { ascending: false });
  if (error) sbError("listReviewsByStudent", error);
  return (data ?? []).map((r) => reviewFromRow(r));
}

export async function listStudentReviewsWithContext(
  studentId: string
): Promise<StudentReviewWithContext[]> {
  const reviews = await listReviewsByStudent(studentId);
  const sessions = await listSessions();
  const artworks = await listArtworks();
  return reviews.map((review) => ({
    review,
    session: sessions.find((s) => s.id === review.sessionId) ?? null,
    artworks: artworks.filter(
      (a) => a.studentId === studentId && review.artworkIds.includes(a.id)
    ),
  }));
}

export async function upsertReview(input: UpsertReviewInput): Promise<ClassReview> {
  const now = new Date().toISOString();
  let version = 1;
  let generatedAt = now;

  if (input.id) {
    const existing = await getReview(input.id);
    if (existing) {
      const contentChanged = existing.content !== input.content;
      version = contentChanged ? existing.version + 1 : existing.version;
      generatedAt = contentChanged ? now : existing.generatedAt;
    }
  }

  const row = {
    id: input.id,
    session_id: input.sessionId,
    student_id: input.studentId,
    content: input.content,
    status: input.status,
    version,
    generated_at: generatedAt,
    artwork_ids: input.artworkIds,
  };

  const { data, error } = await getSupabaseAdmin()
    .from("class_reviews")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();
  if (error) sbError("upsertReview", error);
  return reviewFromRow(data);
}

export async function patchReview(
  id: string,
  patch: Partial<Pick<ClassReview, "content" | "status">>
): Promise<ClassReview | undefined> {
  const prev = await getReview(id);
  if (!prev) return undefined;
  const bumpVersion =
    patch.content !== undefined && patch.content !== prev.content;
  const { data, error } = await getSupabaseAdmin()
    .from("class_reviews")
    .update({
      ...(patch.content !== undefined ? { content: patch.content } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      version: bumpVersion ? prev.version + 1 : prev.version,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) sbError("patchReview", error);
  return reviewFromRow(data);
}

export async function deleteReview(id: string): Promise<boolean> {
  const { error, count } = await getSupabaseAdmin()
    .from("class_reviews")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) sbError("deleteReview", error);
  return (count ?? 0) > 0;
}

export async function getSessionContext(sessionId: string): Promise<SessionContext | null> {
  const session = await getSession(sessionId);
  if (!session) return null;
  const artworks = await listArtworksBySession(sessionId);
  const reviews = await listReviewsForSession(sessionId);
  return { session, artworks, reviews };
}

// ── Payments & attendance ───────────────────────────────────────────────────

export async function listPaymentsByStudent(studentId: string): Promise<PaymentRecord[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("payments")
    .select("*")
    .eq("student_id", studentId)
    .order("paid_at", { ascending: false });
  if (error) sbError("listPaymentsByStudent", error);
  return (data ?? []).map((r) => paymentFromRow(r));
}

export async function createPayment(
  studentId: string,
  input: PaymentInput
): Promise<PaymentRecord> {
  const { data, error } = await getSupabaseAdmin()
    .from("payments")
    .insert({
      student_id: studentId,
      amount: input.amount,
      paid_at: input.paidAt,
      lessons_purchased: input.lessonsPurchased,
      notes: input.notes ?? null,
    })
    .select()
    .single();
  if (error) sbError("createPayment", error);
  return paymentFromRow(data);
}

export async function deletePayment(id: string): Promise<boolean> {
  const { error, count } = await getSupabaseAdmin()
    .from("payments")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) sbError("deletePayment", error);
  return (count ?? 0) > 0;
}

export async function listAttendancesByStudent(
  studentId: string
): Promise<ClassAttendance[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("attendances")
    .select("*")
    .eq("student_id", studentId)
    .order("date", { ascending: false });
  if (error) sbError("listAttendancesByStudent", error);
  return (data ?? []).map((r) => attendanceFromRow(r));
}

export async function getAttendance(id: string): Promise<ClassAttendance | undefined> {
  const { data, error } = await getSupabaseAdmin()
    .from("attendances")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) sbError("getAttendance", error);
  return data ? attendanceFromRow(data) : undefined;
}

export async function updateAttendance(
  id: string,
  patch: Partial<
    Pick<ClassAttendance, "content" | "lessonTheme" | "techniquesLearned" | "imagePaths" | "review">
  >
): Promise<ClassAttendance | undefined> {
  const row: Record<string, unknown> = {};
  if (patch.content !== undefined) row.content = patch.content;
  if (patch.lessonTheme !== undefined) row.lesson_theme = patch.lessonTheme;
  if (patch.techniquesLearned !== undefined) row.techniques_learned = patch.techniquesLearned;
  if (patch.imagePaths !== undefined) row.image_paths = patch.imagePaths;
  if (patch.review !== undefined) row.review = patch.review;
  if (Object.keys(row).length === 0) return getAttendance(id);

  const { data, error } = await getSupabaseAdmin()
    .from("attendances")
    .update(row)
    .eq("id", id)
    .select()
    .single();
  if (error) sbError("updateAttendance", error);
  return attendanceFromRow(data);
}

export async function createAttendance(
  studentId: string,
  input: AttendanceInput
): Promise<ClassAttendance> {
  const { data, error } = await getSupabaseAdmin()
    .from("attendances")
    .insert({
      student_id: studentId,
      session_id: input.sessionId ?? null,
      date: input.date,
      content: input.content,
      lessons_used: input.lessonsUsed ?? 1,
      lesson_theme: input.lessonTheme ?? null,
      techniques_learned: input.techniquesLearned ?? null,
      image_paths: input.imagePaths ?? [],
      review: input.review ?? null,
    })
    .select()
    .single();
  if (error) sbError("createAttendance", error);
  await syncStudentClassesTaken(studentId);
  return attendanceFromRow(data);
}

export async function deleteAttendance(id: string): Promise<boolean> {
  const row = await getAttendance(id);
  if (!row) return false;
  const { error, count } = await getSupabaseAdmin()
    .from("attendances")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) sbError("deleteAttendance", error);
  if ((count ?? 0) > 0) await syncStudentClassesTaken(row.studentId);
  return (count ?? 0) > 0;
}

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

export async function getStudentRecord(studentId: string): Promise<StudentRecord | null> {
  const student = await getStudent(studentId);
  if (!student) return null;
  const enrollment = await getStudentEnrollment(studentId);
  const reviews = await listStudentReviewsWithContext(studentId);
  return { ...enrollment, reviews };
}
