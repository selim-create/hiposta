import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { NewsletterCard } from "@/components/newsletter-card";
import { PublicationMark } from "@/components/publication-mark";
import { getCatalog } from "@/lib/catalog";
import { getPublicationArticles } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
export async function generateStaticParams() { return (await getCatalog()).publications.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const publication = (await getCatalog()).publications.find((item) => item.slug === slug);
  return publication ? { title: publication.name, description: publication.longDescription } : {};
}

export default async function PublicationPage({ params }: Props) {
  const slug = (await params).slug;
  const catalog = await getCatalog();
  const publication = catalog.publications.find((item) => item.slug === slug);
  if (!publication) notFound();
  const category = catalog.categories.find((item) => item.slug === publication.categorySlug);
  if (!category) notFound();

  const publicationArticles = getPublicationArticles(publication.slug);
  const publicationNewsletters = catalog.newsletters.filter((newsletter) => newsletter.publicationSlug === publication.slug);
  const style = { "--publication-hero": publication.color, "--publication-ink": publication.foreground } as CSSProperties;

  return (
    <>
      <section className="publication-hero" style={style}>
        <div className="page-shell publication-hero__inner">
          <div className="breadcrumb"><Link href="/yayinlar">Yayınlar</Link><span>/</span><Link href={`/kategori/${category.slug}`}>{category.shortName}</Link></div>
          <div className="publication-hero__grid">
            <div>
              <PublicationMark publication={publication} size="large" linked={false} />
              {publication.isComingSoon && <p className="eyebrow">Yakında</p>}
              <p className="publication-hero__kicker">{publication.kicker}</p>
              <h1>{publication.description}</h1>
            </div>
            <div className="publication-hero__about">
              <p>{publication.longDescription}</p>
              <dl><div><dt>Yayın ritmi</dt><dd>{publication.cadence}</dd></div><div><dt>Abone</dt><dd>{publication.reach}</dd></div><div><dt>Kategori</dt><dd>{category.name}</dd></div></dl>
            </div>
          </div>
        </div>
      </section>

      {publicationArticles.length > 0 && (
        <section className="section page-shell">
          <div className="section-heading section-heading--rule"><div><p className="eyebrow">Son içerikler</p><h2>{publication.name} gündemi</h2></div><Link href={`/kategori/${category.slug}`}>Kategoriyi aç <ArrowUpRight size={15} /></Link></div>
          <div className="article-grid article-grid--three">{publicationArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
        </section>
      )}

      <section className="publication-newsletters">
        <div className="page-shell">
          <div className="newsletter-showcase__heading"><div><p className="eyebrow">Doğrudan gelen kutuna</p><h2>{publication.name}<br />bültenleri</h2></div><p>{publication.isComingSoon ? "Bu yayın için bültenler hazırlanıyor." : "İçerikleri siteye gelmeden, kendi ritminde takip et. Her bültenden istediğin zaman ayrılabilirsin."}</p></div>
          <div className="newsletter-grid">
            {publicationNewsletters.map((newsletter) => <NewsletterCard key={newsletter.slug} newsletter={newsletter} publication={publication} />)}
            {!publicationNewsletters.length && publication.isComingSoon && <article className="newsletter-more-card"><span>H</span><h3>Bu yayın yakında Hiposta’da.</h3><Link href="/yayinlar">Diğer yayınları keşfet <ArrowRight size={16} /></Link></article>}
            {publicationNewsletters.length > 0 && <article className="newsletter-more-card"><span>H</span><h3>Tüm ilgi alanlarını tek yerden seç.</h3><Link href="/bultenler">Bülten merkezine git <ArrowRight size={16} /></Link></article>}
          </div>
        </div>
      </section>
    </>
  );
}
