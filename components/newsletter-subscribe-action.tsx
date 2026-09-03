"use client";

import Link from "next/link";
import { Check, Loader2, MailPlus } from "lucide-react";
import { useState } from "react";
import { SubscribeForm } from "@/components/subscribe-form";
import { trackAnalyticsEvent } from "@/lib/analytics";

type Props = {
  newsletterName: string;
  newsletterSlug: string;
  verified: boolean;
  authenticated: boolean;
  subscribed: boolean;
  compact?: boolean;
  source?: string;
};

export function NewsletterSubscribeAction({ newsletterName, newsletterSlug, verified, authenticated, subscribed: initialSubscribed, compact = false, source = "newsletter_cta" }: Props) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function subscribe() {
    if (!authenticated || !verified || subscribed || pending) return;
    setPending(true);
    setMessage("");

    try {
      const response = await fetch(`/api/auth/preferences/newsletters/${encodeURIComponent(newsletterSlug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscribed: true }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok !== true) throw new Error(String(payload?.code || "update_failed"));
      trackAnalyticsEvent({ eventType: "newsletter_signup_complete", meta: { source } });
      setSubscribed(true);
      setMessage(`${newsletterName} bültenine aboneliğin açıldı.`);
    } catch (error) {
      const code = error instanceof Error ? error.message : "update_failed";
      setMessage(code === "suppressed" ? "Bu e-posta adresi gönderim engelinde olduğu için abonelik açılamıyor." : "Abonelik açılamadı. Tekrar deneyebilirsin.");
    } finally {
      setPending(false);
    }
  }

  if (!authenticated) {
    return <SubscribeForm newsletterName={newsletterName} newsletterSlugs={[newsletterSlug]} compact={compact} />;
  }

  if (subscribed) {
    return (
      <div className="article-account-subscribe article-account-subscribe--success" role="status">
        <Check size={16} />
        <div><strong>Bu bülteni takip ediyorsun.</strong><Link href="/hesabim/bultenler">Bülten tercihlerini yönet</Link></div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="article-account-subscribe article-account-subscribe--verify">
        <strong>Tek tıkla abonelik için e-postanı doğrula.</strong>
        <Link href="/hesabim/profil">Hesabını kontrol et</Link>
      </div>
    );
  }

  return (
    <div className={`article-account-subscribe${compact ? " article-account-subscribe--compact" : ""}`}>
      <button type="button" disabled={pending} onClick={subscribe}>
        {pending ? <Loader2 size={15} className="spin" /> : <MailPlus size={15} />}
        <span>{pending ? "Ekleniyor…" : "Tek tıkla abone ol"}</span>
      </button>
      {message ? <p className="form-feedback" role="status">{message}</p> : null}
    </div>
  );
}
