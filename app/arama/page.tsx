import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { NewsletterCard } from "@/components/newsletter-card";
import { PublicationMark } from "@/components/publication-mark";
import { getCatalog } from "@/lib/catalog";
import { searchContent } from "@/lib/content";

export const metadata: Metadata = { title: "Ara", description: "Hiposta içerik, yayın ve bültenlerinde ara." };
type Props = { searchParams: Promise<{ q?: string }> };
const normalize = (value: string) => value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default async function SearchPage({ searchParams }: Props) {
  const query = (await searchParams).q?.trim() ?? "";
  const catalog = await getCatalog();
  const needle = normalize(query);
  const articles = query.length >= 2 ? await searchContent(query) : [];
  const publications = query.length >= 2 ? catalog.publications.filter((item) => normalize(`${item.name} ${item.description}`).includes(needle)) : [];
  const newsletters = query.length >= 2 ? catalog.newsletters.filter((item) => normalize(`${item.name} ${item.description} ${item.topics.join(" ")}`).includes(needle)) : [];
  const total = articles.length + publications.length + newsletters.length;

  return (
    <section className="search-page page-shell">
      <p className="eyebrow">Hiposta arama</p><h1>Ne okumak<br />istiyorsun?</h1>
      <form className="search-form" action="/arama"><Search size={22} /><input type="search" name="q" defaultValue={query} placeholder="İçerik, konu, yayın veya bülten ara" autoFocus /><button type="submit">Ara <ArrowRight size={16} /></button></form>
      {!query && <div className="search-suggestions"><p>Popüler aramalar</p>{["Faiz", "Transfer", "Haftalık menü", "Uyku", "Ev trendleri"].map((term) => <Link key={term} href={`/arama?q=${encodeURIComponent(term)}`}>{term}</Link>)}</div>}
      {query && <div className="search-result-count"><strong>“{query}”</strong><span>{total} sonuç bulundu</span></div>}
      {query && total === 0 && <div className="empty-state"><span>0</span><h2>Bu aramaya uygun sonuç bulamadık.</h2><p>Daha kısa veya genel bir ifade deneyebilirsin.</p></div>}
      {articles.length > 0 && <section className="search-result-section"><div className="section-heading section-heading--small section-heading--rule"><div><p className="eyebrow">{articles.length} sonuç</p><h2>İçerikler</h2></div></div><div className="article-grid article-grid--three">{articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></section>}
      {publications.length > 0 && <section className="search-result-section"><div className="section-heading section-heading--small section-heading--rule"><div><p className="eyebrow">{publications.length} sonuç</p><h2>Yayınlar</h2></div></div><div className="search-publications">{publications.map((publication) => <article key={publication.slug}><PublicationMark publication={publication} /><p>{publication.description}</p><Link href={`/yayinlar/${publication.slug}`}>Yayına git <ArrowRight size={15} /></Link></article>)}</div></section>}
      {newsletters.length > 0 && <section className="search-result-section"><div className="section-heading section-heading--small section-heading--rule"><div><p className="eyebrow">{newsletters.length} sonuç</p><h2>Bültenler</h2></div></div><div className="newsletter-grid">{newsletters.map((newsletter) => <NewsletterCard key={newsletter.slug} newsletter={newsletter} publication={catalog.publications.find((item) => item.slug === newsletter.publicationSlug)} />)}</div></section>}
    </section>
  );
}
