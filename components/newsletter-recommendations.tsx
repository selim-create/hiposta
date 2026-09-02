"use client";

import Link from "next/link";
import { Loader2, MailPlus, Sparkles } from "lucide-react";
import { useState } from "react";
import { PublicationLogo } from "@/components/publication-logo";
import type { Newsletter, Publication } from "@/lib/types";

type Item = { newsletter: Newsletter; publication: Publication; reason: string };

export function NewsletterRecommendations({ items: initialItems, verified }: { items: Item[]; verified: boolean }) {
  const [items, setItems] = useState(initialItems);
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState("");

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
      <div className="section-heading section-heading--rule">
        <div><p className="eyebrow"><Sparkles size={13} /> Newsletter Intelligence</p><h2>Sana uygun bültenler</h2></div>
        <p>Okuma, kaydetme ve açık tercihlerinden yola çıkarak henüz takip etmediğin bültenleri seçiyoruz.</p>
      </div>
      {message ? <div className="personalisation-feedback-v2__message" role="status">{message}</div> : null}
      {!verified ? <div className="account-empty"><h3>Abonelik için e-postanı doğrula.</h3><p>Önerileri görebilirsin; tek tıkla abone olmak için hesabındaki e-posta doğrulamasını tamamlaman yeterli.</p><Link href="/hesabim/profil">Hesabını kontrol et</Link></div> : null}
      <div className="account-preferences__grid">
        {items.map(({ newsletter, publication, reason }) => {
          const isPending = pending === newsletter.slug;
          return (
            <article key={newsletter.slug} className="account-preference-card">
              <div className="personalised-discovery__reason"><Sparkles size={12} /> {reason}</div>
              <div className="account-preference-card__brand">
                <PublicationLogo publication={publication} size="medium" />
                <div><small>{publication.name}</small><strong>{newsletter.name}</strong><span>{newsletter.schedule}{newsletter.deliveryTime ? ` · ${newsletter.deliveryTime}` : ""}</span></div>
              </div>
              <p>{newsletter.description}</p>
              <div className="personalisation-feedback-v2__actions">
                <Link href={`/bultenler/${newsletter.slug}`}>Bülteni incele</Link>
                <button type="button" disabled={!verified || Boolean(pending)} onClick={() => subscribe(newsletter.slug)}>{isPending ? <Loader2 size={14} className="spin" /> : <MailPlus size={14} />} Tek tıkla abone ol</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
