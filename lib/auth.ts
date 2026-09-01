import { cookies } from "next/headers";

const CORE_BASE_URL = (process.env.HIPOSTA_CORE_URL ?? "https://api.hiposta.com/wp-json/hiposta/v1").replace(/\/$/, "");
export const SESSION_COOKIE = "hiposta_session";

export type AuthAccount = {
  id: number;
  email: string;
  display_name: string;
  email_verified: boolean;
  subscriber_linked: boolean;
};

export type AuthEntitlement = {
  entitlement_key: string;
  scope_type: string;
  scope_id: number | string;
  source?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
};

export type AuthSubscription = {
  status: string;
  confirmed_at?: string | null;
  unsubscribed_at?: string | null;
  newsletter_slug: string;
  newsletter_name: string;
  publication_slug: string;
  publication_name: string;
};

export type AuthSession = {
  account: AuthAccount;
  entitlements: AuthEntitlement[];
  subscriptions: AuthSubscription[];
};

export async function getSessionToken(): Promise<string> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? "";
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const response = await fetch(`${CORE_BASE_URL}/auth/session`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = await response.json() as { ok?: boolean; data?: AuthSession };
    return payload.ok && payload.data ? payload.data : null;
  } catch {
    return null;
  }
}

export function coreAuthUrl(path: string): string {
  return `${CORE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
