// Canonical production URL for metadata, sitemap, and robots.
// Vercel sets VERCEL_PROJECT_PRODUCTION_URL without a protocol (e.g.
// "lunaart.studio"), which breaks `new URL()` unless we normalize it.
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "https://lunaart.studio";

  const trimmed = raw.replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
