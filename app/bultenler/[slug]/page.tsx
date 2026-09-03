import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Clock3, FileText, UsersRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { NewsletterCard } from "@/components/newsletter-card";
import { NewsletterSubscribeAction } from "@/components/newsletter-subscribe-action";
import { PublicationMark } from "@/components/publication-mark";
import { ShareActions } from "@/components/share-actions";
import { getCatalog } from "@/lib/catalog";
import { getContent } from "@/lib/content";
import { getNewsletterIssues } from "@/lib/issues";
import { absoluteUrl, publicMetadata } from "@/lib/seo";
import { socialCardUrl } from "@/lib/social";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = true;
export async function generateStaticParams() { return (await getCatalog()).newsletters.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const catalog = await getCatalog();
  const newsletter = catalog.newsletters.find((item) => item.slug === slug);
  if (!newsletter) return {};
  const publication = catalog.publications.find((item) => item.slug === newsletter.publicationSlug);
  if (!publication || publication.status !== "active" || publication.isComingSoon) return { title: newsletter.name, description: newsletter.longDescription, robots: { index: false, follow: true } };
  return publicMetadata({
    title: newsletter.name,
    description: newsletter.longDescription,
    path: `/bultenler/${newsletter.slug}`,
    image: socialCardUrl({ kind: "Bülten", eyebrow: publication.name, title: newsletter.name, description: newsletter.description || newsletter.longDescription, accent: newsletter.accent }),
  });
}

export default async function NewsletterPage({ params }: Props) {
  const slug = (await params).slug;
  const [catalog, content, issues] = await Promise.all([getCatalog(), getContent({ newsletter: slug, limit: 12 }), getNewsletterIssues(slug)]);
  const newsletter = catalog.newsletters.find((item) => item.slug === slug);
  if (!newsletter) notFound();
  const publication = catalog.publications.find((item) => item.slug === newsletter.publicationSlug);
  if (!publication) notFound();

  const recentArticles = content.articles.slice(0, 3);
  const crossSell = catalog.newsletters.filter((item) => item.slug !== newsletter.slug && item.categorySlug !== newsletter.categorySlug).slice(0, 3);
  const style = { "--newsletter-hero": newsletter.accent, "--newsletter-ink": publication.foreground } as CSSProperties;
  const canonical = absoluteUrl(`/bultenler/${newsletter.slug}`);
  const indexable = publication.status === "active" && !publication.isComingSoon;
  const collectionSchema = indexable ? {
    "@context": "https://schema.org", "@type": "CollectionPage", name: newsletter.name, description: newsletter.longDescription,
    url: canonical, inLanguage: "tr-TR", isPartOf: { "@type": "WebSite", name: "Hiposta", url: absoluteUrl("/") },
    about: { "@type": "Organization", name: publication.name },
  } : null;

  return (
    <>
      {collectionSchema && <JsonLd data={collectionSchema} />}
      <section className="newsletter-detail-hero" style={style}>
        <div className="page-shell newsletter-detail-hero__inner">
          <div className="breadcrumb"><Link href="/bultenler">Bültenler</Link><span>/</span><Link href={`/yayinlar/${publication.slug}`}>{publication.name}</Link></div>
          <div className="newsletter-detail-hero__grid">
            <div>
              <PublicationMark publication={publication} linked={false} />
              <p className="eyebrow">{newsletter.format}</p>
              <h1>{newsletter.name}</h1>
              <p className="newsletter-detail-hero__dek">{newsletter.longDescription}</p>
              <ShareActions url={canonical} title={newsletter.name} description={newsletter.description} source="newsletter" mode="surface" label="Bu bülteni paylaş" />
            </div>
            <aside>
              <div className="newsletter-specs">
                <div><Clock3 size={17} /><span><small>Gönderim</small>{newsletter.schedule}{newsletter.deliveryTime ? ` · ${newsletter.deliveryTime}` : ""}</span></div>
                <div><FileText size={17} /><span><small>Format</small>{newsletter.format}</span></div>
                <div><UsersRound size={17} /><span><small>Topluluk</small>{newsletter.audience}</span></div>
              </div>
              <NewsletterSubscribeAction newsletterName={newsletter.name} newsletterSlug={newsletter.slug} source="newsletter_detail" />
            </aside>
          </div>
        </div>
      </section>

      <section className="newsletter-anatomy page-shell">
        <div><p className="eyebrow">Her sayıda</p><h2>Ne okuyacaksın?</h2><p>{newsletter.description}</p></div>
        <ol>{newsletter.topics.map((topic, index) => <li key={topic}><span>0{index + 1}</span><strong>{topic}</strong><p>Editörün seçtiği veri, bağlam ve uygulanabilir kısa notlarla.</p></li>)}</ol>
      </section>

      {issues.length > 0 && (
        <section className="issue-archive page-shell">
          <div className="section-heading section-heading--rule"><div><p className="eyebrow">Web arşivi</p><h2>Geçmiş sayılar</h2></div><span>{issues.length} sayı</span></div>
          <div className="issue-archive__grid">
            {issues.map((issue, index) => (
              <Link className="issue-card" href={`/sayi/${issue.slug}`} key={issue.slug}>
                <div className="issue-card__index">{String(index + 1).padStart(2, "0")}</div>
                <div className="issue-card__meta"><span>{issue.displayDate}</span><span>{newsletter.name}</span></div>
                <h3>{issue.title}</h3>
                {issue.preheader && <p>{issue.preheader}</p>}
                <span className="issue-card__link">Sayıyı oku <ArrowUpRight size={15} /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recentArticles.length > 0 && <section className="section page-shell"><div className="section-heading section-heading--rule"><div><p className="eyebrow">Son içerikler</p><h2>{publication.name} okuma listesi</h2></div></div><div className="article-grid article-grid--three">{recentArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></section>}

      <section className="cross-sell-section"><div className="page-shell"><div className="section-heading section-heading--rule"><div><p className="eyebrow">İlgini çekebilir</p><h2>Akışına bir konu daha ekle</h2></div><Link href="/bultenler">Tümünü gör <ArrowRight size={15} /></Link></div><div className="newsletter-grid">{crossSell.map((item) => <NewsletterCard key={item.slug} newsletter={item} publication={catalog.publications.find((candidate) => candidate.slug === item.publicationSlug)} showSubscriptionAction source="newsletter_cross_sell" />)}</div></div></section>
    </>
  );
}
