import OpenAI from "openai";

import { buildStudioKnowledge } from "@/lib/chat/knowledge";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is required. Add it to .env.local or Vercel env."
    );
  }
  return new OpenAI({ apiKey });
}

function getOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

function buildSystemPrompt(): string {
  return `You are Luna, the friendly assistant for Luna Art Studio in Warren, NJ.
You help website visitors with questions about studio classes, schedules, enrollment, and pricing.

Tone: warm, clear, concise, and helpful — like a studio front desk. Reply in the same language the visitor uses (English or Chinese). Keep answers short (usually 2–6 sentences). Use bullet lists when listing classes or times.

Hard rules:
- ONLY use facts from STUDIO KNOWLEDGE below. Do not invent class times, ages, dates, or prices.
- If Fall group class tuition or private lesson rates are asked and not listed as a dollar amount, say current rates need studio confirmation, then clearly offer ways to reach Luna: call or text her phone number, email her, or add her on WeChat.
- Whenever the visitor wants to talk to a person, confirm placement, ask about price, private lessons, or seems unsure — end with Luna's contact options: call/text, email, and WeChat ID.
- Never claim Monday or Tuesday Fall group classes — Fall weekly classes are Wednesday–Saturday only.
- You may briefly mention summer camp, birthday parties, and sewing when asked; redirect other off-topic requests politely back to studio offerings.
- Do not collect payment or process enrollment yourself — point to the registration form or contact channels.
- Do not invent discounts, scholarships, or promotions that are not in the knowledge base.

STUDIO KNOWLEDGE
${buildStudioKnowledge()}`;
}

export async function replyToChat(messages: ChatMessage[]): Promise<string> {
  const client = getOpenAIClient();
  const trimmed = messages.slice(-12).map((m) => ({
    role: m.role,
    content: m.content.trim().slice(0, 1200),
  }));

  const completion = await client.chat.completions.create({
    model: getOpenAIModel(),
    temperature: 0.4,
    max_tokens: 500,
    messages: [
      { role: "system", content: buildSystemPrompt() },
      ...trimmed,
    ],
  });

  const reply = completion.choices[0]?.message?.content?.trim();
  if (!reply) throw new Error("OpenAI returned an empty reply");
  return reply;
}

export function formatChatError(err: unknown): string {
  const contactHint =
    "You can also call or text Luna at +1 732-718-0639, email Ninglu1088@gmail.com, or add WeChat happyevan999.";

  if (err instanceof OpenAI.APIError) {
    if (err.status === 401)
      return `Chat is temporarily unavailable. ${contactHint}`;
    if (err.status === 429) return `Too many requests — please wait a moment. ${contactHint}`;
    if (err.status === 402 || err.status === 403)
      return `Chat is temporarily unavailable. ${contactHint}`;
    return `${err.message || `Chat error (${err.status})`} ${contactHint}`;
  }
  if (err instanceof Error) return `${err.message} ${contactHint}`;
  return `Something went wrong. ${contactHint}`;
}
