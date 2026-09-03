"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/privacy-consent";

export function PrivacyPreferencesLink() {
  return <button type="button" className="footer-privacy-button" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>Çerez tercihlerim</button>;
}
