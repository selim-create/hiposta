import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { getContent } from "@/lib/content";
import { getNewsletterIssues } from "@/lib/issues";
import { absoluteUrl } from "@/lib/seo";

function validDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) || date.getTime() === 0 ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog, content, issues] = await Promise.all([
    getCatalog(),
    getContent({ limit: 50 }),
    getNewsletterIssues(),
  ]);

  const fixed: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/yayinlar"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/bultenler"), changeFrequency: "weekly", priority: 0.8 },
  ];

  if (catalog.source !== "core" || content.source !== "core") return fixed;

  const activePublications = catalog.publications.filter((item) => item.status === "active" && !item.isComingSoon);
  const activePublicationSlugs = new Set(activePublications.map((item) => item.slug));
  const activeNewsletters = catalog.newsletters.filter((item) => activePublicationSlugs.has(item.publicationSlug));
  const activeCategorySlugs = new Set([
    ...activePublications.map((item) => item.categorySlug),
    ...activeNewsletters.map((item) => item.categorySlug),
    ...content.articles.map((item) => item.categorySlug),
  ]);

  return [
    ...fixed,
    ...activePublications.map((item) => ({ url: absoluteUrl(`/yayinlar/${item.slug}`), changeFrequency: "weekly" as const, priority: 0.75 })),
    ...activeNewsletters.map((item) => ({ url: absoluteUrl(`/bultenler/${item.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...catalog.categories.filter((item) => activeCategorySlugs.has(item.slug)).map((item) => ({ url: absoluteUrl(`/kategori/${item.slug}`), changeFrequency: "daily" as const, priority: 0.75 })),
    ...content.articles.map((item) => ({ url: absoluteUrl(`/icerik/${item.slug}`), lastModified: validDate(item.updatedAt) ?? validDate(item.publishedAt), changeFrequency: "weekly" as const, priority: 0.85 })),
    ...issues.filter((item) => activePublicationSlugs.has(item.publicationSlug)).map((item) => ({ url: absoluteUrl(`/sayi/${item.slug}`), lastModified: validDate(item.updatedAt) ?? validDate(item.publishedAt), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
