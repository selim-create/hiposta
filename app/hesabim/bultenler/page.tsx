import type { Metadata } from "next";
import { NewsletterPreferences } from "@/components/newsletter-preferences";
import { getAuthSession } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Bültenler", description: "Hiposta bülten tercihlerini yönet." };

export default async function NewslettersPage() {
  const [session, catalog] = await Promise.all([getAuthSession(), getCatalog()]);
  if (!session) return null;

  const activeSubscriptions = session.subscriptions.filter((item) => item.status === "active");
  const activeSlugs = new Set(activeSubscriptions.map((item) => item.newsletter_slug));
  const preferenceItems = catalog.newsletters
    .map((newsletter) => {
      const publication = catalog.publications.find((item) => item.slug === newsletter.publicationSlug && item.status === "active");
      if (!publication) return null;
      return { newsletter, publication, subscribed: activeSlugs.has(newsletter.slug) };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="account-section account-section--preferences">
      <div className="section-heading section-heading--rule">
        <div><p className="eyebrow">Gelen kutun</p><h2>Bülten tercihlerin</h2></div>
        <p>Hiposta ağındaki aktif bültenleri tek yerden yönet.</p>
      </div>
      {preferenceItems.length ? <NewsletterPreferences items={preferenceItems} verified={session.account.email_verified} /> : <div className="account-empty"><h3>Şu anda yönetilebilir bülten yok.</h3><p>Aktif Hiposta bültenleri burada görünecek.</p></div>}
    </section>
  );
}
