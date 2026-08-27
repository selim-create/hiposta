import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PublicationMark } from "@/components/publication-mark";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Yayınlar",
  description: "Hip Medya ekosistemindeki yayınları ve ilgi alanlarını keşfet.",
};

export default async function PublicationsPage() {
  const catalog = await getCatalog();

  return (
    <>
      <section className="directory-hero page-shell">
        <p className="eyebrow">Hip Medya yayın ağı</p>
        <div className="directory-hero__grid">
          <h1>Farklı dünyalar.<br /><span>Tek okuma ritmi.</span></h1>
          <div>
            <p>Ekonomiden gastronomiye, spordan tasarıma; her yayın kendi editoryal kimliğiyle Hiposta’da buluşur.</p>
            <dl>
              <div><dt>{catalog.stats.publications}</dt><dd>yayın</dd></div>
              <div><dt>{catalog.stats.categories}</dt><dd>kategori</dd></div>
              <div><dt>{catalog.stats.activeNewsletters}</dt><dd>aktif bülten</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="directory page-shell">
        {catalog.categories.map((category) => {
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
                    <article
                      key={publication.slug}
                      style={{
                        "--tile-color": publication.color,
                        "--tile-foreground": publication.foreground,
                        opacity: comingSoon ? 0.52 : 1,
                      } as CSSProperties}
                    >
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

        {catalog.stats.comingSoonPublications > 0 && (
          <div className="coming-soon">
            <p className="eyebrow">Ağ büyüyor</p>
            <h2>{catalog.stats.comingSoonPublications} yayın daha Hiposta’ya hazırlanıyor.</h2>
            <p>Yakında işaretli yayınları şimdiden keşfedebilir, yayın açıldığında haber almak için ilgili sayfayı takip edebilirsin.</p>
          </div>
        )}
      </section>
    </>
  );
}
