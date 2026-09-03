import { NewsletterDirectoryExperience } from "@/components/newsletter-directory-experience";
import { getCatalog } from "@/lib/catalog";
import { publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({
  title: "Bültenler",
  description: "İlgi alanına, gününe ve okuma ritmine göre Hiposta bültenlerini seç.",
  path: "/bultenler",
});

export default async function NewslettersPage() {
  const catalog = await getCatalog();
  const catalogAvailable = catalog.source !== "unavailable";

  if (!catalogAvailable) {
    return (
      <>
        <section className="newsletter-directory-hero page-shell">
          <div><p className="eyebrow">Hiposta bülten ağı</p><h1>Gelen kutun,<br /><span>senin yayın akışın.</span></h1></div>
          <div><p>Bülten kataloğuna şu anda ulaşılamıyor. Eksik veriyle seçim göstermiyoruz.</p></div>
        </section>
        <section className="newsletter-directory newsletter-directory--wizard page-shell">
          <div className="empty-state"><span>H</span><h2>Bülten kataloğuna şu anda ulaşılamıyor.</h2><p>Bağlantı yeniden kurulduğunda bültenlerini burada yönetebilirsin.</p></div>
        </section>
      </>
    );
  }

  return (
    <NewsletterDirectoryExperience
      categories={catalog.categories}
      newsletters={catalog.newsletters}
      bundles={catalog.bundles}
      publications={catalog.publications}
      activeNewsletterCount={catalog.stats.activeNewsletters}
      categoryCount={catalog.stats.categories}
    />
  );
}
