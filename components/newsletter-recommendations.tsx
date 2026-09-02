"use client";

import Link from "next/link";
import { ArrowRight, Loader2, MailPlus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { PublicationLogo } from "@/components/publication-logo";
import { trackAnalyticsEvent, trackAnalyticsEvents } from "@/lib/analytics";
import type { Newsletter, Publication } from "@/lib/types";

type Item = { newsletter: Newsletter; publication: Publication; reason: string };

export function NewsletterRecommendations({ items: initialItems, verified }: { items: Item[]; verified: boolean }) {
  const [items, setItems] = useState(initialItems);
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!initialItems.length) return;
    void trackAnalyticsEvents(initialItems.slice(0, 12).map(() => ({
      eventType: "newsletter_recommendation_view" as const,
      meta: { source: "for_you", recommendation_kind: "newsletter" },
    })));
  }, [initialItems]);

  async function subscribe(slug: string) {
    if (!verified || pending) return;
    setPending(slug);
    setMessage("");
    try {
      const response = await fetch(`/api/auth/preferences/newsletters/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscribed: true }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok !== true) throw new Error(String(payload?.code || "update_failed"));
      trackAnalyticsEvent({ eventType: "newsletter_recommendation_subscribe", meta: { source: "for_you", recommendation_kind: "newsletter" } });
      setItems((current) => current.filter((item) => item.newsletter.slug !== slug));
      setMessage("Bülten aboneliğin açıldı. Yeni önerilerin davranışlarına göre yeniden şekillenecek.");
    } catch (error) {
      const code = error instanceof Error ? error.message : "update_failed";
      setMessage(code === "suppressed" ? "Bu e-posta adresi gönderim engelinde olduğu için abonelik açılamıyor." : "Bülten aboneliği açılamadı. Tekrar deneyebilirsin.");
    } finally {
      setPending(null);
    }
  }

  if (!items.length) return null;

  return (
    <section className="account-section account-section--recommendations newsletter-intelligence-v1">
      <div className="section-heading section-heading--rule newsletter-intelligence-v1__heading">
        <div><p className="eyebrow"><Sparkles size={13} /> Sana göre</p><h2>Sana uygun bültenler</h2></div>
        <p>Okuma, kaydetme ve açık tercihlerinden yola çıkarak henüz takip etmediğin bültenleri seçiyoruz.</p>
      </div>

      {message ? <div className="newsletter-intelligence-v1__message" role="status">{message}</div> : null}

      {!verified ? (
        <div className="newsletter-intelligence-v1__verification">
          <div><strong>Tek tıkla abonelik için e-postanı doğrula.</strong><p>Önerileri görebilirsin; hesabını doğruladığında e-posta adresini yeniden girmeden abone olabilirsin.</p></div>
          <Link href="/hesabim/profil">Hesabını kontrol et <ArrowRight size={14} /></Link>
        </div>
      ) : null}

      <div className="newsletter-intelligence-v1__grid">
        {items.map(({ newsletter, publication, reason }) => {
          const isPending = pending === newsletter.slug;
          return (
            <article key={newsletter.slug} className="newsletter-recommendation-card">
              <div className="newsletter-recommendation-card__reason"><Sparkles size={12} /> <span>{reason}</span></div>
              <div className="newsletter-recommendation-card__brand">
                <PublicationLogo publication={publication} size="medium" />
                <div>
                  <span className="newsletter-recommendation-card__publication">{publication.name}</span>
                  <h3>{newsletter.name}</h3>
                  <span className="newsletter-recommendation-card__schedule">{newsletter.schedule}{newsletter.deliveryTime ? ` · ${newsletter.deliveryTime}` : ""}</span>
                </div>
              </div>
              <p className="newsletter-recommendation-card__description">{newsletter.description}</p>
              <div className="newsletter-recommendation-card__footer">
                <Link className="newsletter-recommendation-card__details" href={`/bultenler/${newsletter.slug}`}>Bülteni incele <ArrowRight size={14} /></Link>
                <button className="newsletter-recommendation-card__subscribe" type="button" disabled={!verified || Boolean(pending)} onClick={() => subscribe(newsletter.slug)}>
                  {isPending ? <Loader2 size={14} className="spin" /> : <MailPlus size={14} />}
                  <span>{isPending ? "Ekleniyor…" : "Tek tıkla abone ol"}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
