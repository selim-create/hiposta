export type AnalyticsEventType =
  | "content_view"
  | "content_save"
  | "content_unsave"
  | "content_share"
  | "newsletter_signup_start"
  | "newsletter_signup_complete"
  | "newsletter_recommendation_view"
  | "newsletter_recommendation_subscribe"
  | "sponsor_impression"
  | "sponsor_click"
  | "premium_gate_view"
  | "premium_cta_click";

type AnalyticsMeta = Partial<Record<
  "source" | "placement" | "position" | "referrer_kind" | "recommendation_kind" | "access_level" | "share_channel" | "cta_variant",
  string
>>;

export type AnalyticsEventInput = {
  eventType: AnalyticsEventType;
  contentId?: number;
  publicationId?: number;
  newsletterId?: number;
  sponsorshipPlacementId?: number;
  meta?: AnalyticsMeta;
};

const ANONYMOUS_KEY = "hiposta.analytics.anonymous_id";
const VIEW_PREFIX = "hiposta.analytics.view.";
const THIRTY_MINUTES = 30 * 60 * 1000;
let memoryAnonymousId = "";

function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function anonymousId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(ANONYMOUS_KEY);
    if (existing) return existing;
    const created = uuid();
    window.localStorage.setItem(ANONYMOUS_KEY, created);
    return created;
  } catch {
    if (!memoryAnonymousId) memoryAnonymousId = uuid();
    return memoryAnonymousId;
  }
}

function currentPath(): string {
  return typeof window === "undefined" ? "/" : window.location.pathname || "/";
}

function payloadFor(event: AnalyticsEventInput) {
  return {
    event_uuid: uuid(),
    event_type: event.eventType,
    anonymous_id: anonymousId(),
    path: currentPath(),
    occurred_at: new Date().toISOString(),
    content_id: event.contentId,
    publication_id: event.publicationId,
    newsletter_id: event.newsletterId,
    sponsorship_placement_id: event.sponsorshipPlacementId,
    meta: event.meta,
  };
}

export async function trackAnalyticsEvents(events: AnalyticsEventInput[]): Promise<void> {
  if (typeof window === "undefined" || !events.length) return;
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: events.slice(0, 20).map(payloadFor) }),
      cache: "no-store",
      keepalive: true,
    });
  } catch {
    // Analytics must never block the product flow.
  }
}

export function trackAnalyticsEvent(event: AnalyticsEventInput): void {
  void trackAnalyticsEvents([event]);
}

export function shouldTrackContentView(contentId: number): boolean {
  if (typeof window === "undefined" || contentId <= 0) return false;
  const key = `${VIEW_PREFIX}${contentId}`;
  const now = Date.now();
  try {
    const last = Number(window.localStorage.getItem(key) || "0");
    if (last && now - last < THIRTY_MINUTES) return false;
    window.localStorage.setItem(key, String(now));
    return true;
  } catch {
    return true;
  }
}
