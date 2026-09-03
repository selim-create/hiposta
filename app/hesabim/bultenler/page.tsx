import type { Metadata } from "next";
import { NewsletterAccountManager } from "@/components/newsletter-account-manager";
import { getAuthSession } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Bültenler", description: "Hiposta bülten tercihlerini yönet." };

export default async function NewslettersPage() {
  const [session, catalog] = await Promise.all([getAuthSession(), getCatalog()]);
  if (!session) return null;

  const activeSlugs = session.subscriptions
    .filter((item) => item.status === "active")
    .map((item) => item.newsletter_slug);

  return (
    <section className="account-section account-section--preferences">
      <div className="section-heading section-heading--rule">
        <div><p className="eyebrow">Gelen kutun</p><h2>Bülten tercihlerin</h2></div>
        <p>Hiposta ağındaki aktif bültenleri paketlerle veya tek tek yönet.</p>
      </div>
      {catalog.newsletters.length ? (
        <NewsletterAccountManager
          email={session.account.email}
          verified={session.account.email_verified}
          activeSlugs={activeSlugs}
          newsletters={catalog.newsletters}
          bundles={catalog.bundles}
          publications={catalog.publications}
        />
      ) : (
        <div className="account-empty"><h3>Şu anda yönetilebilir bülten yok.</h3><p>Aktif Hiposta bültenleri burada görünecek.</p></div>
      )}
    </section>
  );
}
