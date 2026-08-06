import OpenAI from "openai";

import {
  geoKeywordPool,
  reviewExperienceOptions,
  STUDIO_INFO,
  type ReviewExperienceId,
  type ReviewLanguage,
} from "@/config/google-review";

export type GenerateGoogleReviewsInput = {
  experienceId: ReviewExperienceId;
  language: ReviewLanguage;
  highlight?: string;
  reviewerRole?: string;
};

export type GeneratedGoogleReview = {
  id: string;
  title: string;
  body: string;
  keywordsUsed: string[];
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

function buildSystemPrompt(language: ReviewLanguage): string {
  const langRule =
    language === "zh"
      ? "Write both reviews entirely in natural Simplified Chinese."
      : language === "bilingual"
        ? "Write both reviews primarily in English, with 1 short natural Chinese sentence or phrase woven in (not a full dual translation)."
        : "Write both reviews entirely in natural, conversational American English.";

  return `You are a Google Business Profile review writing assistant for ${STUDIO_INFO.name}, a fine art studio at ${STUDIO_INFO.address}.

Your job: write authentic-sounding Google reviews that also help local SEO / GEO (generative engine optimization) by naturally mentioning course names, the studio name, and the Warren NJ / New Jersey location.

${langRule}

Hard rules:
- Sound like a real parent, adult student, or visitor — warm, specific, human.
- Mention "${STUDIO_INFO.name}" at least once per review.
- Mention the location (Warren NJ / Warren, New Jersey / art classes in Warren) naturally — not as a keyword dump.
- Include 2–4 course/class-related phrases from the provided keyword list, woven into full sentences.
- Each review: 90–160 words (or Chinese equivalent length). No bullet points. No hashtags. No emoji overload (0–1 emoji max).
- Do NOT invent fake instructor names, prices, or exact street addresses beyond "Warren NJ" / studio name.
- Do NOT sound like ads or SEO spam. Avoid repeating the same keyword twice in one review.
- Vary tone: Review A more heartfelt/parental OR personal; Review B more focused on teaching quality / atmosphere / skill growth.
- Return ONLY valid JSON matching the schema.`;
}

function buildUserPrompt(input: GenerateGoogleReviewsInput): string {
  const experience =
    reviewExperienceOptions.find((o) => o.id === input.experienceId) ??
    reviewExperienceOptions[reviewExperienceOptions.length - 1];

  const role = input.reviewerRole?.trim() || "a satisfied student or parent";
  const highlight = input.highlight?.trim() || "warm instructors and creative growth";

  return `Studio: ${STUDIO_INFO.name}
Location: ${STUDIO_INFO.locality}, ${STUDIO_INFO.region}
Experience focus: ${experience.label} (${experience.labelZh})
Course keywords to prefer (use a subset naturally): ${experience.keywords.join("; ")}
GEO / local phrases to consider (use 1–2 total across each review): ${geoKeywordPool.join("; ")}
Reviewer role: ${role}
Personal highlight to reflect: ${highlight}

Generate exactly 2 distinct Google review options.

Return JSON:
{
  "reviews": [
    {
      "title": "short label for UI (3–6 words)",
      "body": "full review text ready to paste into Google",
      "keywordsUsed": ["keyword1", "keyword2"]
    },
    {
      "title": "short label for UI (3–6 words)",
      "body": "full review text ready to paste into Google",
      "keywordsUsed": ["keyword1", "keyword2"]
    }
  ]
}`;
}

export async function generateGoogleReviews(
  input: GenerateGoogleReviewsInput
): Promise<GeneratedGoogleReview[]> {
  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: getOpenAIModel(),
    temperature: 0.9,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt(input.language) },
      { role: "user", content: buildUserPrompt(input) },
    ],
  });

  const raw = completion.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error("OpenAI returned an empty response");

  const parsed = JSON.parse(raw) as {
    reviews?: Array<{
      title?: string;
      body?: string;
      keywordsUsed?: string[];
    }>;
  };

  const reviews = (parsed.reviews ?? [])
    .map((r, i) => ({
      id: `r${i + 1}`,
      title: (r.title ?? `Option ${i + 1}`).trim(),
      body: (r.body ?? "").trim(),
      keywordsUsed: Array.isArray(r.keywordsUsed)
        ? r.keywordsUsed.filter((k) => typeof k === "string").slice(0, 6)
        : [],
    }))
    .filter((r) => r.body.length > 40);

  if (reviews.length < 2) {
    throw new Error("Could not generate two complete reviews — please try again");
  }

  return reviews.slice(0, 2);
}

export function formatOpenAIError(err: unknown): string {
  if (err instanceof OpenAI.APIError) {
    if (err.status === 401) return "Invalid OPENAI_API_KEY — check environment settings";
    if (err.status === 429) return "OpenAI rate limit — please wait a moment and try again";
    if (err.status === 402 || err.status === 403)
      return "OpenAI billing or permission issue — check the API dashboard";
    return err.message || `OpenAI API error (${err.status})`;
  }
  if (err instanceof Error) return err.message;
  return "Review generation failed";
}
