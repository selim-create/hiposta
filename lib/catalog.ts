import {
  categories as mockCategories,
  newsletterBundles as mockBundles,
  newsletters as mockNewsletters,
  publications as mockPublications,
} from "@/lib/mock-data";
import { allowDevelopmentMockFallback, fetchPublicCore, publicCoreFetchInit } from "@/lib/public-core-fetch";
import type { CatalogSnapshot, Category, Newsletter, NewsletterBundle, Publication } from "@/lib/types";

const CORE_BASE_URL = (process.env.HIPOSTA_CORE_URL ?? "https://api.hiposta.com/wp-json/hiposta/v1").replace(/\/$/, "");
const numberFormatter = new Intl.NumberFormat("tr-TR");
const audienceLabel = (count: number) => `${numberFormatter.format(count)} abone`;
const cadenceLabel = (value: string) => { const normalized = value.trim().toLowerCase(); if (normalized === "daily") return "Her gün"; if (normalized === "weekly") return "Haftalık"; if (normalized === "monthly") return "Aylık"; return value || "Düzenli"; };

type ApiCategory = { slug: string; name: string; short_name: string; description: string; color: string };
type ApiPublication = { slug: string; name: string; kicker: string; description: string; long_description: string; brand_color: string; foreground_color: string; monogram: string; cadence: string; logo_url: string | null; featured: boolean; status: "active" | "inactive"; is_coming_soon: boolean; primary_category: ApiCategory | null; audience_count: number };
type ApiNewsletter = { slug: string; name: string; publication_slug: string; description: string; long_description: string; cadence: string; delivery_time: string; format: string; accent_color: string; topics: string[]; featured: boolean; primary_category: ApiCategory | null; audience_count: number };
type ApiBundle = { slug: string; name: string; eyebrow: string; description: string; accent_color: string; featured: boolean; newsletter_slugs: string[] };
type ApiCatalogResponse = { data: { categories: ApiCategory[]; publications: ApiPublication[]; newsletters: ApiNewsletter[]; bundles: ApiBundle[]; stats: { publications: number; active_publications: number; coming_soon_publications: number; active_newsletters: number; categories: number; bundles: number } }; meta?: { revision?: string; generated_at?: string; core_version?: string } };

function mapCategory(item: ApiCategory): Category { return { slug: item.slug, name: item.name, shortName: item.short_name || item.name, description: item.description || "", color: item.color || "#3157ff" }; }
function mapPublication(item: ApiPublication): Publication { const category = item.primary_category; return { slug: item.slug, name: item.name, kicker: item.kicker || "Hiposta yayını", description: item.description || "", longDescription: item.long_description || item.description || "", categorySlug: category?.slug ?? "gundem", color: item.brand_color || category?.color || "#3157ff", foreground: item.foreground_color || "#111827", monogram: item.monogram || item.name.slice(0, 2).toUpperCase(), cadence: item.cadence || "Düzenli", reach: audienceLabel(item.audience_count || 0), featured: item.featured, logoUrl: item.logo_url, status: item.status, isComingSoon: item.is_coming_soon, audienceCount: item.audience_count || 0 }; }
function mapNewsletter(item: ApiNewsletter): Newsletter { return { slug: item.slug, name: item.name, publicationSlug: item.publication_slug, categorySlug: item.primary_category?.slug ?? "gundem", description: item.description || "", longDescription: item.long_description || item.description || "", schedule: cadenceLabel(item.cadence), deliveryTime: item.delivery_time || "", format: item.format || "Editoryal bülten", audience: audienceLabel(item.audience_count || 0), accent: item.accent_color || item.primary_category?.color || "#3157ff", featured: item.featured, topics: Array.isArray(item.topics) ? item.topics : [], audienceCount: item.audience_count || 0 }; }
function mapBundle(item: ApiBundle): NewsletterBundle { return { slug: item.slug, name: item.name, eyebrow: item.eyebrow || "Hazır seçim", description: item.description || "", newsletterSlugs: item.newsletter_slugs || [], accent: item.accent_color || "#3157ff", featured: item.featured }; }
function mockSnapshot(): CatalogSnapshot { return { categories: mockCategories, publications: mockPublications.map((item) => ({ ...item, status: "active" as const, isComingSoon: false })), newsletters: mockNewsletters, bundles: mockBundles, stats: { publications: mockPublications.length, activePublications: mockPublications.length, comingSoonPublications: 0, activeNewsletters: mockNewsletters.length, categories: mockCategories.length, bundles: mockBundles.length }, meta: { revision: "mock", generatedAt: new Date(0).toISOString(), coreVersion: "mock" }, source: "mock" }; }
function unavailableSnapshot(): CatalogSnapshot { return { categories: [], publications: [], newsletters: [], bundles: [], stats: { publications: 0, activePublications: 0, comingSoonPublications: 0, activeNewsletters: 0, categories: 0, bundles: 0 }, meta: { revision: "unavailable", generatedAt: new Date().toISOString(), coreVersion: "unavailable" }, source: "unavailable" }; }

export async function getCatalog(): Promise<CatalogSnapshot> {
  try {
    const response = await fetchPublicCore(`${CORE_BASE_URL}/catalog`, publicCoreFetchInit());
    if (!response.ok) throw new Error(`Hiposta Core catalog returned ${response.status}`);
    const payload = (await response.json()) as ApiCatalogResponse;
    const data = payload.data;
    return { categories: data.categories.map(mapCategory), publications: data.publications.map(mapPublication), newsletters: data.newsletters.map(mapNewsletter), bundles: data.bundles.map(mapBundle), stats: { publications: data.stats.publications, activePublications: data.stats.active_publications, comingSoonPublications: data.stats.coming_soon_publications, activeNewsletters: data.stats.active_newsletters, categories: data.stats.categories, bundles: data.stats.bundles }, meta: { revision: payload.meta?.revision ?? "unknown", generatedAt: payload.meta?.generated_at ?? new Date().toISOString(), coreVersion: payload.meta?.core_version ?? "unknown" }, source: "core" };
  } catch (error) {
    if (allowDevelopmentMockFallback()) { console.warn("Hiposta Core catalog unavailable; explicit development mock fallback enabled.", error); return mockSnapshot(); }
    console.error("Hiposta Core catalog unavailable; returning no fabricated catalog.", error);
    return unavailableSnapshot();
  }
}

export async function getCatalogCategory(slug: string) { return (await getCatalog()).categories.find((item) => item.slug === slug); }
export async function getCatalogPublication(slug: string) { return (await getCatalog()).publications.find((item) => item.slug === slug); }
export async function getCatalogNewsletter(slug: string) { return (await getCatalog()).newsletters.find((item) => item.slug === slug); }
