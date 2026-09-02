"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import type { Article } from "@/lib/types";

type Recommendation = { article: Article; score: number; reason: string };
type Payload = { ok?: boolean; data?: { items?: Recommendation[]; meta?: { cold_start?: boolean } } };

export function HomePersonalisedRecommendations() {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/personalisation/recommendations?limit=6", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return await response.json() as Payload;
      })
      .then((payload) => {
        if (!active) return;
        setItems(payload?.ok && Array.isArray(payload.data?.items) ? payload.data!.items! : []);
        setReady(true);
      })
      .catch(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  if (!ready || items.length === 0) return null;

  return (
    <section className="section personalised-discovery page-shell" aria-labelledby="personalised-home-title">
      <div className="section-heading section-heading--rule">
        <div><p className="eyebrow"><Sparkles size={13} /> Sana göre</p><h2 id="personalised-home-title">Senin için</h2></div>
        <p>Okudukların, kaydettiklerin ve takip ettiğin bültenlerden şekillenen kişisel seçkin.</p>
      </div>
      <div className="article-grid article-grid--three personalised-discovery__grid">
        {items.map((item) => (
          <div className="personalised-discovery__item" key={item.article.slug}>
            <div className="personalised-discovery__reason"><Sparkles size={12} /> {item.reason}</div>
            <ArticleCard article={item.article} />
          </div>
        ))}
      </div>
    </section>
  );
}
