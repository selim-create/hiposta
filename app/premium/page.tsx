import type { Metadata } from "next";
import { ArrowRight, Crown, Layers3, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { getCatalog } from "@/lib/catalog";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Premium",
  description: "Hiposta Premium ile hazırlanacak derin analizleri, özel seçkileri ve tek hesap deneyimini keşfet.",
};

export default async function PremiumPage() {
  const [catalog, content] = await Promise.all([getCatalog(), getContent({ premium: true, limit: 12 })]);
  const premiumArticles = content.articles.slice(0, 3);
  const catalogAvailable = catalog.source !== "unavailable";
  const publicationLabel = catalogAvailable ? `${catalog.stats.publications} yayının` : "Hiposta yayın ağının";

  return (
    <>
      <section className="premium-hero">
        <div className="page-shell premium-hero__grid">
          <div>
            <p className="eyebrow">Hiposta Premium · Yakında</p>
            <h1>Gündemi takip etme.<br /><span>Gerçekten anla.</span></h1>
            <p>{publicationLabel} özel dosyaları, uzman analizleri ve haftalık dijital dergisi tek Premium üyelik altında buluşacak.</p>
            <div className="premium-hero__actions">
              <Link className="button button--yellow" href="/kayit-ol">Ücretsiz hesabını oluştur <ArrowRight size={17} /></Link>
              <small>Premium ödeme ve satın alma akışı henüz aktif değil.</small>
            </div>
          </div>
          <div className="premium-cover"><span className="premium-cover__mark">H<span>+</span></span><p>HIPOSTA DERGİ</p><strong>Yeni<br />dönemin<br />haritası</strong><div><span>SAYI 01</span><span>AĞUSTOS 2026</span></div></div>
        </div>
      </section>

      <section className="premium-benefits page-shell">
        <article><Crown size={24} /><span>01</span><h2>Tamamını oku</h2><p>Premium açıldığında özel dosyalara ve premium arşive tek üyelikle eriş.</p></article>
        <article><Layers3 size={24} /><span>02</span><h2>Tek üyelik</h2><p>Her site için ayrı hesap yerine tüm Hiposta yayınlarını tek profil altında yönet.</p></article>
        <article><Zap size={24} /><span>03</span><h2>Kişisel deneyim</h2><p>Kayıtlı içeriklerini, okuma geçmişini ve sana göre düzenlenen akışı tek hesapta kullan.</p></article>
        <article><Sparkles size={24} /><span>04</span><h2>Haftalık dergi</h2><p>Ekosistemin en iyi içeriklerinden hazırlanacak premium pazar seçkisini takip et.</p></article>
      </section>

      <section className="pricing-section">
        <div className="page-shell pricing-section__inner">
          <div>
            <p className="eyebrow">Premium hazırlanıyor</p>
            <h2>Önce güçlü bir okuma deneyimi.<br />Sonra gerçek üyelik.</h2>
            <p>Fiyatlandırma, ödeme sağlayıcısı ve üyelik koşulları kesinleştiğinde burada gerçek bilgilerle yayınlanacak. Şu anda herhangi bir Premium ödeme veya satın alma işlemi yapılmıyor.</p>
          </div>
          <div className="pricing-cards">
            <article className="pricing-card--featured">
              <span>Bugün kullanabileceklerin</span>
              <p>Ücretsiz Hiposta hesabınla bültenlerini yönetebilir, içerik kaydedebilir ve kişisel alanını oluşturmaya başlayabilirsin.</p>
              <Link className="button button--yellow" href="/kayit-ol">Ücretsiz hesap aç <ArrowRight size={16} /></Link>
            </article>
          </div>
        </div>
      </section>

      {premiumArticles.length > 0 && <section className="section page-shell"><div className="section-heading section-heading--rule"><div><p className="eyebrow">Premium seçki</p><h2>Derine inen dosyalar</h2></div></div><div className="article-grid article-grid--three">{premiumArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></section>}
    </>
  );
}
