import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Clock3, LockKeyhole, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { NewsletterCard } from "@/components/newsletter-card";
import { PublicationMark } from "@/components/publication-mark";
import { SubscribeForm } from "@/components/subscribe-form";
import { getCatalog } from "@/lib/catalog";
import { getContent } from "@/lib/content";

export default async function HomePage() {
  const [catalog, content] = await Promise.all([getCatalog(), getContent({ limit: 20 })]);
  const articles = content.articles;
  const lead = articles.find((article) => article.featured) ?? articles[0];
  const leadPublication = lead ? catalog.publications.find((item) => item.slug === lead.publicationSlug) : undefined;
  const leadCategory = lead ? catalog.categories.find((item) => item.slug === lead.categorySlug) : undefined;
  const latest = lead ? articles.filter((article) => article.slug !== lead.slug).slice(0, 3) : [];
  const feed = lead ? articles.filter((article) => article.slug !== lead.slug).slice(3, 7) : [];
  const featuredNewsletters = catalog.newsletters.filter((item) => item.featured).slice(0, 3);
  const featuredPublications = catalog.publications.filter((item) => item.featured && !item.isComingSoon).slice(0, 4);
  const dailyNewsletter = catalog.newsletters.find((item) => item.slug === "hiposta-gundem") ?? catalog.newsletters[0];

  return (
    <>
      {lead && leadPublication && <section className="home-lead page-shell">
        <article className="home-lead__story">
          <div className="story-kicker">
            <Link href={`/yayinlar/${leadPublication.slug}`}>{leadPublication.name}</Link>
            <span>{leadCategory?.shortName || lead.categoryShortName || "Gündem"}</span>
            {lead.premium && <span className="premium-pill"><LockKeyhole size={10} /> Premium</span>}
          </div>
          <h1><Link href={`/icerik/${lead.slug}`}>{lead.title}</Link></h1>
          <p className="home-lead__dek">{lead.dek}</p>
          <Link className="inline-arrow-link" href={`/icerik/${lead.slug}`}>Dosyayı oku <ArrowRight size={17} /></Link>
          <Link className="home-lead__image" href={`/icerik/${lead.slug}`} aria-label={lead.title}><Image src={lead.heroImage} alt={lead.heroAlt} fill priority sizes="(max-width: 900px) 100vw, 70vw" /></Link>
          <div className="home-lead__meta"><span>{lead.author}</span><span>{lead.displayDate} · {lead.readTime}</span></div>
        </article>

        <aside className="home-lead__aside">
          {dailyNewsletter && <div className="daily-newsletter">
            <div className="daily-newsletter__top"><span>Günlük özet</span><b>Ücretsiz</b></div>
            <div className="daily-newsletter__issue">HIPOSTA</div>
            <h2>{dailyNewsletter.name}</h2>
            <p>{dailyNewsletter.description}</p>
            <SubscribeForm newsletterName={dailyNewsletter.name} newsletterSlugs={[dailyNewsletter.slug]} dark compact />
          </div>}
          <div className="signal-card">
            <div className="signal-card__head"><span>Hiposta radar</span><span>Güncel</span></div>
            {catalog.categories.slice(0, 3).map((category, index) => <Link key={category.slug} href={`/kategori/${category.slug}`}><span>0{index + 1}</span><p>{category.description}</p><ArrowUpRight size={14} /></Link>)}
          </div>
        </aside>
      </section>}

      {!lead && <section className="section page-shell"><div className="empty-state"><span>H</span><h2>İlk Hiposta içerikleri hazırlanıyor.</h2><p>Yayın ağı aktif; editoryal akış kısa süre içinde burada görünmeye başlayacak.</p></div></section>}

      {latest.length > 0 && <section className="section page-shell">
        <div className="section-heading section-heading--rule"><div><p className="eyebrow">Editör masası</p><h2>Gündemden seçtiklerimiz</h2></div><Link href="/arama">Tüm içerikler <ArrowUpRight size={15} /></Link></div>
        <div className="article-grid article-grid--three">{latest.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
      </section>}

      <section className="premium-band">
        <div className="page-shell premium-band__inner">
          <div className="premium-band__seal">H<span>+</span></div>
          <div><p className="eyebrow">Hiposta Premium</p><h2>Haberi değil,<br />hikâyenin tamamını oku.</h2></div>
          <div className="premium-band__copy"><p>{catalog.stats.publications} yayının derin analizleri, özel dosyaları ve reklamsız okuma deneyimi tek üyelikte.</p><ul><li><Sparkles size={14} /> Tüm premium içerikler</li><li><Sparkles size={14} /> Hiposta Dergi</li><li><Sparkles size={14} /> Kaydet ve sonra oku</li></ul><Link className="button button--yellow" href="/premium">Premium’u keşfet <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="section page-shell">
        <div className="section-heading section-heading--rule"><div><p className="eyebrow">Hip Medya ekosistemi</p><h2>Tek merkez, farklı dünyalar</h2></div><Link href="/yayinlar">{catalog.stats.publications} yayını gör <ArrowUpRight size={15} /></Link></div>
        <div className="publication-grid">{featuredPublications.map((publication, index) => <article key={publication.slug} className="publication-tile" style={{ "--tile-color": publication.color, "--tile-foreground": publication.foreground } as CSSProperties}><span className="publication-tile__index">0{index + 1}</span><PublicationMark publication={publication} linked={false} /><p>{publication.description}</p><div><span>{publication.cadence}</span><span>{publication.reach}</span></div><Link href={`/yayinlar/${publication.slug}`}>Yayına git <ArrowUpRight size={16} /></Link></article>)}</div>
      </section>

      {feed.length > 0 && <section className="feed-section"><div className="page-shell feed-section__grid"><div><div className="section-heading section-heading--small section-heading--rule"><div><p className="eyebrow">Son eklenenler</p><h2>Okuma listesi</h2></div></div><div className="article-feed">{feed.map((article) => <ArticleCard key={article.slug} article={article} variant="horizontal" />)}</div></div><aside className="platform-note"><span className="platform-note__stamp">H</span><p className="eyebrow">Hiposta ağı</p><h2>İlgi alanın kadar posta.</h2><p>Her yayın kendi sesini korur. Sen yalnızca hangi konuların gelen kutuna ulaşacağını seçersin.</p><dl><div><dt>{catalog.stats.publications}</dt><dd>yayın</dd></div><div><dt>{catalog.stats.activeNewsletters}</dt><dd>aktif bülten</dd></div><div><dt>{catalog.stats.categories}</dt><dd>kategori</dd></div></dl><Link className="inline-arrow-link" href="/hakkimizda">Nasıl çalışır? <ArrowRight size={16} /></Link></aside></div></section>}

      <section className="newsletter-showcase page-shell">
        <div className="newsletter-showcase__heading"><div><p className="eyebrow">Gelen kutunu yeniden kur</p><h2>Bir bülten değil,<br />kişisel yayın akışın.</h2></div><p>Ekonomi sabah gelsin, tarifler iş çıkışından önce, haftanın en iyi fikirleri pazar günü. Seç, birleştir, tek hesaptan yönet.</p></div>
        <div className="newsletter-grid">{featuredNewsletters.map((newsletter) => <NewsletterCard key={newsletter.slug} newsletter={newsletter} publication={catalog.publications.find((item) => item.slug === newsletter.publicationSlug)} />)}</div>
        <div className="newsletter-showcase__footer"><span><Clock3 size={14} /> Sıklığı ve konuyu sen belirlersin.</span><Link className="button button--primary" href="/bultenler">Bültenlerini seç <ArrowRight size={16} /></Link></div>
      </section>
    </>
  );
}
