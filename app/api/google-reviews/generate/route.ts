import { NextRequest, NextResponse } from "next/server";

import { reviewExperienceOptions, type ReviewExperienceId, type ReviewLanguage } from "@/config/google-review";
import {
  formatOpenAIError,
  generateGoogleReviews,
} from "@/lib/google-review/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXPERIENCE_IDS = new Set(
  reviewExperienceOptions.map((o) => o.id)
);
const LANGUAGES = new Set<ReviewLanguage>(["en", "zh", "bilingual"]);

type Body = {
  experienceId?: string;
  language?: string;
  highlight?: string;
  reviewerRole?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;

    const experienceId = (body.experienceId ?? "general") as ReviewExperienceId;
    if (!EXPERIENCE_IDS.has(experienceId)) {
      return NextResponse.json(
        { error: "Invalid experienceId" },
        { status: 400 }
      );
    }

    const language = (body.language ?? "en") as ReviewLanguage;
    if (!LANGUAGES.has(language)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }

    const highlight =
      typeof body.highlight === "string" ? body.highlight.slice(0, 280) : "";
    const reviewerRole =
      typeof body.reviewerRole === "string"
        ? body.reviewerRole.slice(0, 80)
        : "";

    const reviews = await generateGoogleReviews({
      experienceId,
      language,
      highlight,
      reviewerRole,
    });

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("[google-reviews/generate]", err);
    return NextResponse.json(
      { error: formatOpenAIError(err) },
      { status: 500 }
    );
  }
}
