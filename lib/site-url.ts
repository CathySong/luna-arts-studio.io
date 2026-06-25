// Canonical production URL for metadata, sitemap, and robots.
// Vercel sets VERCEL_PROJECT_PRODUCTION_URL without a protocol (e.g.
// "lunaart.studio"), which breaks `new URL()` unless we normalize it.
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }

  // Production custom domain — keep absolute icon/logo URLs on lunaart.studio
  // so Google/Bing associate the correct hostname.
  if (process.env.VERCEL_ENV === "production") {
    return "https://lunaart.studio";
  }

  const raw =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "lunaart.studio";

  return normalizeSiteUrl(raw);
}

function normalizeSiteUrl(raw: string): string {
  const trimmed = raw.replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
