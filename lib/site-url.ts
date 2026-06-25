// Canonical production URL for metadata, sitemap, and robots.
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "https://lunaart.studio"
  );
}
