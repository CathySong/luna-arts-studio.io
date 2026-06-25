import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl();

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/events`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/sewing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/flyer`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
