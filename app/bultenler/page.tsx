import type { Metadata } from "next";
import { NewsletterSelector } from "@/components/newsletter-selector";
import { categories, newsletterBundles, newsletters, publications } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Bültenler",
  description: "İlgi alanına, gününe ve okuma ritmine göre Hiposta bültenlerini seç.",
};

export default function NewslettersPage() {
  return (
    <>
      <section className="newsletter-directory-hero page-shell">
        <div><p className="eyebrow">24 bülten · 8 kategori</p><h1>Gelen kutun,<br /><span>senin yayın akışın.</span></h1></div>
        <div><p>Hangi konunun, hangi gün ve ne sıklıkta geleceğini sen belirle. Seçtiklerin tek hesapta, yayınların editoryal kimliği korunarak yönetilir.</p><dl><div><dt>01</dt><dd>İlgi alanını seç</dd></div><div><dt>02</dt><dd>Bültenleri birleştir</dd></div><div><dt>03</dt><dd>Tek tıkla yönet</dd></div></dl></div>
      </section>
      <section className="newsletter-directory page-shell">
        <NewsletterSelector categories={categories} newsletters={newsletters} bundles={newsletterBundles} publications={publications} />
      </section>
    </>
  );
}
