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

type ApiPersonalisedContentItem = {
  content: ApiContentItem;
  state: PersonalisationState;
};

type ApiListResponse = { ok?: boolean; data?: ApiPersonalisedContentItem[] };

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
