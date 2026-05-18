const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export function getClaudeApiKey(): string {
  return (
    process.env.CLAUDE_API_KEY?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim() ||
    ""
  );
}

export function getClaudeModel(): string {
  return process.env.CLAUDE_MODEL ?? "claude-haiku-4-5-20251001";
}

export type ClaudeImageInput = {
  media_type: string;
  data: string;
};

export async function generateClaudeText(
  system: string,
  user: string,
  images?: ClaudeImageInput[]
): Promise<string> {
  const apiKey = getClaudeApiKey();
  if (!apiKey) {
    throw new Error(
      "CLAUDE_API_KEY is required for review generation. Add it to .env.local"
    );
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: getClaudeModel(),
      max_tokens: 1536,
      system,
      messages: [
        {
          role: "user",
          content: buildUserContent(user, images),
        },
      ],
    }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(formatClaudeApiError(res.status, body));
  }

  const text = extractText(body);
  if (!text) throw new Error("Claude returned empty review");
  return text;
}

function buildUserContent(
  text: string,
  images?: ClaudeImageInput[]
): string | Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> {
  if (!images?.length) return text;
  const blocks: Array<{
    type: string;
    text?: string;
    source?: { type: string; media_type: string; data: string };
  }> = [];
  for (const img of images.slice(0, 5)) {
    blocks.push({
      type: "image",
      source: { type: "base64", media_type: img.media_type, data: img.data },
    });
  }
  blocks.push({ type: "text", text });
  return blocks;
}

function extractText(body: {
  content?: Array<{ type?: string; text?: string }>;
}): string {
  const block = body.content?.find((c) => c.type === "text");
  return block?.text?.trim() ?? "";
}

function formatClaudeApiError(
  status: number,
  body: { error?: { message?: string; type?: string } }
): string {
  const msg = body?.error?.message;
  if (status === 401) {
    return "Invalid CLAUDE_API_KEY — check .env.local";
  }
  if (status === 402 || status === 403) {
    return "Claude billing or permission issue — check console.anthropic.com";
  }
  if (status === 429) {
    return "Claude rate limit exceeded — try again later";
  }
  return msg ?? `Claude API error (${status})`;
}

/** @deprecated Use formatClaudeApiError via thrown errors from generateClaudeText */
export function formatLlmError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Review generation failed";
}
