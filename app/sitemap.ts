import type { MetadataRoute } from "next";
import { articles, categories, newsletters, publications } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiposta.example.com";
  const fixed = ["", "/yayinlar", "/bultenler", "/arama", "/premium", "/hakkimizda"];
  return [
    ...fixed.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...articles.map((item) => ({ url: `${base}/icerik/${item.slug}`, lastModified: new Date(item.publishedAt), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...publications.map((item) => ({ url: `${base}/yayinlar/${item.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...newsletters.map((item) => ({ url: `${base}/bultenler/${item.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...categories.map((item) => ({ url: `${base}/kategori/${item.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
