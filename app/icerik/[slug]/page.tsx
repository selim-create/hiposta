import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowRight, Check, Clock3, Crown, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { PublicationMark } from "@/components/publication-mark";
import { SubscribeForm } from "@/components/subscribe-form";
import { getArticle, getCategory, getNewsletter, getPublication } from "@/lib/data";
import { articles } from "@/lib/mock-data";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  return article ? { title: article.title, description: article.dek, openGraph: { type: "article", title: article.title, description: article.dek, publishedTime: article.publishedAt, images: [{ url: article.heroImage, alt: article.heroAlt }] } } : {};
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const publication = getPublication(article.publicationSlug)!;
  const category = getCategory(article.categorySlug)!;
  const newsletter = getNewsletter(article.relatedNewsletterSlug)!;
  const related = articles.filter((item) => item.slug !== article.slug && (item.categorySlug === article.categorySlug || item.publicationSlug === article.publicationSlug)).slice(0, 3);

  return (
    <article className="article-page" style={{ "--article-accent": publication.color } as CSSProperties}>
      <header className="article-header page-shell">
        <div className="breadcrumb"><Link href="/">Gündem</Link><span>/</span><Link href={`/kategori/${category.slug}`}>{category.shortName}</Link></div>
        <div className="article-header__grid">
          <div>
            <div className="story-kicker"><PublicationMark publication={publication} size="small" /><span>{category.shortName}</span>{article.premium && <span className="premium-pill"><LockKeyhole size={10} /> Premium</span>}</div>
            <h1>{article.title}</h1>
            <p>{article.dek}</p>
            <div className="article-byline"><span><strong>{article.author}</strong><small>Hiposta yazarı</small></span><span>{article.displayDate}</span><span><Clock3 size={13} /> {article.readTime} okuma</span></div>
          </div>
          <aside><p className="eyebrow">Bu içerikle birlikte</p><h2>{newsletter.name}</h2><p>{newsletter.description}</p><Link href={`/bultenler/${newsletter.slug}`}>Bülteni incele <ArrowRight size={15} /></Link></aside>
        </div>
      </header>

      <figure className="article-hero-image page-shell"><div><Image src={article.heroImage} alt={article.heroAlt} fill priority sizes="(max-width: 1280px) 100vw, 1240px" /></div><figcaption>{article.photoCredit}</figcaption></figure>

      <div className="article-content page-shell">
        <div className="article-content__rail"><span>PAYLAŞ</span><button type="button" aria-label="X üzerinde paylaş">X</button><button type="button" aria-label="LinkedIn üzerinde paylaş">in</button><button type="button" aria-label="Bağlantıyı kopyala">↗</button></div>
        <div className="article-body">
          <p className="article-body__lead">{article.body[0]}</p>
          {article.premium ? (
            <>
              <div className="locked-preview" aria-hidden="true"><p>{article.body[1]}</p><p>{article.body[2]}</p></div>
              <section className="paywall">
                <div className="paywall__icon"><Crown size={28} /></div>
                <p className="eyebrow">İçeriğin devamı Premium’da</p>
                <h2>Yüzeyde kalma.<br />Hikâyenin tamamını oku.</h2>
                <p>Bu dosyanın kalan bölümleriyle birlikte 17 yayının tüm premium analizlerine eriş.</p>
                <ul><li><Check size={15} /> Tüm premium içerikler</li><li><Check size={15} /> Hiposta Haftalık Dergi</li><li><Check size={15} /> Reklamsız okuma deneyimi</li></ul>
                <div><Link className="button button--yellow" href="/kayit-ol?plan=premium">Premium’a geç <ArrowRight size={16} /></Link><Link href="/giris">Zaten üye misin? Giriş yap</Link></div>
                <small>Demo akışı · ödeme alınmaz</small>
              </section>
            </>
          ) : article.body.slice(1).map((paragraph, index) => <p key={index}>{paragraph}</p>)}

          {!article.premium && (
            <div className="article-tags">{article.tags.map((tag) => <Link key={tag} href={`/arama?q=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>
          )}
        </div>
        <aside className="article-newsletter-aside">
          <PublicationMark publication={publication} size="small" linked={false} />
          <p className="eyebrow">Bu yayını takip et</p>
          <h2>{newsletter.name}</h2>
          <p>{newsletter.schedule} · {newsletter.deliveryTime}</p>
          <SubscribeForm newsletterName={newsletter.name} newsletterSlugs={[newsletter.slug]} compact />
        </aside>
      </div>

      <section className="related-section page-shell">
        <div className="section-heading section-heading--rule"><div><p className="eyebrow">Okumaya devam et</p><h2>Benzer içerikler</h2></div></div>
        <div className="article-grid article-grid--three">{related.map((item) => <ArticleCard key={item.slug} article={item} />)}</div>
      </section>
    </article>
  );
}
