/**
 * CRM storage facade — `CRM_STORAGE=json` (local) or `CRM_STORAGE=supabase` (production).
 */
import { isSupabaseConfigured } from "./supabase-client";
import { formatSupabaseConfigError } from "./supabase-env";

export type {
  StudentReviewWithContext,
  UpsertReviewInput,
  SessionContext,
  StudentEnrollmentBundle,
  StudentRecord,
} from "./db-json";

import * as json from "./db-json";
import * as supabase from "./db-supabase";

export type CrmStorageBackend = "json" | "supabase";

/** Which CRM backend is active (throws if misconfigured on Vercel). */
export function getCrmStorageBackend(): CrmStorageBackend {
  const mode = process.env.CRM_STORAGE?.trim().toLowerCase();

  if (mode === "json") return "json";

  if (isSupabaseConfigured()) {
    return "supabase";
  }

  if (mode === "supabase" || process.env.VERCEL) {
    throw new Error(formatSupabaseConfigError());
  }

  return "json";
}

function impl() {
  return getCrmStorageBackend() === "supabase" ? supabase : json;
}

export const getUploadDir = () => impl().getUploadDir();
export const initDbPaths = () => impl().initDbPaths();
export const listStudents = () => impl().listStudents();
export const listStudentsWithEnrollment = () => impl().listStudentsWithEnrollment();
export const getStudent = (id: string) => impl().getStudent(id);
export const createStudent = (input: Parameters<typeof json.createStudent>[0]) =>
  impl().createStudent(input);
export const updateStudent = (
  id: string,
  patch: Parameters<typeof json.updateStudent>[1]
) => impl().updateStudent(id, patch);
export const deleteStudent = (id: string) => impl().deleteStudent(id);
export const listSessions = () => impl().listSessions();
export const getSession = (id: string) => impl().getSession(id);
export const createSession = (input: Parameters<typeof json.createSession>[0]) =>
  impl().createSession(input);
export const updateSession = (
  id: string,
  patch: Parameters<typeof json.updateSession>[1]
) => impl().updateSession(id, patch);
export const deleteSession = (id: string) => impl().deleteSession(id);
export const listArtworks = () => impl().listArtworks();
export const listArtworksBySession = (sessionId: string) =>
  impl().listArtworksBySession(sessionId);
export const getArtwork = (id: string) => impl().getArtwork(id);
export const deleteArtwork = (id: string) => impl().deleteArtwork(id);
export const createArtworkRecord = (
  input: Parameters<typeof json.createArtworkRecord>[0]
) => impl().createArtworkRecord(input);
export const updateArtwork = (
  id: string,
  patch: Parameters<typeof json.updateArtwork>[1]
) => impl().updateArtwork(id, patch);
export const listReviews = () => impl().listReviews();
export const getReview = (id: string) => impl().getReview(id);
export const listReviewsForSession = (sessionId: string) =>
  impl().listReviewsForSession(sessionId);
export const listReviewsByStudent = (studentId: string) =>
  impl().listReviewsByStudent(studentId);
export const listStudentReviewsWithContext = (studentId: string) =>
  impl().listStudentReviewsWithContext(studentId);
export const upsertReview = (input: Parameters<typeof json.upsertReview>[0]) =>
  impl().upsertReview(input);
export const patchReview = (
  id: string,
  patch: Parameters<typeof json.patchReview>[1]
) => impl().patchReview(id, patch);
export const deleteReview = (id: string) => impl().deleteReview(id);
export const getSessionContext = (sessionId: string) => impl().getSessionContext(sessionId);
export const listPaymentsByStudent = (studentId: string) =>
  impl().listPaymentsByStudent(studentId);
export const createPayment = (
  studentId: string,
  input: Parameters<typeof json.createPayment>[1]
) => impl().createPayment(studentId, input);
export const deletePayment = (id: string) => impl().deletePayment(id);
export const listAttendancesByStudent = (studentId: string) =>
  impl().listAttendancesByStudent(studentId);
export const getAttendance = (id: string) => impl().getAttendance(id);
export const updateAttendance = (
  id: string,
  patch: Parameters<typeof json.updateAttendance>[1]
) => impl().updateAttendance(id, patch);
export const createAttendance = (
  studentId: string,
  input: Parameters<typeof json.createAttendance>[1]
) => impl().createAttendance(studentId, input);
export const deleteAttendance = (id: string) => impl().deleteAttendance(id);
export const getStudentEnrollment = (studentId: string) =>
  impl().getStudentEnrollment(studentId);
export const getStudentRecord = (studentId: string) => impl().getStudentRecord(studentId);
