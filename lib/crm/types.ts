export interface Student {
  id: string;
  name: string;
  age?: number;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  hobbies: string[];
  lovedArts: string[];
  notes?: string;
  classesTaken: number;
  notebooklmSourceId?: string;
  notebooklmSourceName?: string;
  /** Default price per lesson in USD (copied to attendance.price_override when null) */
  defaultPrice?: number;
  /** Lead source: referral|instagram|wechat|xiaohongshu|google|walkin|summer_camp|other */
  source?: string;
  /** Free-text source when source=other */
  sourceCustom?: string;
  createdAt: string;
  updatedAt: string;
}

/** Canonical lead-source values used in the students.source column. */
export const LEAD_SOURCES = [
  { value: "referral", label: "Referral / 老学员介绍" },
  { value: "instagram", label: "Instagram" },
  { value: "wechat", label: "WeChat 朋友圈" },
  { value: "xiaohongshu", label: "小红书" },
  { value: "google", label: "Google 搜索" },
  { value: "walkin", label: "Walk-in 路过店面" },
  { value: "summer_camp", label: "Summer Camp / 活动" },
  { value: "other", label: "其它 (see source_custom)" },
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number]["value"];

export interface ClassSession {
  id: string;
  title: string;
  classType: string;
  date: string;
  instructor?: string;
  notes?: string;
  createdAt: string;
}

export interface Artwork {
  id: string;
  sessionId: string;
  studentId: string;
  imagePath: string;
  title?: string;
  medium?: string;
  notes?: string;
  uploadedAt: string;
}

export type ReviewStatus = "draft" | "generated" | "approved";

export interface ClassReview {
  id: string;
  sessionId: string;
  studentId: string;
  content: string;
  status: ReviewStatus;
  version: number;
  generatedAt: string;
  artworkIds: string[];
}

/** 单次付款（可包含购买的课时包） */
export interface PaymentRecord {
  id: string;
  studentId: string;
  amount: number;
  paidAt: string; // YYYY-MM-DD
  lessonsPurchased: number;
  notes?: string;
  createdAt: string;
}

/** AI 点评 attached to an attendance log */
export interface AttendanceReview {
  content: string;
  status: ReviewStatus;
  version: number;
  generatedAt: string;
  /** System prompt snapshot used at generation time */
  systemPrompt?: string;
}

/** 单次上课记录（消耗 1 课时，除非 lessonsUsed 指定） */
export interface ClassAttendance {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  content: string;
  lessonsUsed: number;
  sessionId?: string;
  /** 本次课程主题 */
  lessonTheme?: string;
  /** 本节课学到的技法（自由文本） */
  techniquesLearned?: string;
  /** 课堂作品照片 */
  imagePaths: string[];
  /** AI 生成的个性化点评 */
  review?: AttendanceReview;
  /** Per-attendance price override (USD); falls back to student.defaultPrice. NULL = use default. */
  priceOverride?: number;
  /** Local class start time, e.g. "15:30" */
  startTime?: string;
  /** Class duration in minutes; defaults to 60. */
  durationMinutes?: number;
  createdAt: string;
}

export interface StudentEnrollmentSummary {
  totalLessons: number;
  usedLessons: number;
  remainingLessons: number;
  totalPaid: number;
}

export interface CrmDatabase {
  students: Student[];
  sessions: ClassSession[];
  artworks: Artwork[];
  reviews: ClassReview[];
  payments: PaymentRecord[];
  attendances: ClassAttendance[];
}

export type StudentInput = Omit<
  Student,
  "id" | "createdAt" | "updatedAt" | "notebooklmSourceId" | "notebooklmSourceName"
>;

export type SessionInput = Omit<ClassSession, "id" | "createdAt">;

export type PaymentInput = Omit<PaymentRecord, "id" | "studentId" | "createdAt">;

export type AttendanceInput = Omit<ClassAttendance, "id" | "studentId" | "createdAt">;
