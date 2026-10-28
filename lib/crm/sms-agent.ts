import twilio from "twilio";

import { getSupabaseAdmin } from "./supabase-client";
import { listStudents, updateStudent } from "./db";
import type { Student } from "./types";

export type SmsConsentStatus = "unknown" | "opted_in" | "opted_out";

export type SmsStudentSetting = {
  studentId: string;
  enabled: boolean;
  consentStatus: SmsConsentStatus;
  initialMessage: string;
  lastSentAt?: string;
  updatedAt: string;
};

export type SmsMessageLog = {
  id: string;
  studentId?: string;
  phone: string;
  direction: "inbound" | "outbound";
  messageType: string;
  body: string;
  status: string;
  twilioMessageSid?: string;
  errorMessage?: string;
  createdAt: string;
};

export type SmsAgentStats = {
  activeStudents: number;
  smsSent: number;
  delivered: number;
  optedOut: number;
};

export const DEFAULT_INITIAL_SMS =
  "Luna Art Studio: We're setting up class updates for your student. Reply YES to receive reminders. Reply STOP to opt out.";

const SMS_PREFIX = "Luna Art Studio:";
export const DEFAULT_REMINDER_SMS =
  "Luna Art Studio: Class reminder for {{student_name}}. Please reply if you have any questions. Reply STOP to opt out.";

function normalizeInitialSms(template: string | null | undefined): string {
  const value = template?.trim();
  if (!value || /^Hi\s+\{\{parent_name\}\}/i.test(value)) return DEFAULT_INITIAL_SMS;
  const withoutOldPrefix = value.replace(/^Luna(?:r)? Art Studio:\s*/i, "");
  return `${SMS_PREFIX} ${withoutOldPrefix}`.trim();
}

function normalizeReminderSms(template: string): string {
  const value = template.trim();
  if (!value) throw new Error("Reminder message is required");
  const withoutOldPrefix = value.replace(/^Luna(?:r)? Art Studio:\s*/i, "");
  return `${SMS_PREFIX} ${withoutOldPrefix}`.trim().slice(0, 640);
}

function settingFromRow(row: Record<string, unknown>): SmsStudentSetting {
  return {
    studentId: String(row.student_id),
    enabled: Boolean(row.enabled),
    consentStatus: row.consent_status as SmsConsentStatus,
    initialMessage: normalizeInitialSms(String(row.initial_message || "")),
    lastSentAt: row.last_sent_at ? new Date(String(row.last_sent_at)).toISOString() : undefined,
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

function logFromRow(row: Record<string, unknown>): SmsMessageLog {
  return {
    id: String(row.id),
    studentId: row.student_id ? String(row.student_id) : undefined,
    phone: String(row.phone),
    direction: row.direction as "inbound" | "outbound",
    messageType: String(row.message_type),
    body: String(row.body),
    status: String(row.status),
    twilioMessageSid: row.twilio_message_sid ? String(row.twilio_message_sid) : undefined,
    errorMessage: row.error_message ? String(row.error_message) : undefined,
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

export function renderInitialSms(template: string, student: Student): string {
  return normalizeInitialSms(template)
    .replaceAll("{{student_name}}", student.name)
    .replaceAll("{{parent_name}}", student.parentName || "there");
}

export async function listSmsAgentData(since?: string) {
  const supabase = getSupabaseAdmin();
  let optedOutCount = supabase
    .from("sms_student_settings")
    .select("student_id", { count: "exact", head: true })
    .eq("consent_status", "opted_out");
  if (since) {
    optedOutCount = optedOutCount.gte("updated_at", since);
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const twilioMessages = accountSid && authToken
    ? twilio(accountSid, authToken).messages.list({
        ...(since ? { dateSentAfter: new Date(since) } : {}),
        limit: 5000,
      })
    : Promise.resolve([]);

  const [students, settingsResult, logsResult, messages, optedOutResult] = await Promise.all([
    listStudents(),
    supabase.from("sms_student_settings").select("*").order("updated_at", { ascending: false }),
    supabase.from("sms_message_logs").select("*").order("created_at", { ascending: false }).limit(100),
    twilioMessages,
    optedOutCount,
  ]);
  if (settingsResult.error) throw new Error(`Unable to load SMS settings: ${settingsResult.error.message}`);
  if (logsResult.error) throw new Error(`Unable to load SMS logs: ${logsResult.error.message}`);
  if (optedOutResult.error) throw new Error(`Unable to load opt-out count: ${optedOutResult.error.message}`);
  const outboundMessages = messages.filter((message) => message.direction.startsWith("outbound"));
  return {
    students,
    settings: (settingsResult.data ?? []).map((row) => settingFromRow(row)),
    logs: (logsResult.data ?? []).map((row) => logFromRow(row)),
    defaultTemplate: DEFAULT_INITIAL_SMS,
    defaultReminder: DEFAULT_REMINDER_SMS,
    stats: {
      activeStudents: students.filter((student) => student.status === "active").length,
      smsSent: outboundMessages.length,
      delivered: outboundMessages.filter((message) => message.status === "delivered").length,
      optedOut: optedOutResult.count ?? 0,
    } satisfies SmsAgentStats,
  };
}

export async function sendBulkReminderSms(studentIds: string[], template: string, messageType = "reminder") {
  const uniqueIds = Array.from(new Set(studentIds)).slice(0, 500);
  if (!uniqueIds.length) throw new Error("Select at least one student");

  const students = await listStudents();
  const studentMap = new Map(students.map((student) => [student.id, student]));
  const { data: settings, error } = await getSupabaseAdmin()
    .from("sms_student_settings")
    .select("student_id,enabled,consent_status")
    .in("student_id", uniqueIds);
  if (error) throw new Error(`Unable to load SMS settings: ${error.message}`);
  const settingMap = new Map((settings ?? []).map((row) => [String(row.student_id), row]));
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();
  if (!accountSid || !authToken || !messagingServiceSid) throw new Error("Twilio is not configured");

  const client = twilio(accountSid, authToken);
  const baseMessage = normalizeReminderSms(template);
  const results: Array<{ studentId: string; ok: boolean; error?: string }> = [];

  for (const studentId of uniqueIds) {
    const student = studentMap.get(studentId);
    const setting = settingMap.get(studentId);
    if (!student?.parentPhone || student.status !== "active") {
      results.push({ studentId, ok: false, error: "Missing parent phone" });
      continue;
    }
    if (!setting?.enabled || setting.consent_status !== "opted_in") {
      results.push({ studentId, ok: false, error: "SMS is not enabled with opt-in consent" });
      continue;
    }
    const body = baseMessage
      .replaceAll("{{student_name}}", student.name)
      .replaceAll("{{parent_name}}", student.parentName || "there");
    try {
      const message = await client.messages.create({
        to: student.parentPhone,
        messagingServiceSid,
        body,
      });
      await appendSmsLog({
        studentId,
        phone: student.parentPhone,
        direction: "outbound",
        messageType,
        body,
        status: message.status || "queued",
        twilioMessageSid: message.sid,
      });
      results.push({ studentId, ok: true });
    } catch (sendError) {
      const errorMessage = sendError instanceof Error ? sendError.message : "Unknown Twilio error";
      await appendSmsLog({
        studentId,
        phone: student.parentPhone,
        direction: "outbound",
        messageType,
        body,
        status: "failed",
        errorMessage,
      }).catch(() => undefined);
      results.push({ studentId, ok: false, error: errorMessage });
    }
  }

  return {
    requested: uniqueIds.length,
    sent: results.filter((item) => item.ok).length,
    failed: results.filter((item) => !item.ok).length,
    results,
  };
}

export async function saveSmsStudent(input: {
  studentId: string;
  parentName?: string;
  parentPhone?: string;
  enabled: boolean;
  consentStatus: SmsConsentStatus;
  initialMessage: string;
}) {
  const student = await updateStudent(input.studentId, {
    parentName: input.parentName?.trim() || undefined,
    parentPhone: input.parentPhone?.trim() || undefined,
  });
  if (!student) throw new Error("Student not found");
  const now = new Date().toISOString();
  const { data, error } = await getSupabaseAdmin()
    .from("sms_student_settings")
    .upsert({
      student_id: input.studentId,
      enabled: input.enabled,
      consent_status: input.consentStatus,
      initial_message: normalizeInitialSms(input.initialMessage),
      updated_at: now,
    })
    .select()
    .single();
  if (error) throw new Error(`Unable to save SMS settings: ${error.message}`);
  return { student, setting: settingFromRow(data) };
}

export async function appendSmsLog(input: Omit<SmsMessageLog, "id" | "createdAt">) {
  const { data, error } = await getSupabaseAdmin()
    .from("sms_message_logs")
    .insert({
      student_id: input.studentId ?? null,
      phone: input.phone,
      direction: input.direction,
      message_type: input.messageType,
      body: input.body,
      status: input.status,
      twilio_message_sid: input.twilioMessageSid ?? null,
      error_message: input.errorMessage ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(`Unable to write SMS log: ${error.message}`);
  return logFromRow(data);
}

export async function findStudentByPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (!digits) return undefined;
  return (await listStudents()).find(
    (student) => student.parentPhone?.replace(/\D/g, "").slice(-10) === digits
  );
}

export async function setConsentByPhone(phone: string, consentStatus: SmsConsentStatus) {
  const student = await findStudentByPhone(phone);
  if (!student) return undefined;
  const now = new Date().toISOString();
  const { error } = await getSupabaseAdmin().from("sms_student_settings").upsert({
    student_id: student.id,
    consent_status: consentStatus,
    enabled: consentStatus === "opted_in",
    updated_at: now,
  });
  if (error) throw new Error(`Unable to update SMS consent: ${error.message}`);
  return student;
}

export async function sendInitialSms(studentId: string) {
  const student = (await listStudents()).find((item) => item.id === studentId);
  if (!student) throw new Error("Student not found");
  if (!student.parentPhone) throw new Error("Add a parent phone number first");
  const { data: row, error } = await getSupabaseAdmin()
    .from("sms_student_settings")
    .select("*")
    .eq("student_id", studentId)
    .maybeSingle();
  if (error) throw new Error(`Unable to load SMS settings: ${error.message}`);
  const template = normalizeInitialSms(row?.initial_message);
  const body = renderInitialSms(template, student);
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();
  if (!accountSid || !authToken || !messagingServiceSid) throw new Error("Twilio is not configured");

  try {
    const message = await twilio(accountSid, authToken).messages.create({
      to: student.parentPhone,
      messagingServiceSid,
      body,
    });
    await appendSmsLog({
      studentId,
      phone: student.parentPhone,
      direction: "outbound",
      messageType: "initial",
      body,
      status: message.status || "queued",
      twilioMessageSid: message.sid,
    });
    await getSupabaseAdmin()
      .from("sms_student_settings")
      .upsert({ student_id: studentId, initial_message: template, last_sent_at: new Date().toISOString() });
    return message.sid;
  } catch (error) {
    await appendSmsLog({
      studentId,
      phone: student.parentPhone,
      direction: "outbound",
      messageType: "initial",
      body,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown Twilio error",
    }).catch(() => undefined);
    throw error;
  }
}
