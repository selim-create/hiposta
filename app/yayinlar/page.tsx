import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PublicationMark } from "@/components/publication-mark";
import { categories, platformStats, publications } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Yayınlar",
  description: "Hip Medya ekosistemindeki yayınları ve ilgi alanlarını keşfet.",
};

export default function PublicationsPage() {
  return (
    <>
      <section className="directory-hero page-shell">
        <p className="eyebrow">Hip Medya yayın ağı</p>
        <div className="directory-hero__grid">
          <h1>Farklı dünyalar.<br /><span>Tek okuma ritmi.</span></h1>
          <div><p>Ekonomiden gastronomiye, spordan tasarıma; her yayın kendi editoryal kimliğiyle Hiposta’da buluşur.</p><dl><div><dt>{platformStats.publications}</dt><dd>yayın</dd></div><div><dt>{platformStats.categories}</dt><dd>kategori</dd></div><div><dt>{platformStats.weeklyReaders}</dt><dd>haftalık okur</dd></div></dl></div>
        </div>
      </section>

      <section className="directory page-shell">
        {categories.map((category) => {
          const items = publications.filter((publication) => publication.categorySlug === category.slug);
          return (
            <div className="directory-group" key={category.slug}>
              <header style={{ "--category-color": category.color } as CSSProperties}>
                <span />
                <div><p className="eyebrow">Kategori</p><h2>{category.name}</h2><p>{category.description}</p></div>
                <Link href={`/kategori/${category.slug}`}>Kategoriye git <ArrowUpRight size={15} /></Link>
              </header>
              <div className="directory-group__items">
                {items.map((publication) => (
                  <article key={publication.slug} style={{ "--tile-color": publication.color, "--tile-foreground": publication.foreground } as CSSProperties}>
                    <PublicationMark publication={publication} linked={false} />
                    <p>{publication.longDescription}</p>
                    <div><span>{publication.cadence}</span><span>{publication.reach}</span></div>
                    <Link href={`/yayinlar/${publication.slug}`}>Yayını keşfet <ArrowUpRight size={16} /></Link>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
        <div className="coming-soon">
          <p className="eyebrow">Ağ büyüyor</p>
          <h2>9 yayın daha Hiposta’ya hazırlanıyor.</h2>
          <p>Bu prototipte sekiz ana yayın detaylandırıldı. Veri modeli 17 yayın ve yeni dikeyler için genişletilebilir yapıdadır.</p>
        </div>
      </section>
    </>
  );
}
