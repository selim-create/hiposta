import type { Metadata } from "next";
import { PersonalisationFeedbackPanel } from "@/components/personalisation-feedback-panel";
import { getPersonalisationPreferences, getRecommendations } from "@/lib/personalisation";

export const metadata: Metadata = { title: "Senin İçin", description: "Hiposta kişisel keşif akışını ve içerik tercihlerini yönet." };

export default async function ForYouPage() {
  const [recommendations, preferences] = await Promise.all([
    getRecommendations(18),
    getPersonalisationPreferences(),
  ]);

  return (
    <div className="account-module-page">
      <PersonalisationFeedbackPanel
        initialItems={recommendations.items}
        initialMeta={recommendations.meta}
        initialPreferences={preferences}
      />
    </div>
  );
}
