import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowRight, Check, Clock3, Crown, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { PublicationMark } from "@/components/publication-mark";
import { SubscribeForm } from "@/components/subscribe-form";
import { getCatalog } from "@/lib/catalog";
import { getContent, getContentArticle, getContentArticleForSession } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = true;

export async function generateStaticParams() {
  const { articles } = await getContent({ limit: 50 });
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getContentArticle((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.dek,
    openGraph: { type: "article", title: article.title, description: article.dek, publishedTime: article.publishedAt, images: [{ url: article.heroImage, alt: article.heroAlt }] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const slug = (await params).slug;
  const [article, catalog] = await Promise.all([getContentArticleForSession(slug), getCatalog()]);
  if (!article) notFound();

  const publication = catalog.publications.find((item) => item.slug === article.publicationSlug);
  const category = catalog.categories.find((item) => item.slug === article.categorySlug);
  const newsletter = catalog.newsletters.find((item) => item.slug === article.relatedNewsletterSlug);
  if (!publication) notFound();

  const { articles: relatedPool } = await getContent({ publication: article.publicationSlug, limit: 8 });
  const related = relatedPool.filter((item) => item.slug !== article.slug).slice(0, 3);
  const categoryLabel = category?.shortName || article.categoryShortName || article.categoryName || "Gündem";
  const categorySlug = category?.slug || article.categorySlug;
  const locked = article.premium && article.locked !== false;

  return (
    <article className="article-page" style={{ "--article-accent": publication.color } as CSSProperties}>
      <header className="article-header page-shell">
        <div className="breadcrumb"><Link href="/">Gündem</Link><span>/</span><Link href={`/kategori/${categorySlug}`}>{categoryLabel}</Link></div>
        <div className="article-header__grid">
          <div>
            <div className="story-kicker"><PublicationMark publication={publication} size="small" /><span>{categoryLabel}</span>{article.premium && <span className="premium-pill"><LockKeyhole size={10} /> Premium</span>}</div>
            <h1>{article.title}</h1>
            <p>{article.dek}</p>
            <div className="article-byline"><span><strong>{article.author}</strong><small>Hiposta yazarı</small></span><span>{article.displayDate}</span><span><Clock3 size={13} /> {article.readTime} okuma</span></div>
          </div>
          {newsletter && <aside><p className="eyebrow">Bu içerikle birlikte</p><h2>{newsletter.name}</h2><p>{newsletter.description}</p><Link href={`/bultenler/${newsletter.slug}`}>Bülteni incele <ArrowRight size={15} /></Link></aside>}
        </div>
      </header>

      <figure className="article-hero-image page-shell"><div><Image src={article.heroImage} alt={article.heroAlt} fill priority sizes="(max-width: 1280px) 100vw, 1240px" /></div>{article.photoCredit && <figcaption>{article.photoCredit}</figcaption>}</figure>

      <div className="article-content page-shell">
        <div className="article-content__rail"><span>PAYLAŞ</span><button type="button" aria-label="X üzerinde paylaş">X</button><button type="button" aria-label="LinkedIn üzerinde paylaş">in</button><button type="button" aria-label="Bağlantıyı kopyala">↗</button></div>
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

          {!locked && article.tags.length > 0 && <div className="article-tags">{article.tags.map((tag) => <Link key={tag} href={`/arama?q=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>}
        </div>
        {newsletter && <aside className="article-newsletter-aside">
          <PublicationMark publication={publication} size="small" linked={false} />
          <p className="eyebrow">Bu yayını takip et</p>
          <h2>{newsletter.name}</h2>
          <p>{newsletter.schedule} · {newsletter.deliveryTime}</p>
          <SubscribeForm newsletterName={newsletter.name} newsletterSlugs={[newsletter.slug]} compact />
        </aside>}
      </div>

      {related.length > 0 && <section className="related-section page-shell">
        <div className="section-heading section-heading--rule"><div><p className="eyebrow">Okumaya devam et</p><h2>Benzer içerikler</h2></div></div>
        <div className="article-grid article-grid--three">{related.map((item) => <ArticleCard key={item.slug} article={item} />)}</div>
      </section>}
    </article>
  );
}
