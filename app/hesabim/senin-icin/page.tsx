import type { Metadata } from "next";
import { RecommendationCollection } from "@/components/recommendation-collection";
import { getRecommendations } from "@/lib/personalisation";

export const metadata: Metadata = { title: "Senin İçin", description: "Hiposta kişisel keşif akışın." };

export default async function ForYouPage() {
  const recommendations = await getRecommendations(18);
  return (
    <div className="account-module-page">
      <RecommendationCollection items={recommendations.items} meta={recommendations.meta} />
      {!recommendations.items.length && <div className="account-empty"><h3>Kişisel akışın hazırlanıyor.</h3><p>İçerik okudukça, kaydettikçe ve bülten tercihlerini kullandıkça bu alan sana göre şekillenecek.</p></div>}
    </div>
  );
}
