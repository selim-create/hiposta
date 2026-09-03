import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PublicationMark } from "@/components/publication-mark";
import { getCatalog } from "@/lib/catalog";
import { absoluteUrl, publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({
  title: "Yayınlar",
  description: "Hip Medya ekosistemindeki yayınları ve ilgi alanlarını keşfet.",
  path: "/yayinlar",
});

export default async function PublicationsPage() {
  const catalog = await getCatalog();
  const catalogAvailable = catalog.source !== "unavailable";
  const activePublications = catalog.publications.filter((item) => item.status === "active" && !item.isComingSoon);
  const structuredData = catalogAvailable ? [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Hiposta Yayınları",
      description: "Hip Medya ekosistemindeki yayınlar ve ilgi alanları.",
      url: absoluteUrl("/yayinlar"),
      inLanguage: "tr-TR",
      isPartOf: { "@type": "WebSite", name: "Hiposta", url: absoluteUrl("/") },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Aktif Hiposta yayınları",
      numberOfItems: activePublications.length,
      itemListElement: activePublications.map((publication, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: publication.name,
        url: absoluteUrl(`/yayinlar/${publication.slug}`),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Hiposta", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Yayınlar", item: absoluteUrl("/yayinlar") },
      ],
    },
  ] : null;

  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      <section className="directory-hero page-shell">
        <p className="eyebrow">Hip Medya yayın ağı</p>
        <div className="directory-hero__grid">
          <h1>Farklı dünyalar.<br /><span>Tek okuma ritmi.</span></h1>
          <div>
            <p>Ekonomiden gastronomiye, spordan tasarıma; her yayın kendi editoryal kimliğiyle Hiposta’da buluşur.</p>
            {catalogAvailable ? <dl><div><dt>{catalog.stats.publications}</dt><dd>yayın</dd></div><div><dt>{catalog.stats.categories}</dt><dd>kategori</dd></div><div><dt>{catalog.stats.activeNewsletters}</dt><dd>aktif bülten</dd></div></dl> : <p className="eyebrow">Yayın ağı verilerine şu anda ulaşılamıyor.</p>}
          </div>
        </div>
      </section>

      <section className="directory page-shell">
        {!catalogAvailable && <div className="empty-state"><span>H</span><h2>Yayın dizinine şu anda ulaşılamıyor.</h2><p>Bu geçici bir bağlantı sorunu olabilir. Yayın sayısını sıfır göstermek yerine mevcut durumu açıkça belirtiyoruz.</p></div>}

        {catalogAvailable && catalog.categories.map((category) => {
          const items = catalog.publications.filter((publication) => publication.categorySlug === category.slug);
          if (!items.length) return null;
          return (
            <div className="directory-group" key={category.slug}>
              <header style={{ "--category-color": category.color } as CSSProperties}>
                <span />
                <div><p className="eyebrow">Kategori</p><h2>{category.name}</h2><p>{category.description}</p></div>
                <Link href={`/kategori/${category.slug}`}>Kategoriye git <ArrowUpRight size={15} /></Link>
              </header>
              <div className="directory-group__items">
                {items.map((publication) => {
                  const comingSoon = publication.isComingSoon;
                  return (
                    <article key={publication.slug} style={{ "--tile-color": publication.color, "--tile-foreground": publication.foreground, opacity: comingSoon ? 0.52 : 1 } as CSSProperties}>
                      <PublicationMark publication={publication} linked={false} />
                      {comingSoon && <p className="eyebrow">Yakında</p>}
                      <p>{publication.longDescription}</p>
                      <div><span>{publication.cadence}</span><span>{publication.reach}</span></div>
                      <Link href={`/yayinlar/${publication.slug}`}>{comingSoon ? "Yayını incele" : "Yayını keşfet"} <ArrowUpRight size={16} /></Link>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}

        {catalogAvailable && catalog.stats.comingSoonPublications > 0 && <div className="coming-soon"><p className="eyebrow">Ağ büyüyor</p><h2>{catalog.stats.comingSoonPublications} yayın daha Hiposta’ya hazırlanıyor.</h2><p>Yakında işaretli yayınları şimdiden keşfedebilir, yayın açıldığında haber almak için ilgili sayfayı takip edebilirsin.</p></div>}
      </section>
    </>
  );
}
