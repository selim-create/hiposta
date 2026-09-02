"use client";

import { Minus, RotateCcw, Sparkles, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useState } from "react";
import { ArticleCard } from "@/components/article-card";
import type { PersonalisationPreference, RecommendationFeedbackAction, RecommendationItem, RecommendationMeta } from "@/lib/personalisation";

type Props = {
  initialItems: RecommendationItem[];
  initialMeta: RecommendationMeta;
  initialPreferences: PersonalisationPreference[];
};

type RecommendationPayload = { ok?: boolean; data?: { items?: RecommendationItem[]; meta?: Partial<RecommendationMeta> } };
type PreferencePayload = { ok?: boolean; data?: PersonalisationPreference[] };

export function PersonalisationFeedbackPanel({ initialItems, initialMeta, initialPreferences }: Props) {
  const [items, setItems] = useState(initialItems);
  const [meta, setMeta] = useState(initialMeta);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function refreshRecommendations() {
    const response = await fetch("/api/personalisation/recommendations?limit=18", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json() as RecommendationPayload;
    if (!payload.ok || !payload.data || !Array.isArray(payload.data.items)) return;
    setItems(payload.data.items);
    setMeta((current) => ({
      ...current,
      strategy: payload.data?.meta?.strategy ?? current.strategy,
      signal_count: Number(payload.data?.meta?.signal_count ?? current.signal_count),
      active_subscription_count: Number(payload.data?.meta?.active_subscription_count ?? current.active_subscription_count),
      preference_count: Number(payload.data?.meta?.preference_count ?? current.preference_count),
      cold_start: Boolean(payload.data?.meta?.cold_start),
    }));
  }

  async function sendFeedback(contentId: number | undefined, action: RecommendationFeedbackAction, key: string, success: string) {
    if (!contentId || busy) return;
    setBusy(key);
    setMessage("");
    try {
      const response = await fetch("/api/personalisation/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_id: contentId, action }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; data?: { preferences?: PersonalisationPreference[] } };
      if (!response.ok || !payload.ok) throw new Error("feedback_failed");
      if (Array.isArray(payload.data?.preferences)) setPreferences(payload.data!.preferences!);
      await refreshRecommendations();
      setMessage(success);
    } catch {
      setMessage("Tercih kaydedilemedi. Tekrar deneyebilirsin.");
    } finally {
      setBusy(null);
    }
  }

  async function removePreference(preference: PersonalisationPreference) {
    const key = `${preference.entity_type}-${preference.entity_id}`;
    if (busy) return;
    setBusy(key);
    setMessage("");
    try {
      const params = new URLSearchParams({ entity_type: preference.entity_type, entity_id: String(preference.entity_id) });
      const response = await fetch(`/api/personalisation/preferences?${params}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({})) as PreferencePayload;
      if (!response.ok || !payload.ok || !Array.isArray(payload.data)) throw new Error("remove_failed");
      setPreferences(payload.data);
      await refreshRecommendations();
      setMessage("Tercih kaldırıldı.");
    } catch {
      setMessage("Tercih kaldırılamadı. Tekrar deneyebilirsin.");
    } finally {
      setBusy(null);
    }
  }

  async function resetPreferences() {
    if (busy) return;
    setBusy("reset");
    setMessage("");
    try {
      const response = await fetch("/api/personalisation/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const payload = await response.json().catch(() => ({})) as PreferencePayload;
      if (!response.ok || !payload.ok) throw new Error("reset_failed");
      setPreferences([]);
      await refreshRecommendations();
      setMessage("Açık tercihlerin sıfırlandı. Okuma ve kaydetme geçmişin korunuyor.");
    } catch {
      setMessage("Tercihler sıfırlanamadı. Tekrar deneyebilirsin.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="personalisation-feedback-v2">
      <section className="account-section account-section--recommendations personalised-discovery">
        <div className="section-heading section-heading--rule">
          <div><p className="eyebrow"><Sparkles size={13} /> Kişisel keşif</p><h2>Senin için seçtiklerimiz</h2></div>
          <p>{meta.cold_start ? "Takip ettiğin bültenler ve güncel Hiposta seçkisiyle başlayan kişisel akışın." : "Okuma, kaydetme ve açık tercihlerinle şekillenen kişisel keşif akışın."}</p>
        </div>

        {message ? <div className="personalisation-feedback-v2__message" role="status">{message}</div> : null}

        {items.length ? (
          <div className="article-grid article-grid--three personalised-discovery__grid">
            {items.map((item) => {
              const id = item.article.id;
              const categoryName = item.article.categoryShortName || item.article.categoryName || "bu konu";
              const publicationName = item.article.publicationName || "bu yayın";
              return (
                <div className="personalised-discovery__item personalised-discovery__item--feedback" key={item.article.slug}>
                  <div className="personalised-discovery__reason"><Sparkles size={12} /> {item.reason}</div>
                  <ArticleCard article={item.article} />
                  <div className="personalisation-feedback-v2__actions" aria-label={`${item.article.title} için kişiselleştirme tercihleri`}>
                    <button disabled={Boolean(busy)} onClick={() => sendFeedback(id, "more_category", `${id}-more-category`, `${categoryName} için daha fazla içerik göstereceğiz.`)}><ThumbsUp size={13} /> Bu konudan daha fazla</button>
                    <button disabled={Boolean(busy)} onClick={() => sendFeedback(id, "less_category", `${id}-less-category`, `${categoryName} için daha az içerik göstereceğiz.`)}><Minus size={13} /> Bu konudan daha az</button>
                    <button disabled={Boolean(busy)} onClick={() => sendFeedback(id, "more_publication", `${id}-more-publication`, `${publicationName} içeriklerine daha fazla ağırlık vereceğiz.`)}><ThumbsUp size={13} /> Bu yayından daha fazla</button>
                    <button disabled={Boolean(busy)} onClick={() => sendFeedback(id, "less_publication", `${id}-less-publication`, `${publicationName} içeriklerine daha az ağırlık vereceğiz.`)}><ThumbsDown size={13} /> Bu yayından daha az</button>
                    <button className="is-negative" disabled={Boolean(busy)} onClick={() => sendFeedback(id, "dismiss_content", `${id}-dismiss`, "Bu içerik önerilerinden kaldırıldı.")}><X size={13} /> İlgilenmiyorum</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="account-empty"><h3>Kişisel akışın hazırlanıyor.</h3><p>İçerik okudukça, kaydettikçe ve bülten tercihlerini kullandıkça bu alan sana göre şekillenecek.</p></div>
        )}
      </section>

      <section className="account-section personalisation-preferences-v2">
        <div className="section-heading section-heading--rule">
          <div><p className="eyebrow">Açık tercihler</p><h2>Akışını sen yönlendir.</h2></div>
          <p>Buradaki tercihler okuma geçmişinden daha güçlü sinyal verir. İstediğin zaman kaldırabilir veya tamamen sıfırlayabilirsin.</p>
        </div>

        {preferences.length ? (
          <div className="personalisation-preferences-v2__panel">
            <div className="personalisation-preferences-v2__list">
              {preferences.map((preference) => {
                const positive = preference.weight > 0;
                const label = preference.entity_type === "category" ? "Konu" : "Yayın";
                return (
                  <div key={`${preference.entity_type}-${preference.entity_id}`} className={`personalisation-preferences-v2__item ${positive ? "is-positive" : "is-negative"}`}>
                    <div><span>{label}</span><strong>{preference.entity_name}</strong><small>{positive ? `Daha fazla göster · +${preference.weight}` : `Daha az göster · ${preference.weight}`}</small></div>
                    <button type="button" disabled={Boolean(busy)} onClick={() => removePreference(preference)} aria-label={`${preference.entity_name} tercihini kaldır`}><X size={14} /> Kaldır</button>
                  </div>
                );
              })}
            </div>
            <button className="button button--ghost personalisation-preferences-v2__reset" type="button" disabled={Boolean(busy)} onClick={resetPreferences}><RotateCcw size={14} /> Tüm açık tercihleri sıfırla</button>
          </div>
        ) : (
          <div className="account-empty"><h3>Henüz açık tercihin yok.</h3><p>Yukarıdaki önerilerde daha fazla veya daha az göster seçeneklerini kullandığında tercihlerin burada görünecek.</p></div>
        )}
      </section>
    </div>
  );
}
