import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Check, Clock3, Crown, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { ArticleReadingProgress } from "@/components/article-reading-progress";
import { ArticleShareActions } from "@/components/article-share-actions";
import { JsonLd } from "@/components/json-ld";
import { PublicationMark } from "@/components/publication-mark";
import { SubscribeForm } from "@/components/subscribe-form";
import { getCatalog } from "@/lib/catalog";
import { getContent, getContentArticle, getContentArticleForSession } from "@/lib/content";
import { absoluteUrl, publicMetadata } from "@/lib/seo";
import type { Article } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = true;

export async function generateStaticParams() {
  const { articles } = await getContent({ limit: 50 });
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getContentArticle((await params).slug);
  if (!article) return {};
  return publicMetadata({
    title: article.title,
    description: article.dek,
    path: `/icerik/${article.slug}`,
    image: article.heroImage,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt || article.publishedAt,
    authors: article.author ? [article.author] : undefined,
  });
}

function formatEditorialDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

function relatedScore(candidate: Article, current: Article) {
  let score = 0;
  if (candidate.categorySlug === current.categorySlug) score += 6;
  const currentTags = new Set(current.tags.map((tag) => tag.toLocaleLowerCase("tr-TR")));
  for (const tag of candidate.tags) if (currentTags.has(tag.toLocaleLowerCase("tr-TR"))) score += 2;
  if (candidate.premium === current.premium) score += 1;
  return score;
}

export default async function ArticlePage({ params }: Props) {
  const slug = (await params).slug;
  const [article, catalog] = await Promise.all([getContentArticleForSession(slug), getCatalog()]);
  if (!article) notFound();

  const publication = catalog.publications.find((item) => item.slug === article.publicationSlug);
  const category = catalog.categories.find((item) => item.slug === article.categorySlug);
  const newsletter = catalog.newsletters.find((item) => item.slug === article.relatedNewsletterSlug);
  if (!publication) notFound();

  const { articles: publicationPool } = await getContent({ publication: article.publicationSlug, limit: 50 });
  const orderedPool = [...publicationPool].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const currentIndex = orderedPool.findIndex((item) => item.slug === article.slug);
  const newer = currentIndex > 0 ? orderedPool[currentIndex - 1] : null;
  const older = currentIndex >= 0 && currentIndex < orderedPool.length - 1 ? orderedPool[currentIndex + 1] : null;
  const related = publicationPool
    .filter((item) => item.slug !== article.slug)
    .map((item) => ({ item, score: relatedScore(item, article) }))
    .sort((a, b) => b.score - a.score || new Date(b.item.publishedAt).getTime() - new Date(a.item.publishedAt).getTime())
    .slice(0, 3)
    .map(({ item }) => item);

  const categoryLabel = category?.shortName || article.categoryShortName || article.categoryName || "Gündem";
  const categorySlug = category?.slug || article.categorySlug;
  const locked = article.premium && article.locked !== false;
  const articleClass = ["article-page", article.premium ? "article-page--premium" : "", article.premium && !locked ? "article-page--premium-unlocked" : ""].filter(Boolean).join(" ");
  const canonical = absoluteUrl(`/icerik/${article.slug}`);
  const publicDescription = article.dek || "Hiposta içeriği";
  const modifiedLabel = article.updatedAt && article.updatedAt !== article.publishedAt ? formatEditorialDate(article.updatedAt) : "";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: publicDescription,
    image: article.heroImage ? [article.heroImage] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: article.author ? { "@type": "Person", name: article.author } : undefined,
    publisher: { "@type": "Organization", name: "Hiposta", url: absoluteUrl("/"), logo: { "@type": "ImageObject", url: absoluteUrl("/hiposta-logo.svg") } },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    articleSection: categoryLabel,
    keywords: article.tags.length ? article.tags.join(", ") : undefined,
    isAccessibleForFree: !article.premium,
    inLanguage: "tr-TR",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: categoryLabel, item: absoluteUrl(`/kategori/${categorySlug}`) },
      { "@type": "ListItem", position: 3, name: article.title, item: canonical },
    ],
  };

  return (
    <article className={articleClass} style={{ "--article-accent": publication.color } as CSSProperties}>
      <ArticleReadingProgress />
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <header className="article-header page-shell">
        <div className="breadcrumb"><Link href="/">Gündem</Link><span>/</span><Link href={`/kategori/${categorySlug}`}>{categoryLabel}</Link></div>
        <div className="article-header__grid">
          <div>
            <div className="story-kicker"><PublicationMark publication={publication} size="small" /><span>{categoryLabel}</span>{article.premium && <span className="premium-pill"><LockKeyhole size={10} /> Premium</span>}</div>
            <h1>{article.title}</h1>
            <p>{article.dek}</p>
            <div className="article-byline">
              <span><strong>{article.author}</strong><small>Hiposta yazarı</small></span>
              <span>Yayınlandı · {article.displayDate}</span>
              {modifiedLabel && <span>Güncellendi · {modifiedLabel}</span>}
              <span><Clock3 size={13} /> {article.readTime} okuma</span>
            </div>
            <ArticleShareActions url={canonical} title={article.title} description={publicDescription} mode="inline" />
          </div>
          {newsletter && <aside><p className="eyebrow">Bu içerikle birlikte</p><h2>{newsletter.name}</h2><p>{newsletter.description}</p><Link href={`/bultenler/${newsletter.slug}`}>Bülteni incele <ArrowRight size={15} /></Link></aside>}
        </div>
      </header>

      <figure className="article-hero-image page-shell"><div><Image src={article.heroImage} alt={article.heroAlt} fill priority sizes="(max-width: 1280px) 100vw, 1240px" /></div>{article.photoCredit && <figcaption>{article.photoCredit}</figcaption>}</figure>

      <div className="article-content page-shell">
        <div className="article-content__rail"><ArticleShareActions url={canonical} title={article.title} description={publicDescription} /></div>
        <div className="article-body">
          {article.teaserHtml && <div className="article-body__lead" dangerouslySetInnerHTML={{ __html: article.teaserHtml }} />}

          {locked ? (
            <section className="paywall">
              <div className="paywall__icon"><Crown size={28} /></div>
              <p className="eyebrow">İçeriğin devamı Premium’da</p>
              <h2>Yüzeyde kalma.<br />Hikâyenin tamamını oku.</h2>
              <p>Bu dosyanın kalan bölümleriyle birlikte {catalog.stats.publications} yayının premium analizlerine eriş.</p>
              <ul><li><Check size={15} /> Tüm premium içerikler</li><li><Check size={15} /> Hiposta Haftalık Dergi</li><li><Check size={15} /> Reklamsız okuma deneyimi</li></ul>
              <div><Link className="button button--yellow" href="/kayit-ol?plan=premium">Premium’a geç <ArrowRight size={16} /></Link><Link href="/giris">Zaten üye misin? Giriş yap</Link></div>
              <small>Premium ödeme akışı henüz aktif değil.</small>
            </section>
          ) : article.bodyHtml ? (
            <div className="article-body__html" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
          ) : null}

          {!locked && article.tags.length > 0 && <div className="article-tags" aria-label="İçerik etiketleri">{article.tags.map((tag) => <Link key={tag} href={`/arama?q=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>}
        </div>
        {newsletter && <aside className="article-newsletter-aside">
          <PublicationMark publication={publication} size="small" linked={false} />
          <p className="eyebrow">Bu yayını takip et</p>
          <h2>{newsletter.name}</h2>
          <p>{newsletter.schedule} · {newsletter.deliveryTime}</p>
          <SubscribeForm newsletterName={newsletter.name} newsletterSlugs={[newsletter.slug]} compact />
        </aside>}
      </div>

      {(newer || older) && <nav className="article-neighbor-nav page-shell" aria-label="İçerikler arasında gezin">
        {newer ? <Link href={`/icerik/${newer.slug}`} className="article-neighbor article-neighbor--newer">
          <span><ArrowLeft size={14} /> Daha yeni</span>
          <strong>{newer.title}</strong>
          <small>{newer.publicationName || publication.name}</small>
        </Link> : <span />}
        {older ? <Link href={`/icerik/${older.slug}`} className="article-neighbor article-neighbor--older">
          <span>Daha eski <ArrowRight size={14} /></span>
          <strong>{older.title}</strong>
          <small>{older.publicationName || publication.name}</small>
        </Link> : <span />}
      </nav>}

      {related.length > 0 && <section className="related-section page-shell">
        <div className="section-heading section-heading--rule"><div><p className="eyebrow">Okumaya devam et</p><h2>Benzer içerikler</h2></div></div>
        <div className="article-grid article-grid--three">{related.map((item) => <ArticleCard key={item.slug} article={item} />)}</div>
      </section>}
    </article>
  );
}
