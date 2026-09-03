"use client";

export type ClientAuthSession = {
  account: { email: string; email_verified: boolean };
  subscriptions: Array<{ newsletter_slug: string; status: string }>;
};

type SessionResponse = { ok?: boolean; data?: ClientAuthSession };

let sessionPromise: Promise<ClientAuthSession | null> | null = null;

export function getClientAuthSession(): Promise<ClientAuthSession | null> {
  if (!sessionPromise) {
    sessionPromise = fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = (await response.json().catch(() => ({}))) as SessionResponse;
        return payload.ok === true && payload.data ? payload.data : null;
      })
      .catch(() => null);
  }
  return sessionPromise;
}

export function refreshClientAuthSession(): Promise<ClientAuthSession | null> {
  sessionPromise = null;
  return getClientAuthSession();
}
