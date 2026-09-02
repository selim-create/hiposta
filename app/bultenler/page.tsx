import { NewsletterWizard } from "@/components/newsletter-wizard";
import { getCatalog } from "@/lib/catalog";
import { publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({
  title: "Bültenler",
  description: "İlgi alanına, gününe ve okuma ritmine göre Hiposta bültenlerini seç.",
  path: "/bultenler",
});

export default async function NewslettersPage() {
  const catalog = await getCatalog();

  return (
    <>
      <section className="newsletter-directory-hero page-shell">
        <div><p className="eyebrow">{catalog.stats.activeNewsletters} bülten · {catalog.stats.categories} kategori</p><h1>Gelen kutun,<br /><span>senin yayın akışın.</span></h1></div>
        <div><p>İlgi alanlarını seç, sana uygun bültenleri keşfet ve tek bir akışta aboneliklerini tamamla. Hesap açmadan da ücretsiz bültenlere abone olabilirsin.</p><dl><div><dt>01</dt><dd>İlgi alanını seç</dd></div><div><dt>02</dt><dd>Önerileri düzenle</dd></div><div><dt>03</dt><dd>Seçimini onayla</dd></div></dl></div>
      </section>
      <section className="newsletter-directory newsletter-directory--wizard page-shell">
        <NewsletterWizard categories={catalog.categories} newsletters={catalog.newsletters} bundles={catalog.bundles} publications={catalog.publications} />
      </section>
    </>
  );
}
