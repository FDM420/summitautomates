import type { MetadataRoute } from "next";
import { industries } from "@/lib/industries";
import { insights } from "@/lib/insights";
import { servicePages } from "@/lib/service-pages";
import { siteUrl } from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    // Core pages
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },

    // Service pages
    ...servicePages.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // Industry pages
    ...industries.map((industry) => ({
      url: `${siteUrl}/industries/${industry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),

    // Insight (blog) posts
    ...insights.map((post) => ({
      url: `${siteUrl}/insights/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
