import { JsonLd } from "@/components/json-ld";
import { NewsletterDirectoryExperience } from "@/components/newsletter-directory-experience";
import { getCatalog } from "@/lib/catalog";
import { absoluteUrl, publicMetadata } from "@/lib/seo";

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

  const activePublicationSlugs = new Set(catalog.publications.filter((item) => item.status === "active" && !item.isComingSoon).map((item) => item.slug));
  const activeNewsletters = catalog.newsletters.filter((item) => activePublicationSlugs.has(item.publicationSlug));
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Hiposta Bültenleri",
      description: "İlgi alanına ve okuma ritmine göre seçilebilen Hiposta e-posta bültenleri.",
      url: absoluteUrl("/bultenler"),
      inLanguage: "tr-TR",
      isPartOf: { "@type": "WebSite", name: "Hiposta", url: absoluteUrl("/") },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Aktif Hiposta bültenleri",
      numberOfItems: activeNewsletters.length,
      itemListElement: activeNewsletters.map((newsletter, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: newsletter.name,
        url: absoluteUrl(`/bultenler/${newsletter.slug}`),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Hiposta", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Bültenler", item: absoluteUrl("/bultenler") },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <NewsletterDirectoryExperience
        categories={catalog.categories}
        newsletters={catalog.newsletters}
        bundles={catalog.bundles}
        publications={catalog.publications}
        activeNewsletterCount={catalog.stats.activeNewsletters}
        categoryCount={catalog.stats.categories}
      />
    </>
  );
}
