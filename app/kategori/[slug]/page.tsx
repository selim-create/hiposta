import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { NewsletterCard } from "@/components/newsletter-card";
import { PublicationMark } from "@/components/publication-mark";
import { getCatalog } from "@/lib/catalog";
import { getContent } from "@/lib/content";
import { absoluteUrl, publicMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = true;
export async function generateStaticParams() { return (await getCatalog()).categories.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const catalog = await getCatalog();
  const category = catalog.categories.find((item) => item.slug === slug);
  if (!category) return {};
  const active = catalog.publications.some((item) => item.categorySlug === slug && item.status === "active" && !item.isComingSoon) || catalog.newsletters.some((item) => item.categorySlug === slug);
  if (!active) return { title: category.name, description: category.description, robots: { index: false, follow: true } };
  return publicMetadata({ title: category.name, description: category.description, path: `/kategori/${category.slug}` });
}

export default async function CategoryPage({ params }: Props) {
  const slug = (await params).slug;
  const [catalog, content] = await Promise.all([getCatalog(), getContent({ category: slug, limit: 24 })]);
  const category = catalog.categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const categoryArticles = content.articles;
  const categoryPublications = catalog.publications.filter((publication) => publication.categorySlug === slug);
  const categoryNewsletters = catalog.newsletters.filter((newsletter) => newsletter.categorySlug === slug);
  const indexable = categoryPublications.some((item) => item.status === "active" && !item.isComingSoon) || categoryNewsletters.length > 0 || categoryArticles.length > 0;
  const collectionSchema = indexable ? {
    "@context": "https://schema.org", "@type": "CollectionPage", name: category.name, description: category.description,
    url: absoluteUrl(`/kategori/${category.slug}`), inLanguage: "tr-TR", isPartOf: { "@type": "WebSite", name: "Hiposta", url: absoluteUrl("/") },
  } : null;

  return (
    <>
      {collectionSchema && <JsonLd data={collectionSchema} />}
      <section className="category-hero" style={{ "--category-color": category.color } as CSSProperties}>
        <div className="page-shell category-hero__inner">
          <div><p className="eyebrow">Hiposta kategorisi</p><h1>{category.name}</h1></div>
          <p>{category.description}</p>
          <span>{String(categoryPublications.length).padStart(2, "0")}<small>yayın</small></span>
        </div>
      </section>

      {categoryArticles.length > 0 && <section className="section page-shell">
        <div className="section-heading section-heading--rule"><div><p className="eyebrow">Güncel akış</p><h2>{category.shortName} gündemi</h2></div></div>
        <div className="article-grid article-grid--three">{categoryArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
      </section>}

      <section className="category-network page-shell">
        <div>
          <p className="eyebrow">Bu kategoride</p><h2>Yayınlar</h2>
          {categoryPublications.map((publication) => <div key={publication.slug} style={{ opacity: publication.isComingSoon ? 0.55 : 1 }}><PublicationMark publication={publication} /><span>{publication.description}{publication.isComingSoon ? " · Yakında" : ""}</span></div>)}
        </div>
        <div>
          <p className="eyebrow">Doğrudan gelen kutuna</p><h2>Bültenler</h2>
          {categoryNewsletters.map((newsletter) => <NewsletterCard key={newsletter.slug} newsletter={newsletter} publication={catalog.publications.find((item) => item.slug === newsletter.publicationSlug)} />)}
          {!categoryNewsletters.length && <p>Bu kategorinin yeni bültenleri yakında.</p>}
          <Link className="inline-arrow-link" href="/bultenler">Tüm bültenleri gör <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </>
  );
}
