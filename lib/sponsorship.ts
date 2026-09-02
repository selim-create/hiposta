import type { Sponsorship } from "@/lib/types";

export type ApiSponsorship = {
  id: number;
  placement_key: string;
  disclosure_label?: string;
  headline?: string;
  body_text?: string;
  cta_text?: string;
  cta_url?: string | null;
  image_url?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  brand: {
    name: string;
    slug: string;
    logo_url?: string | null;
    website_url?: string | null;
  };
};

export function mapApiSponsorships(value: ApiSponsorship[] | undefined): Sponsorship[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => ({
    id: Number(item.id),
    placementKey: String(item.placement_key || ""),
    disclosureLabel: String(item.disclosure_label || "Sponsorlu içerik"),
    headline: String(item.headline || ""),
    bodyText: String(item.body_text || ""),
    ctaText: String(item.cta_text || ""),
    ctaUrl: item.cta_url || null,
    imageUrl: item.image_url || null,
    startsAt: item.starts_at || null,
    endsAt: item.ends_at || null,
    brand: {
      name: String(item.brand?.name || "Sponsor"),
      slug: String(item.brand?.slug || "sponsor"),
      logoUrl: item.brand?.logo_url || null,
      websiteUrl: item.brand?.website_url || null,
    },
  }));
}

export function sponsorshipsFor(items: Sponsorship[] | undefined, ...placementKeys: string[]): Sponsorship[] {
  const allowed = new Set(placementKeys);
  return (items || []).filter((item) => allowed.has(item.placementKey));
}
