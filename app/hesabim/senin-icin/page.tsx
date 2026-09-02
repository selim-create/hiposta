import type { Metadata } from "next";
import { NewsletterRecommendations } from "@/components/newsletter-recommendations";
import { PersonalisationFeedbackPanel } from "@/components/personalisation-feedback-panel";
import { getCatalog } from "@/lib/catalog";
import { getNewsletterRecommendations } from "@/lib/newsletter-intelligence";
import { getPersonalisationPreferences, getRecommendations } from "@/lib/personalisation";

export const metadata: Metadata = { title: "Senin İçin", description: "Hiposta kişisel keşif akışını, içerik ve bülten tercihlerini yönet." };

export default async function ForYouPage() {
  const [recommendations, preferences, newsletterRecommendations, catalog] = await Promise.all([
    getRecommendations(18),
    getPersonalisationPreferences(),
    getNewsletterRecommendations(6),
    getCatalog(),
  ]);

  const newsletterItems = newsletterRecommendations.items.flatMap((item) => {
    const newsletter = catalog.newsletters.find((candidate) => candidate.slug === item.newsletterSlug);
    const publication = catalog.publications.find((candidate) => candidate.slug === item.publicationSlug && candidate.status === "active");
    if (!newsletter || !publication) return [];
    return [{ newsletter, publication, reason: item.reason }];
  });

  return (
    <div className="account-module-page">
      <PersonalisationFeedbackPanel
        initialItems={recommendations.items}
        initialMeta={recommendations.meta}
        initialPreferences={preferences}
      />
      <NewsletterRecommendations items={newsletterItems} verified={newsletterRecommendations.meta.email_verified} />
    </div>
  );
}
