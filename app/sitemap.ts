import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { getContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiposta.example.com";
  const [catalog, content] = await Promise.all([getCatalog(), getContent({ limit: 50 })]);
  const fixed = ["", "/yayinlar", "/bultenler", "/arama", "/premium", "/hakkimizda"];
  const generatedAt = catalog.meta.generatedAt && catalog.meta.generatedAt !== new Date(0).toISOString() ? new Date(catalog.meta.generatedAt) : new Date();

  return [
    ...fixed.map((path) => ({ url: `${base}${path}`, lastModified: generatedAt, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...content.articles.map((item) => ({ url: `${base}/icerik/${item.slug}`, lastModified: new Date(item.publishedAt), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...catalog.publications.map((item) => ({ url: `${base}/yayinlar/${item.slug}`, lastModified: generatedAt, changeFrequency: "weekly" as const, priority: item.isComingSoon ? 0.4 : 0.7 })),
    ...catalog.newsletters.map((item) => ({ url: `${base}/bultenler/${item.slug}`, lastModified: generatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...catalog.categories.map((item) => ({ url: `${base}/kategori/${item.slug}`, lastModified: generatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
