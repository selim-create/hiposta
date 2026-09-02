import { getSessionToken } from "@/lib/auth";

const CORE_BASE_URL = (process.env.HIPOSTA_CORE_URL ?? "https://api.hiposta.com/wp-json/hiposta/v1").replace(/\/$/, "");

export type NewsletterRecommendationItem = {
  newsletterSlug: string;
  publicationSlug: string;
  reason: string;
  score: number;
};

export type NewsletterRecommendationMeta = {
  strategy: string;
  signal_count: number;
  explicit_preference_count: number;
  active_subscription_count: number;
  cold_start: boolean;
  email_verified: boolean;
};

export type NewsletterRecommendationSnapshot = {
  items: NewsletterRecommendationItem[];
  meta: NewsletterRecommendationMeta;
};

type ApiPayload = {
  ok?: boolean;
  data?: {
    items?: Array<{
      newsletter?: { slug?: string; publication?: { slug?: string } };
      reason?: string;
      score?: number;
    }>;
    meta?: Partial<NewsletterRecommendationMeta>;
  };
};

export async function getNewsletterRecommendations(limit = 6): Promise<NewsletterRecommendationSnapshot> {
  const empty: NewsletterRecommendationSnapshot = {
    items: [],
    meta: { strategy: "newsletter_deterministic_v1", signal_count: 0, explicit_preference_count: 0, active_subscription_count: 0, cold_start: true, email_verified: false },
  };
  const token = await getSessionToken();
  if (!token) return empty;
  try {
    const response = await fetch(`${CORE_BASE_URL}/me/newsletter-recommendations?limit=${Math.min(12, Math.max(1, limit))}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return empty;
    const payload = await response.json() as ApiPayload;
    if (!payload.ok || !payload.data) return empty;
    return {
      items: (payload.data.items ?? []).flatMap((item) => {
        const newsletterSlug = String(item.newsletter?.slug ?? "");
        const publicationSlug = String(item.newsletter?.publication?.slug ?? "");
        if (!newsletterSlug || !publicationSlug) return [];
        return [{ newsletterSlug, publicationSlug, reason: String(item.reason || "Sana uygun bülten"), score: Number(item.score) || 0 }];
      }),
      meta: {
        strategy: payload.data.meta?.strategy ?? empty.meta.strategy,
        signal_count: Number(payload.data.meta?.signal_count ?? 0),
        explicit_preference_count: Number(payload.data.meta?.explicit_preference_count ?? 0),
        active_subscription_count: Number(payload.data.meta?.active_subscription_count ?? 0),
        cold_start: Boolean(payload.data.meta?.cold_start),
        email_verified: Boolean(payload.data.meta?.email_verified),
      },
    };
  } catch {
    return empty;
  }
}
