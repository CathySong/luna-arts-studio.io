import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

import {
  generateSmsReply,
  HUMAN_FOLLOW_UP_EN,
  HUMAN_FOLLOW_UP_ZH,
} from "@/lib/sms/agent";
import {
  appendSmsLog,
  findStudentByPhone,
  setConsentByPhone,
} from "@/lib/crm/sms-agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const YES_REPLY =
  "Luna Art Studio: You're enrolled in class reminders. We'll text you 24 hours before class. Reply HELP for help or STOP to opt out.";
const HELP_REPLY =
  "Luna Art Studio: For help, visit https://lunaart.studio or call 732-718-0639. Reply STOP to opt out.";
const STOP_REPLY =
  "Luna Art Studio: You are unsubscribed and will receive no further messages. Reply START to opt in again.";

function xmlResponse(xml: string, status = 200) {
  return new NextResponse(xml, {
    status,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

function emptyTwiml() {
  return new twilio.twiml.MessagingResponse().toString();
}

function getWebhookUrl(req: NextRequest) {
  return process.env.TWILIO_WEBHOOK_URL?.trim() || req.url;
}

function normalizeParams(formData: FormData) {
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") params[key] = value;
  });
  return params;
}

async function notifyLuna(customerNumber: string, customerMessage: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();
  const ownerNumber = process.env.LUNA_SMS_OWNER_NUMBER?.trim();

  if (!accountSid || !authToken || !messagingServiceSid || !ownerNumber) return;

  const client = twilio(accountSid, authToken);
  await client.messages.create({
    to: ownerNumber,
    messagingServiceSid,
    body: `Luna SMS follow-up needed from ${customerNumber}: ${customerMessage.slice(0, 500)}`,
  });
}

export async function POST(req: NextRequest) {
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const signature = req.headers.get("x-twilio-signature") || "";
  const formData = await req.formData();
  const params = normalizeParams(formData);

  if (
    !authToken ||
    !signature ||
    !twilio.validateRequest(authToken, signature, getWebhookUrl(req), params)
  ) {
    return xmlResponse(emptyTwiml(), 403);
  }

  const incomingMessage = (params.Body || "").trim();
  const customerNumber = params.From || "unknown number";
  const normalizedMessage = incomingMessage.toUpperCase();
  const response = new twilio.twiml.MessagingResponse();
  const student = await findStudentByPhone(customerNumber).catch(() => undefined);

  await appendSmsLog({
    studentId: student?.id,
    phone: customerNumber,
    direction: "inbound",
    messageType: "conversation",
    body: incomingMessage,
    status: "received",
    twilioMessageSid: params.MessageSid,
  }).catch((error) => console.error("[sms/incoming] Log write failed", error));

  const replyAndLog = async (body: string, messageType = "auto_reply") => {
    response.message(body);
    await appendSmsLog({
      studentId: student?.id,
      phone: customerNumber,
      direction: "outbound",
      messageType,
      body,
      status: "sent_via_twiml",
    }).catch((error) => console.error("[sms/incoming] Reply log write failed", error));
    return xmlResponse(response.toString());
  };

  if (["YES", "Y", "START", "UNSTOP"].includes(normalizedMessage)) {
    await setConsentByPhone(customerNumber, "opted_in").catch((error) =>
      console.error("[sms/incoming] Consent update failed", error)
    );
    return replyAndLog(YES_REPLY, "consent");
  }

  if (["STOP", "END", "CANCEL", "UNSUBSCRIBE", "QUIT"].includes(normalizedMessage)) {
    await setConsentByPhone(customerNumber, "opted_out").catch((error) =>
      console.error("[sms/incoming] Consent update failed", error)
    );
    return replyAndLog(STOP_REPLY, "consent");
  }

  if (["HELP", "INFO"].includes(normalizedMessage)) {
    return replyAndLog(HELP_REPLY, "help");
  }

  if (!incomingMessage) return xmlResponse(response.toString());

  try {
    const decision = await generateSmsReply(incomingMessage);
    response.message(decision.reply);
    await appendSmsLog({
      studentId: student?.id,
      phone: customerNumber,
      direction: "outbound",
      messageType: decision.canAnswer ? "auto_reply" : "human_follow_up",
      body: decision.reply,
      status: "sent_via_twiml",
    }).catch((error) => console.error("[sms/incoming] Reply log write failed", error));

    if (!decision.canAnswer) {
      await notifyLuna(customerNumber, incomingMessage).catch((error) => {
        console.error("[sms/incoming] Owner notification failed", error);
      });
    }
  } catch (error) {
    console.error("[sms/incoming] Reply generation failed", error);
    const fallback = /[\u3400-\u9fff]/.test(incomingMessage)
      ? HUMAN_FOLLOW_UP_ZH
      : HUMAN_FOLLOW_UP_EN;
    const prefixedFallback = `Luna Art Studio: ${fallback}`;
    response.message(prefixedFallback);
    await appendSmsLog({
      studentId: student?.id,
      phone: customerNumber,
      direction: "outbound",
      messageType: "fallback",
      body: prefixedFallback,
      status: "sent_via_twiml",
    }).catch((logError) => console.error("[sms/incoming] Reply log write failed", logError));
    await notifyLuna(customerNumber, incomingMessage).catch((notifyError) => {
      console.error("[sms/incoming] Owner notification failed", notifyError);
    });
  }

  return xmlResponse(response.toString());
}
