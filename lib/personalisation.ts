import { getSessionToken } from "@/lib/auth";
import { mapApiArticle, type ApiContentItem } from "@/lib/content";
import type { Article } from "@/lib/types";

const CORE_BASE_URL = (process.env.HIPOSTA_CORE_URL ?? "https://api.hiposta.com/wp-json/hiposta/v1").replace(/\/$/, "");

export type PersonalisationState = {
  content_id: number;
  saved: boolean;
  saved_at: string | null;
  first_viewed_at: string | null;
  last_viewed_at: string | null;
  view_count: number;
};

export type PersonalisedContentItem = {
  article: Article;
  state: PersonalisationState;
};

export type RecommendationItem = {
  article: Article;
  score: number;
  reason: string;
};

export type RecommendationMeta = {
  strategy: string;
  signal_count: number;
  active_subscription_count: number;
  cold_start: boolean;
};

export type RecommendationSnapshot = {
  items: RecommendationItem[];
  meta: RecommendationMeta;
};

type ApiPersonalisedContentItem = {
  content: ApiContentItem;
  state: PersonalisationState;
};

type ApiRecommendationItem = {
  content: ApiContentItem;
  score: number;
  reason: string;
};

type ApiListResponse = { ok?: boolean; data?: ApiPersonalisedContentItem[] };
type ApiRecommendationResponse = {
  ok?: boolean;
  data?: {
    items?: ApiRecommendationItem[];
    meta?: Partial<RecommendationMeta>;
  };
};

async function privateGet(path: string): Promise<ApiPersonalisedContentItem[]> {
  const token = await getSessionToken();
  if (!token) return [];
  try {
    const response = await fetch(`${CORE_BASE_URL}${path}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return [];
    const payload = await response.json() as ApiListResponse;
    return payload.ok && Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}

function mapItem(item: ApiPersonalisedContentItem): PersonalisedContentItem {
  return { article: mapApiArticle(item.content), state: item.state };
}

export async function getSavedContent(limit = 12): Promise<PersonalisedContentItem[]> {
  const rows = await privateGet(`/me/saved?limit=${Math.min(50, Math.max(1, limit))}`);
  return rows.map(mapItem);
}

export async function getReadingHistory(limit = 12): Promise<PersonalisedContentItem[]> {
  const rows = await privateGet(`/me/history?limit=${Math.min(50, Math.max(1, limit))}`);
  return rows.map(mapItem);
}

export async function getRecommendations(limit = 12): Promise<RecommendationSnapshot> {
  const empty: RecommendationSnapshot = {
    items: [],
    meta: { strategy: "deterministic_v1", signal_count: 0, active_subscription_count: 0, cold_start: true },
  };
  const token = await getSessionToken();
  if (!token) return empty;

  try {
    const response = await fetch(`${CORE_BASE_URL}/me/recommendations?limit=${Math.min(24, Math.max(1, limit))}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return empty;

    const payload = await response.json() as ApiRecommendationResponse;
    if (!payload.ok || !payload.data || !Array.isArray(payload.data.items)) return empty;

    return {
      items: payload.data.items.map((item) => ({
        article: mapApiArticle(item.content),
        score: Number.isFinite(item.score) ? item.score : 0,
        reason: typeof item.reason === "string" && item.reason.trim() ? item.reason.trim() : "Senin için seçildi",
      })),
      meta: {
        strategy: payload.data.meta?.strategy ?? "deterministic_v1",
        signal_count: Number(payload.data.meta?.signal_count ?? 0),
        active_subscription_count: Number(payload.data.meta?.active_subscription_count ?? 0),
        cold_start: Boolean(payload.data.meta?.cold_start),
      },
    };
  } catch {
    return empty;
  }
}
