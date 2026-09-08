import { NextRequest, NextResponse } from "next/server";

import {
  formatChatError,
  replyToChat,
  type ChatMessage,
} from "@/lib/chat/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 16;
const MAX_CONTENT = 1000;

type Body = {
  messages?: Array<{ role?: string; content?: string }>;
};

function sanitizeMessages(raw: Body["messages"]): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) {
    return null;
  }

  const messages: ChatMessage[] = [];
  for (const item of raw) {
    if (!item || (item.role !== "user" && item.role !== "assistant")) return null;
    if (typeof item.content !== "string") return null;
    const content = item.content.trim().slice(0, MAX_CONTENT);
    if (!content) return null;
    messages.push({ role: item.role, content });
  }

  // Last message must be from the user
  if (messages[messages.length - 1]?.role !== "user") return null;
  return messages;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;
    const messages = sanitizeMessages(body.messages);
    if (!messages) {
      return NextResponse.json(
        { error: "Please send a short message to chat with Luna." },
        { status: 400 }
      );
    }

    const reply = await replyToChat(messages);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat]", err);
    return NextResponse.json({ error: formatChatError(err) }, { status: 500 });
  }
}
