"use client";

import Link from "next/link";
import { ArrowRight, Check, Loader2, MailPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { SubscribeForm } from "@/components/subscribe-form";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { getClientAuthSession, refreshClientAuthSession } from "@/lib/client-session";

type Props = {
  newsletterName: string;
  newsletterSlug: string;
  verified?: boolean;
  authenticated?: boolean;
  subscribed?: boolean;
  compact?: boolean;
  source?: string;
  anonymousMode?: "form" | "link";
};

type SessionState = { authenticated: boolean; verified: boolean; subscribed: boolean };

export function NewsletterSubscribeAction({ newsletterName, newsletterSlug, verified, authenticated, subscribed, compact = false, source = "newsletter_cta", anonymousMode = "form" }: Props) {
  const hasServerState = authenticated !== undefined && verified !== undefined && subscribed !== undefined;
  const [sessionState, setSessionState] = useState<SessionState | null>(() => hasServerState ? { authenticated: Boolean(authenticated), verified: Boolean(verified), subscribed: Boolean(subscribed) } : null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (hasServerState) return;
    let active = true;
    void getClientAuthSession().then((session) => {
      if (!active) return;
      setSessionState({
        authenticated: Boolean(session),
        verified: Boolean(session?.account.email_verified),
        subscribed: Boolean(session?.subscriptions.some((item) => item.status === "active" && item.newsletter_slug === newsletterSlug)),
      });
    });
    return () => { active = false; };
  }, [hasServerState, newsletterSlug]);

  async function subscribe() {
    if (!sessionState?.authenticated || !sessionState.verified || sessionState.subscribed || pending) return;
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
      setSessionState((current) => current ? { ...current, subscribed: true } : current);
      void refreshClientAuthSession();
      setMessage(`${newsletterName} bültenine aboneliğin açıldı.`);
    } catch (error) {
      const code = error instanceof Error ? error.message : "update_failed";
      setMessage(code === "suppressed" ? "Bu e-posta adresi gönderim engelinde olduğu için abonelik açılamıyor." : "Abonelik açılamadı. Tekrar deneyebilirsin.");
    } finally {
      setPending(false);
    }
  }

  if (sessionState === null) {
    return <div className={`article-account-subscribe article-account-subscribe--loading${compact ? " article-account-subscribe--compact" : ""}`} aria-hidden="true" />;
  }

  if (!sessionState.authenticated) {
    if (anonymousMode === "link") {
      return <Link className="newsletter-card-subscribe-link" href={`/bultenler/${newsletterSlug}`}>Abone ol <ArrowRight size={14} /></Link>;
    }
    return <SubscribeForm newsletterName={newsletterName} newsletterSlugs={[newsletterSlug]} compact={compact} />;
  }

  if (sessionState.subscribed) {
    return (
      <div className="article-account-subscribe article-account-subscribe--success" role="status">
        <Check size={16} />
        <div><strong>Bu bülteni takip ediyorsun.</strong><Link href="/hesabim/bultenler">Bülten tercihlerini yönet</Link></div>
      </div>
    );
  }

  if (!sessionState.verified) {
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
