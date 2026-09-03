"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_OPEN_EVENT, readPrivacyConsent, savePrivacyConsent } from "@/lib/privacy-consent";

export function PrivacyConsentCenter() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const consent = readPrivacyConsent();
    setAnalytics(consent?.analytics ?? false);
    setOpen(!consent);
    setReady(true);
    const showPreferences = () => { const current = readPrivacyConsent(); setAnalytics(current?.analytics ?? false); setPreferences(true); setOpen(true); };
    window.addEventListener(CONSENT_OPEN_EVENT, showPreferences);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, showPreferences);
  }, []);

  if (!ready || !open) return null;

  const closeWith = (allowAnalytics: boolean) => {
    savePrivacyConsent(allowAnalytics);
    setAnalytics(allowAnalytics);
    setPreferences(false);
    setOpen(false);
  };

  return (
    <div className="privacy-consent" role="dialog" aria-modal="true" aria-labelledby="privacy-consent-title">
      <div className="privacy-consent__panel">
        <p className="eyebrow">Gizlilik tercihleri</p>
        <h2 id="privacy-consent-title">Kontrol sende.</h2>
        <p>Hiposta’nın çalışması için gerekli depolamayı kullanıyoruz. Ölçüm ve içerik etkileşim analitiğini ise yalnızca izin verirsen etkinleştiriyoruz. <Link href="/cerez-politikasi">Çerez ve benzer teknolojiler politikasını incele.</Link></p>
        {preferences && (
          <div className="privacy-consent__options">
            <div><div><strong>Gerekli</strong><p>Oturum, güvenlik, gizlilik tercihi ve temel ürün işlevleri için zorunludur.</p></div><span>Her zaman açık</span></div>
            <label><div><strong>Analitik</strong><p>İçerik ve ürün kullanımını toplu olarak anlamamıza yardımcı olur. Varsayılan olarak kapalıdır.</p></div><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /></label>
          </div>
        )}
        <div className="privacy-consent__actions">
          <button type="button" className="button privacy-consent__choice" onClick={() => closeWith(false)}>Yalnız gerekli</button>
          {preferences ? <button type="button" className="button privacy-consent__choice" onClick={() => closeWith(analytics)}>Tercihleri kaydet</button> : <button type="button" className="button privacy-consent__choice" onClick={() => setPreferences(true)}>Tercihleri yönet</button>}
          <button type="button" className="button privacy-consent__choice" onClick={() => closeWith(true)}>Tümünü kabul et</button>
        </div>
      </div>
    </div>
  );
}
