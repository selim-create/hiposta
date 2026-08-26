import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowRight, Clock3, FileText, UsersRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { NewsletterCard } from "@/components/newsletter-card";
import { PublicationMark } from "@/components/publication-mark";
import { SubscribeForm } from "@/components/subscribe-form";
import { getNewsletter, getPublication, getPublicationArticles } from "@/lib/data";
import { newsletters } from "@/lib/mock-data";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return newsletters.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const newsletter = getNewsletter((await params).slug);
  return newsletter ? { title: newsletter.name, description: newsletter.longDescription } : {};
}

export default async function NewsletterPage({ params }: Props) {
  const newsletter = getNewsletter((await params).slug);
  if (!newsletter) notFound();
  const publication = getPublication(newsletter.publicationSlug)!;
  const recentArticles = getPublicationArticles(publication.slug).slice(0, 3);
  const crossSell = newsletters.filter((item) => item.slug !== newsletter.slug && item.categorySlug !== newsletter.categorySlug).slice(0, 3);
  const style = { "--newsletter-hero": newsletter.accent, "--newsletter-ink": publication.foreground } as CSSProperties;

  return (
    <>
      <section className="newsletter-detail-hero" style={style}>
        <div className="page-shell newsletter-detail-hero__inner">
          <div className="breadcrumb"><Link href="/bultenler">Bültenler</Link><span>/</span><Link href={`/yayinlar/${publication.slug}`}>{publication.name}</Link></div>
          <div className="newsletter-detail-hero__grid">
            <div>
              <PublicationMark publication={publication} linked={false} />
              <p className="eyebrow">{newsletter.format}</p>
              <h1>{newsletter.name}</h1>
              <p className="newsletter-detail-hero__dek">{newsletter.longDescription}</p>
            </div>
            <aside>
              <div className="newsletter-specs"><div><Clock3 size={17} /><span><small>Gönderim</small>{newsletter.schedule} · {newsletter.deliveryTime}</span></div><div><FileText size={17} /><span><small>Format</small>{newsletter.format}</span></div><div><UsersRound size={17} /><span><small>Topluluk</small>{newsletter.audience}</span></div></div>
              <SubscribeForm newsletterName={newsletter.name} newsletterSlugs={[newsletter.slug]} />
            </aside>
          </div>
        </div>
      </section>

      <section className="newsletter-anatomy page-shell">
        <div><p className="eyebrow">Her sayıda</p><h2>Ne okuyacaksın?</h2><p>{newsletter.description}</p></div>
        <ol>{newsletter.topics.map((topic, index) => <li key={topic}><span>0{index + 1}</span><strong>{topic}</strong><p>Editörün seçtiği veri, bağlam ve uygulanabilir kısa notlarla.</p></li>)}</ol>
      </section>

      {recentArticles.length > 0 && (
        <section className="section page-shell">
          <div className="section-heading section-heading--rule"><div><p className="eyebrow">Son sayılardan</p><h2>{publication.name} okuma listesi</h2></div></div>
          <div className="article-grid article-grid--three">{recentArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
        </section>
      )}

      <section className="cross-sell-section">
        <div className="page-shell"><div className="section-heading section-heading--rule"><div><p className="eyebrow">İlgini çekebilir</p><h2>Akışına bir konu daha ekle</h2></div><Link href="/bultenler">Tümünü gör <ArrowRight size={15} /></Link></div><div className="newsletter-grid">{crossSell.map((item) => <NewsletterCard key={item.slug} newsletter={item} />)}</div></div>
      </section>
    </>
  );
}
