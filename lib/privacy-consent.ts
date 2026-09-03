export const CONSENT_VERSION = "1.0";
export const CONSENT_STORAGE_KEY = "hiposta.privacy.consent";
export const CONSENT_OPEN_EVENT = "hiposta:privacy-open";

export type PrivacyConsent = {
  necessary: true;
  analytics: boolean;
  version: string;
  updatedAt: string;
};

export function readPrivacyConsent(): PrivacyConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PrivacyConsent>;
    if (parsed.version !== CONSENT_VERSION || typeof parsed.analytics !== "boolean") return null;
    return { necessary: true, analytics: parsed.analytics, version: CONSENT_VERSION, updatedAt: String(parsed.updatedAt || "") };
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return readPrivacyConsent()?.analytics === true;
}

export function savePrivacyConsent(analytics: boolean): PrivacyConsent {
  const consent: PrivacyConsent = {
    necessary: true,
    analytics,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent)); } catch {}
    if (!analytics) clearAnalyticsStorage();
    window.dispatchEvent(new CustomEvent("hiposta:privacy-changed", { detail: consent }));
  }
  return consent;
}

export function clearAnalyticsStorage(): void {
  if (typeof window === "undefined") return;
  try {
    const keys: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key === "hiposta.analytics.anonymous_id" || key?.startsWith("hiposta.analytics.view.")) keys.push(key);
    }
    keys.forEach((key) => window.localStorage.removeItem(key));
  } catch {}
}
