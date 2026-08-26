import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Clock3, LockKeyhole, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { NewsletterCard } from "@/components/newsletter-card";
import { PublicationMark } from "@/components/publication-mark";
import { SubscribeForm } from "@/components/subscribe-form";
import { getCategory, getPublication } from "@/lib/data";
import { articles, newsletters, platformStats, publications } from "@/lib/mock-data";

export default function HomePage() {
  const lead = articles.find((article) => article.featured) ?? articles[0];
  const leadPublication = getPublication(lead.publicationSlug)!;
  const leadCategory = getCategory(lead.categorySlug)!;
  const latest = articles.filter((article) => article.slug !== lead.slug).slice(0, 3);
  const feed = articles.filter((article) => article.slug !== lead.slug).slice(3, 7);
  const featuredNewsletters = newsletters.filter((item) => item.featured).slice(0, 3);
  const featuredPublications = publications.filter((item) => item.featured).slice(0, 4);

  return (
    <>
      <section className="home-lead page-shell">
        <article className="home-lead__story">
          <div className="story-kicker">
            <Link href={`/yayinlar/${leadPublication.slug}`}>{leadPublication.name}</Link>
            <span>{leadCategory.shortName}</span>
            <span className="premium-pill"><LockKeyhole size={10} /> Premium</span>
          </div>
          <h1><Link href={`/icerik/${lead.slug}`}>{lead.title}</Link></h1>
          <p className="home-lead__dek">{lead.dek}</p>
          <Link className="inline-arrow-link" href={`/icerik/${lead.slug}`}>Dosyayı oku <ArrowRight size={17} /></Link>
          <Link className="home-lead__image" href={`/icerik/${lead.slug}`} aria-label={lead.title}>
            <Image src={lead.heroImage} alt={lead.heroAlt} fill priority sizes="(max-width: 900px) 100vw, 70vw" />
          </Link>
          <div className="home-lead__meta">
            <span>{lead.author}</span>
            <span>{lead.displayDate} · {lead.readTime}</span>
          </div>
        </article>

        <aside className="home-lead__aside">
          <div className="daily-newsletter">
            <div className="daily-newsletter__top"><span>Günlük özet</span><b>Ücretsiz</b></div>
            <div className="daily-newsletter__issue">Sayı 0826</div>
            <h2>Bugün<br />ne oldu?</h2>
            <p>Hiposta editörlerinden gündemin en önemli 7 başlığı. Her akşam 18.30’da.</p>
            <SubscribeForm newsletterName="Bugün Ne Oldu?" newsletterSlugs={["hiposta-haftalik"]} dark compact />
          </div>
          <div className="signal-card">
            <div className="signal-card__head"><span>Canlı sinyaller</span><span>26.08</span></div>
            <Link href="/kategori/ekonomi"><span>01</span><p>Faiz patikasında ilk beklenti değişti</p><ArrowUpRight size={14} /></Link>
            <Link href="/kategori/spor"><span>02</span><p>Transfer döneminin son 72 saati</p><ArrowUpRight size={14} /></Link>
            <Link href="/kategori/kultur-trend"><span>03</span><p>Markaların radarındaki mikro format</p><ArrowUpRight size={14} /></Link>
          </div>
        </aside>
      </section>

      <section className="section page-shell">
        <div className="section-heading section-heading--rule">
          <div><p className="eyebrow">Editör masası · bugün</p><h2>Gündemden seçtiklerimiz</h2></div>
          <Link href="/arama">Tüm içerikler <ArrowUpRight size={15} /></Link>
        </div>
        <div className="article-grid article-grid--three">
          {latest.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </section>

      <section className="premium-band">
        <div className="page-shell premium-band__inner">
          <div className="premium-band__seal">H<span>+</span></div>
          <div>
            <p className="eyebrow">Hiposta Premium</p>
            <h2>Haberi değil,<br />hikâyenin tamamını oku.</h2>
          </div>
          <div className="premium-band__copy">
            <p>17 yayının derin analizleri, özel dosyaları ve reklamsız okuma deneyimi tek üyelikte.</p>
            <ul><li><Sparkles size={14} /> Tüm premium içerikler</li><li><Sparkles size={14} /> Hiposta Dergi</li><li><Sparkles size={14} /> Kaydet ve sonra oku</li></ul>
            <Link className="button button--yellow" href="/premium">Premium’u keşfet <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section page-shell">
        <div className="section-heading section-heading--rule">
          <div><p className="eyebrow">Hip Medya ekosistemi</p><h2>Tek merkez, farklı dünyalar</h2></div>
          <Link href="/yayinlar">17 yayını gör <ArrowUpRight size={15} /></Link>
        </div>
        <div className="publication-grid">
          {featuredPublications.map((publication, index) => (
            <article key={publication.slug} className="publication-tile" style={{ "--tile-color": publication.color, "--tile-foreground": publication.foreground } as CSSProperties}>
              <span className="publication-tile__index">0{index + 1}</span>
              <PublicationMark publication={publication} linked={false} />
              <p>{publication.description}</p>
              <div><span>{publication.cadence}</span><span>{publication.reach}</span></div>
              <Link href={`/yayinlar/${publication.slug}`}>Yayına git <ArrowUpRight size={16} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="feed-section">
        <div className="page-shell feed-section__grid">
          <div>
            <div className="section-heading section-heading--small section-heading--rule"><div><p className="eyebrow">Son eklenenler</p><h2>Okuma listesi</h2></div></div>
            <div className="article-feed">
              {feed.map((article) => <ArticleCard key={article.slug} article={article} variant="horizontal" />)}
            </div>
          </div>
          <aside className="platform-note">
            <span className="platform-note__stamp">H</span>
            <p className="eyebrow">Hiposta ağı</p>
            <h2>İlgi alanın kadar posta.</h2>
            <p>Her yayın kendi sesini korur. Sen yalnızca hangi konuların gelen kutuna ulaşacağını seçersin.</p>
            <dl>
              <div><dt>{platformStats.publications}</dt><dd>yayın</dd></div>
              <div><dt>{platformStats.activeNewsletters}</dt><dd>aktif bülten</dd></div>
              <div><dt>{platformStats.categories}</dt><dd>kategori</dd></div>
            </dl>
            <Link className="inline-arrow-link" href="/hakkimizda">Nasıl çalışır? <ArrowRight size={16} /></Link>
          </aside>
        </div>
      </section>

      <section className="newsletter-showcase page-shell">
        <div className="newsletter-showcase__heading">
          <div><p className="eyebrow">Gelen kutunu yeniden kur</p><h2>Bir bülten değil,<br />kişisel yayın akışın.</h2></div>
          <p>Ekonomi sabah gelsin, tarifler iş çıkışından önce, haftanın en iyi fikirleri pazar günü. Seç, birleştir, tek hesaptan yönet.</p>
        </div>
        <div className="newsletter-grid">
          {featuredNewsletters.map((newsletter) => <NewsletterCard key={newsletter.slug} newsletter={newsletter} />)}
        </div>
        <div className="newsletter-showcase__footer">
          <span><Clock3 size={14} /> Sıklığı ve konuyu sen belirlersin.</span>
          <Link className="button button--primary" href="/bultenler">Bültenlerini seç <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
