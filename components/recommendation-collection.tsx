import { Sparkles } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import type { RecommendationItem, RecommendationMeta } from "@/lib/personalisation";

export function RecommendationCollection({ items, meta }: { items: RecommendationItem[]; meta: RecommendationMeta }) {
  if (!items.length) return null;

  return (
    <section className="account-section account-section--recommendations personalised-discovery">
      <div className="section-heading section-heading--rule">
        <div><p className="eyebrow"><Sparkles size={13} /> Kişisel keşif</p><h2>Senin için seçtiklerimiz</h2></div>
        <p>{meta.cold_start ? "Takip ettiğin bültenler ve güncel Hiposta seçkisiyle başlayan kişisel akışın." : "Okuma ve kaydetme davranışlarınla şekillenen kişisel keşif akışın."}</p>
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
