import { articles as mockArticles } from "@/lib/mock-data";
import type { Article } from "@/lib/types";
import { getSessionToken } from "@/lib/auth";

const CORE_BASE_URL = (process.env.HIPOSTA_CORE_URL ?? "https://api.hiposta.com/wp-json/hiposta/v1").replace(/\/$/, "");
const CONTENT_PLACEHOLDER = "/content-placeholder.svg";

type ApiContentItem = {
  slug: string; title: string; dek: string; author: string; hero_image_url: string | null; hero_alt: string; photo_credit: string;
  teaser_html: string; access_level: "free" | "premium"; premium: boolean; featured: boolean; published_at: string | null; tags: string[];
  publication: { slug: string; name: string }; category: { slug: string; name: string; short_name: string } | null;
  newsletter: { slug: string; name: string } | null; body_html?: string | null; locked?: boolean;
};
type ApiListResponse = { data: ApiContentItem[] };
type ApiDetailResponse = { data: ApiContentItem };
export type ContentFilters = { publication?: string; category?: string; newsletter?: string; premium?: boolean; limit?: number };
export type ContentSnapshot = { articles: Article[]; source: "core" | "mock" };

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
function normalizedDate(value: string | null | undefined): Date { if (!value) return new Date(0); const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`; const parsed = new Date(iso); return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed; }
function displayDate(value: string | null | undefined): string { const date = normalizedDate(value); if (date.getTime() === 0) return ""; return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" }).format(date); }
function readTime(...parts: Array<string | null | undefined>): string { const words = stripHtml(parts.filter(Boolean).join(" ")).split(/\s+/).filter(Boolean).length; return `${Math.max(1, Math.ceil(words / 190))} dk`; }

function mapApiArticle(item: ApiContentItem): Article {
  const published = normalizedDate(item.published_at);
  return {
    slug: item.slug, title: item.title, dek: item.dek || stripHtml(item.teaser_html), publicationSlug: item.publication.slug,
    publicationName: item.publication.name, categorySlug: item.category?.slug ?? "gundem", categoryName: item.category?.name ?? "Gündem",
    categoryShortName: item.category?.short_name ?? item.category?.name ?? "Gündem", newsletterName: item.newsletter?.name,
    author: item.author || item.publication.name, publishedAt: published.getTime() === 0 ? new Date().toISOString() : published.toISOString(),
    displayDate: displayDate(item.published_at), readTime: readTime(item.teaser_html, item.body_html), premium: item.premium, featured: item.featured,
    heroImage: item.hero_image_url || CONTENT_PLACEHOLDER, heroAlt: item.hero_alt || item.title, photoCredit: item.photo_credit || "", body: [],
    teaserHtml: item.teaser_html || "", bodyHtml: item.body_html ?? null, locked: item.locked ?? item.premium,
    relatedNewsletterSlug: item.newsletter?.slug ?? "", tags: Array.isArray(item.tags) ? item.tags : [],
  };
}

function safeMockArticle(item: Article): Article { const teaser = item.body[0] ?? item.dek; return { ...item, publicationName: item.publicationName, categoryName: item.categoryName, categoryShortName: item.categoryShortName, teaserHtml: `<p>${teaser}</p>`, bodyHtml: item.premium ? null : item.body.map((paragraph) => `<p>${paragraph}</p>`).join(""), locked: item.premium, body: item.premium ? [] : item.body }; }
function filterMock(filters: ContentFilters): Article[] { return mockArticles.filter((item) => !filters.publication || item.publicationSlug === filters.publication).filter((item) => !filters.category || item.categorySlug === filters.category || (filters.category === "saglik-iyi-yasam" && item.categorySlug === "iyi-yasam")).filter((item) => !filters.newsletter || item.relatedNewsletterSlug === filters.newsletter).filter((item) => filters.premium === undefined || item.premium === filters.premium).slice(0, Math.min(50, Math.max(1, filters.limit ?? 20))).map(safeMockArticle); }

export async function getContent(filters: ContentFilters = {}): Promise<ContentSnapshot> {
  const params = new URLSearchParams();
  if (filters.publication) params.set("publication", filters.publication); if (filters.category) params.set("category", filters.category); if (filters.newsletter) params.set("newsletter", filters.newsletter); if (filters.premium !== undefined) params.set("premium", filters.premium ? "true" : "false"); params.set("limit", String(Math.min(50, Math.max(1, filters.limit ?? 20))));
  try {
    const response = await fetch(`${CORE_BASE_URL}/content?${params.toString()}`, { headers: { Accept: "application/json" }, next: { revalidate: 60 } });
    if (!response.ok) throw new Error(`Hiposta Core content returned ${response.status}`);
    const payload = (await response.json()) as ApiListResponse; return { articles: payload.data.map(mapApiArticle), source: "core" };
  } catch (error) { console.warn("Hiposta Core content unavailable; using safe transition mock fallback.", error); return { articles: filterMock(filters), source: "mock" }; }
}

export async function getContentArticle(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`${CORE_BASE_URL}/content/${encodeURIComponent(slug)}`, { headers: { Accept: "application/json" }, next: { revalidate: 60 } });
    if (response.status === 404) return null; if (!response.ok) throw new Error(`Hiposta Core content detail returned ${response.status}`);
    const payload = (await response.json()) as ApiDetailResponse; return mapApiArticle(payload.data);
  } catch (error) { console.warn("Hiposta Core content detail unavailable; using safe transition mock fallback.", error); const fallback = mockArticles.find((item) => item.slug === slug); return fallback ? safeMockArticle(fallback) : null; }
}

export async function getContentArticleForSession(slug: string): Promise<Article | null> {
  const token = await getSessionToken();
  if (!token) return getContentArticle(slug);
  try {
    const response = await fetch(`${CORE_BASE_URL}/content/${encodeURIComponent(slug)}/access`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (response.status === 404) {
      // Core 0.10.0 compatibility or genuinely missing content: use the safe public contract.
      return getContentArticle(slug);
    }
    if (response.status === 401 || response.status === 403) return getContentArticle(slug);
    if (!response.ok) return getContentArticle(slug);
    const payload = (await response.json()) as ApiDetailResponse;
    return mapApiArticle(payload.data);
  } catch {
    return getContentArticle(slug);
  }
}

export async function searchContent(query: string): Promise<Article[]> { const normalized = query.trim().toLocaleLowerCase("tr-TR"); if (!normalized) return []; const { articles } = await getContent({ limit: 50 }); return articles.filter((item) => [item.title, item.dek, item.author, item.publicationName, item.categoryName, ...item.tags].filter(Boolean).join(" ").toLocaleLowerCase("tr-TR").includes(normalized)); }
