import { getSessionToken } from "@/lib/auth";
import { fetchPublicCore, publicCoreFetchInit } from "@/lib/public-core-fetch";

const CORE_BASE_URL = (process.env.HIPOSTA_CORE_URL ?? "https://api.hiposta.com/wp-json/hiposta/v1").replace(/\/$/, "");

export type PremiumPlan = {
  slug: string;
  name: string;
  description: string;
  billing_interval: string;
  currency: string | null;
  amount_minor: number | null;
};

export type PremiumSubscription = {
  status: "pending" | "active" | "past_due" | "cancelled" | "expired" | string;
  plan: Omit<PremiumPlan, "description"> | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  ended_at: string | null;
};

export type PremiumPublicState = {
  source: "core" | "unavailable";
  commerce_enabled: boolean | null;
  payment_provider: string | null;
  plans: PremiumPlan[];
};

export type PremiumAccountState = {
  ok: boolean;
  commerce_enabled: boolean;
  payment_provider: string | null;
  account: {
    id: number;
    email: string;
    display_name: string;
    email_verified: boolean;
    subscriber_linked: boolean;
  };
  subscription: PremiumSubscription | null;
  premium: boolean;
};

export async function getPremiumPublicState(): Promise<PremiumPublicState> {
  try {
    const response = await fetchPublicCore(`${CORE_BASE_URL}/premium`, publicCoreFetchInit());
    if (!response.ok) throw new Error(`Hiposta Core premium returned ${response.status}`);
    const payload = (await response.json()) as Omit<PremiumPublicState, "source">;
    return {
      source: "core",
      commerce_enabled: Boolean(payload.commerce_enabled),
      payment_provider: payload.payment_provider ?? null,
      plans: Array.isArray(payload.plans) ? payload.plans : [],
    };
  } catch (error) {
    console.error("Hiposta Core premium unavailable; refusing to infer commerce state.", error);
    return { source: "unavailable", commerce_enabled: null, payment_provider: null, plans: [] };
  }
}

export async function getPremiumAccountState(): Promise<PremiumAccountState | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const response = await fetch(`${CORE_BASE_URL}/premium/account`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as PremiumAccountState;
    return payload.ok ? payload : null;
  } catch (error) {
    console.error("Hiposta Core premium account state unavailable.", error);
    return null;
  }
}

export function formatPremiumPrice(plan: Pick<PremiumPlan, "currency" | "amount_minor">): string | null {
  if (!plan.currency || plan.amount_minor === null || !Number.isFinite(plan.amount_minor)) return null;
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: plan.currency }).format(plan.amount_minor / 100);
  } catch {
    return null;
  }
}

export function premiumIntervalLabel(interval: string): string {
  if (interval === "monthly") return "aylık";
  if (interval === "yearly" || interval === "annual") return "yıllık";
  return interval;
}
