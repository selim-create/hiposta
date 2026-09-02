import type { Article, NewsletterIssue } from "@/lib/types";
import { fetchPublicCore, publicCoreFetchInit } from "@/lib/public-core-fetch";
import { mapApiSponsorships, type ApiSponsorship } from "@/lib/sponsorship";

const CORE_BASE_URL = (process.env.HIPOSTA_CORE_URL ?? "https://api.hiposta.com/wp-json/hiposta/v1").replace(/\/$/, "");
const CONTENT_PLACEHOLDER = "/content-placeholder.svg";

type ApiIssueArticle = {
  slug: string; title: string; dek: string; author: string; hero_image_url: string | null; hero_alt: string; photo_credit: string;
  teaser_html: string; premium: boolean; featured: boolean; published_at: string | null; updated_at?: string | null; tags: string[];
  publication: { slug: string; name: string }; category: { slug: string; name: string; short_name: string } | null;
  newsletter: { slug: string; name: string } | null; body_html?: string | null; locked?: boolean; sponsorships?: ApiSponsorship[];
};

type ApiIssue = {
  slug: string; title: string; preheader: string; published_at: string | null; updated_at?: string | null;
  newsletter: { slug: string; name: string }; publication: { slug: string; name: string }; intro_html?: string; items?: ApiIssueArticle[]; sponsorships?: ApiSponsorship[];
};

type ApiIssueListResponse = { data: ApiIssue[] };
type ApiIssueDetailResponse = { data: ApiIssue };

function dateValue(value: string | null | undefined): Date { if (!value) return new Date(0); const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`; const parsed = new Date(iso); return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed; }
function isoDate(value: string | null | undefined): string | undefined { const date = dateValue(value); return date.getTime() === 0 ? undefined : date.toISOString(); }
function dateLabel(value: string | null | undefined): string { const date = dateValue(value); if (date.getTime() === 0) return ""; return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" }).format(date); }

function mapArticle(item: ApiIssueArticle): Article {
  return {
    slug: item.slug, title: item.title, dek: item.dek || "", publicationSlug: item.publication.slug, publicationName: item.publication.name,
    categorySlug: item.category?.slug ?? "gundem", categoryName: item.category?.name ?? "Gündem", categoryShortName: item.category?.short_name ?? item.category?.name ?? "Gündem",
    newsletterName: item.newsletter?.name, author: item.author || item.publication.name, publishedAt: isoDate(item.published_at) ?? new Date(0).toISOString(), updatedAt: isoDate(item.updated_at),
    displayDate: dateLabel(item.published_at), readTime: "", premium: item.premium, featured: item.featured, heroImage: item.hero_image_url || CONTENT_PLACEHOLDER,
    heroAlt: item.hero_alt || item.title, photoCredit: item.photo_credit || "", body: [], teaserHtml: item.teaser_html || "", bodyHtml: item.body_html ?? null,
    locked: item.locked ?? item.premium, relatedNewsletterSlug: item.newsletter?.slug ?? "", tags: Array.isArray(item.tags) ? item.tags : [], sponsorships: mapApiSponsorships(item.sponsorships),
  };
}

function mapIssue(item: ApiIssue): NewsletterIssue {
  return {
    slug: item.slug, title: item.title, preheader: item.preheader || "", publishedAt: isoDate(item.published_at) ?? new Date(0).toISOString(), updatedAt: isoDate(item.updated_at),
    displayDate: dateLabel(item.published_at), newsletterSlug: item.newsletter.slug, newsletterName: item.newsletter.name,
    publicationSlug: item.publication.slug, publicationName: item.publication.name, introHtml: item.intro_html || "", items: Array.isArray(item.items) ? item.items.map(mapArticle) : undefined,
    sponsorships: mapApiSponsorships(item.sponsorships),
  };
}

export async function getNewsletterIssues(newsletterSlug?: string): Promise<NewsletterIssue[]> {
  const params = new URLSearchParams();
  if (newsletterSlug) params.set("newsletter", newsletterSlug);
  const query = params.toString();
  try {
    const response = await fetchPublicCore(`${CORE_BASE_URL}/issues${query ? `?${query}` : ""}`, publicCoreFetchInit());
    if (!response.ok) throw new Error(`Hiposta Core issues returned ${response.status}`);
    const payload = (await response.json()) as ApiIssueListResponse;
    return payload.data.map(mapIssue);
  } catch (error) {
    console.error("Hiposta Core issues unavailable.", error);
    return [];
  }
}

export async function getNewsletterIssue(slug: string): Promise<NewsletterIssue | null> {
  try {
    const response = await fetchPublicCore(`${CORE_BASE_URL}/issues/${encodeURIComponent(slug)}`, publicCoreFetchInit());
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Hiposta Core issue detail returned ${response.status}`);
    const payload = (await response.json()) as ApiIssueDetailResponse;
    return mapIssue(payload.data);
  } catch (error) {
    console.error("Hiposta Core issue detail unavailable.", error);
    return null;
  }
}
