"use client";

import { useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PublicationLogo } from "@/components/publication-logo";
import type { Newsletter, Publication } from "@/lib/types";

type PreferenceItem = {
  newsletter: Newsletter;
  publication: Publication;
  subscribed: boolean;
};

export function NewsletterPreferences({
  items,
  verified,
}: {
  items: PreferenceItem[];
  verified: boolean;
}) {
  const router = useRouter();
  const [states, setStates] = useState<Record<string, boolean>>(() => Object.fromEntries(items.map((item) => [item.newsletter.slug, item.subscribed])));
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const activeCount = useMemo(() => Object.values(states).filter(Boolean).length, [states]);

  async function toggle(slug: string, subscribed: boolean) {
    if (!verified || pending) return;
    setPending(slug);
    setMessage("");
    try {
      const response = await fetch(`/api/auth/preferences/newsletters/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscribed }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok !== true) {
        const code = String(payload?.code || "update_failed");
        if (code === "verification_required") throw new Error("verification_required");
        if (code === "suppressed") throw new Error("suppressed");
        throw new Error("update_failed");
      }
      setStates((current) => ({ ...current, [slug]: subscribed }));
      setMessage(subscribed ? "Bülten aboneliği açıldı." : "Bülten aboneliği kapatıldı.");
      router.refresh();
    } catch (error) {
      const code = error instanceof Error ? error.message : "update_failed";
      setMessage(
        code === "verification_required"
          ? "Bülten tercihlerini değiştirmek için e-posta doğrulaması gerekli."
          : code === "suppressed"
            ? "Bu e-posta adresi gönderim engelinde olduğu için yeniden abonelik açılamıyor."
            : "Bülten tercihi güncellenemedi. Tekrar deneyebilirsin."
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="account-preferences">
      <div className="account-preferences__summary">
        <div><span>Aktif bülten</span><strong>{activeCount}</strong></div>
        <p>{verified ? "İstediğin bültenleri buradan açıp kapatabilirsin." : "Bülten tercihlerini değiştirmek için e-posta doğrulaması gerekli."}</p>
      </div>

      {message && <div className="account-preferences__message" role="status">{message}</div>}

      <div className="account-preferences__grid">
        {items.map(({ newsletter, publication }) => {
          const subscribed = Boolean(states[newsletter.slug]);
          const isPending = pending === newsletter.slug;
          return (
            <article key={newsletter.slug} className={`account-preference-card${subscribed ? " account-preference-card--active" : ""}`}>
              <div className="account-preference-card__brand">
                <PublicationLogo publication={publication} size="medium" />
                <div><small>{publication.name}</small><strong>{newsletter.name}</strong><span>{newsletter.schedule}{newsletter.deliveryTime ? ` · ${newsletter.deliveryTime}` : ""}</span></div>
              </div>
              <button
                className={`account-preference-toggle${subscribed ? " is-active" : ""}`}
                type="button"
                role="switch"
                aria-checked={subscribed}
                disabled={!verified || Boolean(pending)}
                onClick={() => toggle(newsletter.slug, !subscribed)}
              >
                {isPending ? <Loader2 size={15} className="spin" /> : subscribed ? <><Check size={14} /> Aktif</> : "Abone ol"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
