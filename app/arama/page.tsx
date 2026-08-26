import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { NewsletterCard } from "@/components/newsletter-card";
import { PublicationMark } from "@/components/publication-mark";
import { searchAll } from "@/lib/data";

export const metadata: Metadata = { title: "Ara", description: "Hiposta içerik, yayın ve bültenlerinde ara." };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const query = (await searchParams).q?.trim() ?? "";
  const results = searchAll(query);
  const total = results.articles.length + results.publications.length + results.newsletters.length;

  return (
    <section className="search-page page-shell">
      <p className="eyebrow">Hiposta arama</p>
      <h1>Ne okumak<br />istiyorsun?</h1>
      <form className="search-form" action="/arama"><Search size={22} /><input type="search" name="q" defaultValue={query} placeholder="İçerik, konu, yayın veya bülten ara" autoFocus /><button type="submit">Ara <ArrowRight size={16} /></button></form>
      {!query && <div className="search-suggestions"><p>Popüler aramalar</p>{["Faiz", "Transfer", "Haftalık menü", "Uyku", "Ev trendleri"].map((term) => <Link key={term} href={`/arama?q=${encodeURIComponent(term)}`}>{term}</Link>)}</div>}
      {query && <div className="search-result-count"><strong>“{query}”</strong><span>{total} sonuç bulundu</span></div>}
      {query && total === 0 && <div className="empty-state"><span>0</span><h2>Bu aramaya uygun sonuç bulamadık.</h2><p>Daha kısa veya genel bir ifade deneyebilirsin.</p></div>}
      {results.articles.length > 0 && <section className="search-result-section"><div className="section-heading section-heading--small section-heading--rule"><div><p className="eyebrow">{results.articles.length} sonuç</p><h2>İçerikler</h2></div></div><div className="article-grid article-grid--three">{results.articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></section>}
      {results.publications.length > 0 && <section className="search-result-section"><div className="section-heading section-heading--small section-heading--rule"><div><p className="eyebrow">{results.publications.length} sonuç</p><h2>Yayınlar</h2></div></div><div className="search-publications">{results.publications.map((publication) => <article key={publication.slug}><PublicationMark publication={publication} /><p>{publication.description}</p><Link href={`/yayinlar/${publication.slug}`}>Yayına git <ArrowRight size={15} /></Link></article>)}</div></section>}
      {results.newsletters.length > 0 && <section className="search-result-section"><div className="section-heading section-heading--small section-heading--rule"><div><p className="eyebrow">{results.newsletters.length} sonuç</p><h2>Bültenler</h2></div></div><div className="newsletter-grid">{results.newsletters.map((newsletter) => <NewsletterCard key={newsletter.slug} newsletter={newsletter} />)}</div></section>}
    </section>
  );
}
