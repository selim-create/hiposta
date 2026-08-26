import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { NewsletterCard } from "@/components/newsletter-card";
import { PublicationMark } from "@/components/publication-mark";
import { getCategory, getCategoryArticles, getCategoryNewsletters, getCategoryPublications } from "@/lib/data";
import { categories } from "@/lib/mock-data";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return categories.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).slug);
  if (!category) notFound();
  const categoryArticles = getCategoryArticles(category.slug);
  const categoryPublications = getCategoryPublications(category.slug);
  const categoryNewsletters = getCategoryNewsletters(category.slug);

  return (
    <>
      <section className="category-hero" style={{ "--category-color": category.color } as CSSProperties}>
        <div className="page-shell category-hero__inner"><div><p className="eyebrow">Hiposta kategorisi</p><h1>{category.name}</h1></div><p>{category.description}</p><span>{String(categoryArticles.length).padStart(2, "0")}<small>içerik</small></span></div>
      </section>
      <section className="section page-shell">
        <div className="section-heading section-heading--rule"><div><p className="eyebrow">Güncel akış</p><h2>{category.shortName} gündemi</h2></div></div>
        <div className="article-grid article-grid--three">
          {categoryArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </section>
      <section className="category-network page-shell">
        <div><p className="eyebrow">Bu kategoride</p><h2>Yayınlar</h2>{categoryPublications.map((publication) => <div key={publication.slug}><PublicationMark publication={publication} /><span>{publication.description}</span></div>)}</div>
        <div><p className="eyebrow">Doğrudan gelen kutuna</p><h2>Bültenler</h2>{categoryNewsletters.map((newsletter) => <NewsletterCard key={newsletter.slug} newsletter={newsletter} />)}{!categoryNewsletters.length && <p>Bu kategorinin yeni bültenleri yakında.</p>}<Link className="inline-arrow-link" href="/bultenler">Tüm bültenleri gör <ArrowUpRight size={15} /></Link></div>
      </section>
    </>
  );
}
