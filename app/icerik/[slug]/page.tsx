import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Check, Clock3, Crown, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleNewsletterCta } from "@/components/article-newsletter-cta";
import { ArticleReadingProgress } from "@/components/article-reading-progress";
import { ArticleSaveAction } from "@/components/article-save-action";
import { ArticleShareActions } from "@/components/article-share-actions";
import { EditorialNetworkBlock } from "@/components/editorial-network-block";
import { JsonLd } from "@/components/json-ld";
import { PublicationMark } from "@/components/publication-mark";
import { SponsorshipBlock } from "@/components/sponsorship-block";
import { getAuthSession } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { getContent, getContentArticle, getContentArticleForSession } from "@/lib/content";
import { buildEditorialNetwork } from "@/lib/editorial-network";
import { absoluteUrl, publicMetadata } from "@/lib/seo";
import { sponsorshipsFor } from "@/lib/sponsorship";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getContentArticle((await params).slug);
  if (!article) return {};
  return publicMetadata({ title: article.title, description: article.dek, path: `/icerik/${article.slug}`, image: article.heroImage, type: "article", publishedTime: article.publishedAt, modifiedTime: article.updatedAt || article.publishedAt, authors: article.author ? [article.author] : undefined });
}

function formatEditorialDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" }).format(date);
}

export default async function ArticlePage({ params }: Props) {
  const slug = (await params).slug;
  const [article, catalog, session] = await Promise.all([getContentArticleForSession(slug), getCatalog(), getAuthSession()]);
  if (!article) notFound();

  const publication = catalog.publications.find((item) => item.slug === article.publicationSlug);
  const category = catalog.categories.find((item) => item.slug === article.categorySlug);
  const newsletter = catalog.newsletters.find((item) => item.slug === article.relatedNewsletterSlug);
  if (!publication) notFound();

  const [{ articles: publicationPool }, { articles: discoveryPool }] = await Promise.all([getContent({ publication: article.publicationSlug, limit: 50 }), getContent({ limit: 50 })]);
  const orderedPool = [...publicationPool].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const currentIndex = orderedPool.findIndex((item) => item.slug === article.slug);
  const newer = currentIndex > 0 ? orderedPool[currentIndex - 1] : null;
  const older = currentIndex >= 0 && currentIndex < orderedPool.length - 1 ? orderedPool[currentIndex + 1] : null;
  const editorialNetwork = buildEditorialNetwork({ current: article, articles: discoveryPool, publications: catalog.publications, newsletters: catalog.newsletters });
  const inlineSponsorships = sponsorshipsFor(article.sponsorships, "article_inline");
  const endSponsorships = sponsorshipsFor(article.sponsorships, "article_end");

  const categoryLabel = category?.shortName || article.categoryShortName || article.categoryName || "Gündem";
  const categorySlug = category?.slug || article.categorySlug;
  const locked = article.premium && article.locked !== false;
  const articleClass = ["article-page", article.premium ? "article-page--premium" : "", article.premium && !locked ? "article-page--premium-unlocked" : ""].filter(Boolean).join(" ");
  const canonical = absoluteUrl(`/icerik/${article.slug}`);
  const publicDescription = article.dek || "Hiposta içeriği";
  const modifiedLabel = article.updatedAt && article.updatedAt !== article.publishedAt ? formatEditorialDate(article.updatedAt) : "";
  const newsletterSubscribed = Boolean(newsletter && session?.subscriptions.some((item) => item.newsletter_slug === newsletter.slug && item.status === "active"));
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: publicDescription, image: article.heroImage ? [article.heroImage] : undefined, datePublished: article.publishedAt, dateModified: article.updatedAt || article.publishedAt, author: article.author ? { "@type": "Person", name: article.author } : undefined, publisher: { "@type": "Organization", name: "Hiposta", url: absoluteUrl("/"), logo: { "@type": "ImageObject", url: absoluteUrl("/hiposta-logo.svg") } }, mainEntityOfPage: { "@type": "WebPage", "@id": canonical }, articleSection: categoryLabel, keywords: article.tags.length ? article.tags.join(", ") : undefined, isAccessibleForFree: !article.premium, inLanguage: "tr-TR" };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Ana Sayfa", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: categoryLabel, item: absoluteUrl(`/kategori/${categorySlug}`) }, { "@type": "ListItem", position: 3, name: article.title, item: canonical }] };

  return (
    <article className={articleClass} style={{ "--article-accent": publication.color } as CSSProperties}>
      <ArticleReadingProgress />
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <header className="article-header page-shell">
        <div className="breadcrumb"><Link href="/">Gündem</Link><span>/</span><Link href={`/kategori/${categorySlug}`}>{categoryLabel}</Link></div>
        <div className="article-header__grid"><div><div className="story-kicker"><PublicationMark publication={publication} size="small" /><span>{categoryLabel}</span>{article.premium && <span className="premium-pill"><LockKeyhole size={10} /> Premium</span>}</div><h1>{article.title}</h1><p>{article.dek}</p><div className="article-byline"><span><strong>{article.author}</strong><small>Hiposta yazarı</small></span><span>Yayınlandı · {article.displayDate}</span>{modifiedLabel && <span>Güncellendi · {modifiedLabel}</span>}<span><Clock3 size={13} /> {article.readTime} okuma</span></div><div className="article-header-actions"><ArticleShareActions url={canonical} title={article.title} description={publicDescription} mode="inline" />{article.id ? <ArticleSaveAction contentId={article.id} returnPath={`/icerik/${article.slug}`} /> : null}</div></div>{newsletter && <aside><p className="eyebrow">Bu içerikle birlikte</p><h2>{newsletter.name}</h2><p>{newsletter.description}</p><Link href={`/bultenler/${newsletter.slug}`}>Bülteni incele <ArrowRight size={15} /></Link></aside>}</div>
      </header>

      <figure className="article-hero-image page-shell"><div><Image src={article.heroImage} alt={article.heroAlt} fill priority sizes="(max-width: 1280px) 100vw, 1240px" /></div>{article.photoCredit && <figcaption>{article.photoCredit}</figcaption>}</figure>

      <div className="article-content page-shell">
        <div className="article-content__rail"><ArticleShareActions url={canonical} title={article.title} description={publicDescription} /></div>
        <div className="article-body">
          {article.teaserHtml && <div className="article-body__lead" dangerouslySetInnerHTML={{ __html: article.teaserHtml }} />}
          {inlineSponsorships.map((item) => <SponsorshipBlock key={item.id} sponsorship={item} />)}
          {locked ? <section className="paywall"><div className="paywall__icon"><Crown size={28} /></div><p className="eyebrow">İçeriğin devamı Premium’da</p><h2>Premium deneyimi<br />hazırlanıyor.</h2><p>Bu dosyanın devamı Hiposta Premium üyelerine açılacak. Ödeme ve satın alma akışı henüz aktif değil.</p><ul><li><Check size={15} /> Premium özel dosyalar</li><li><Check size={15} /> Hiposta Haftalık Dergi</li><li><Check size={15} /> Tek hesapta kişisel okuma alanı</li></ul><div><Link className="button button--yellow" href="/premium">Premium’u keşfet <ArrowRight size={16} /></Link><Link href="/giris">Zaten hesabın var mı? Giriş yap</Link></div><small>Şu anda bu sayfadan ücret veya ödeme alınmıyor.</small></section> : article.bodyHtml ? <div className="article-body__html" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} /> : null}
          {!locked && article.tags.length > 0 && <div className="article-tags" aria-label="İçerik etiketleri">{article.tags.map((tag) => <Link key={tag} href={`/arama?q=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>}
          {endSponsorships.map((item) => <SponsorshipBlock key={item.id} sponsorship={item} />)}
        </div>
        {newsletter && <aside className="article-newsletter-aside"><PublicationMark publication={publication} size="small" linked={false} /><p className="eyebrow">Bu yayını takip et</p><h2>{newsletter.name}</h2><p>{newsletter.schedule} · {newsletter.deliveryTime}</p><ArticleNewsletterCta newsletterName={newsletter.name} newsletterSlug={newsletter.slug} authenticated={Boolean(session)} verified={Boolean(session?.account.email_verified)} subscribed={newsletterSubscribed} compact /></aside>}
      </div>

      {newsletter && <section className="article-newsletter-end page-shell" aria-label={`${newsletter.name} bültenine abone ol`}><div className="article-newsletter-end__copy"><PublicationMark publication={publication} size="small" linked={false} /><div><p className="eyebrow">Okumaya buradan devam et</p><h2>{newsletter.name} bültenine katıl</h2><p>{newsletter.description}</p></div></div><div className="article-newsletter-end__form"><span>{newsletter.schedule} · {newsletter.deliveryTime}</span><ArticleNewsletterCta newsletterName={newsletter.name} newsletterSlug={newsletter.slug} authenticated={Boolean(session)} verified={Boolean(session?.account.email_verified)} subscribed={newsletterSubscribed} compact /></div></section>}

      {(newer || older) && <nav className="article-neighbor-nav page-shell" aria-label="İçerikler arasında gezin">{newer ? <Link href={`/icerik/${newer.slug}`} className="article-neighbor article-neighbor--newer"><span><ArrowLeft size={14} /> Daha yeni</span><strong>{newer.title}</strong><small>{newer.publicationName || publication.name}</small></Link> : <span />}{older ? <Link href={`/icerik/${older.slug}`} className="article-neighbor article-neighbor--older"><span>Daha eski <ArrowRight size={14} /></span><strong>{older.title}</strong><small>{older.publicationName || publication.name}</small></Link> : <span />}</nav>}

      <EditorialNetworkBlock network={editorialNetwork} publications={catalog.publications} />
    </article>
  );
}
