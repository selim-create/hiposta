import type { Metadata } from "next";
import { ArrowRight, Check, Crown, Layers3, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { articles } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Premium",
  description: "17 yayının derin analizlerine ve Hiposta Dergi’ye tek üyelikle eriş.",
};

export default function PremiumPage() {
  const premiumArticles = articles.filter((article) => article.premium).slice(0, 3);
  return (
    <>
      <section className="premium-hero">
        <div className="page-shell premium-hero__grid">
          <div><p className="eyebrow">Hiposta Premium</p><h1>Gündemi takip etme.<br /><span>Gerçekten anla.</span></h1><p>17 yayının özel dosyaları, uzman analizleri ve haftalık dijital dergisi; sade, reklamsız ve tek üyelikte.</p><div className="premium-hero__actions"><Link className="button button--yellow" href="/kayit-ol?plan=premium">Premium’a geç <ArrowRight size={17} /></Link><small>Demo akışı · ödeme alınmaz</small></div></div>
          <div className="premium-cover"><span className="premium-cover__mark">H<span>+</span></span><p>HIPOSTA DERGİ</p><strong>Yeni<br />dönemin<br />haritası</strong><div><span>SAYI 01</span><span>AĞUSTOS 2026</span></div></div>
        </div>
      </section>

      <section className="premium-benefits page-shell">
        <article><Crown size={24} /><span>01</span><h2>Tamamını oku</h2><p>İlk paragraftan sonra kesilen premium dosyalara ve arşive sınırsız eriş.</p></article>
        <article><Layers3 size={24} /><span>02</span><h2>Tek üyelik</h2><p>Her site için ayrı hesap yerine 17 yayını tek profil ve ödeme altında yönet.</p></article>
        <article><Zap size={24} /><span>03</span><h2>Sade deneyim</h2><p>Reklamsız okuma, kayıtlı içerikler ve sana göre düzenlenen ana akış.</p></article>
        <article><Sparkles size={24} /><span>04</span><h2>Haftalık dergi</h2><p>Ekosistemin en iyi içeriklerinden hazırlanan premium pazar seçkisi.</p></article>
      </section>

      <section className="pricing-section">
        <div className="page-shell pricing-section__inner">
          <div><p className="eyebrow">Kurucu üye dönemi</p><h2>İlk okurlar<br />arasında yerini al.</h2><p>Fiyatlar ve ödeme akışı ürün prototipi için mock olarak gösterilir.</p></div>
          <div className="pricing-cards">
            <article><span>Aylık</span><div><strong>₺149</strong><small>/ ay</small></div><p>İstediğin zaman iptal et.</p><ul><li><Check size={14} /> Tüm premium içerikler</li><li><Check size={14} /> Hiposta Dergi</li><li><Check size={14} /> Reklamsız deneyim</li></ul><Link className="button button--outline" href="/kayit-ol?plan=monthly">Aylık başla <ArrowRight size={16} /></Link></article>
            <article className="pricing-card--featured"><span>Yıllık · 2 ay hediye</span><div><strong>₺1.490</strong><small>/ yıl</small></div><p>En avantajlı kurucu üye planı.</p><ul><li><Check size={14} /> Tüm premium içerikler</li><li><Check size={14} /> Hiposta Dergi</li><li><Check size={14} /> Reklamsız deneyim</li></ul><Link className="button button--yellow" href="/kayit-ol?plan=annual">Yıllık başla <ArrowRight size={16} /></Link></article>
          </div>
        </div>
      </section>

      <section className="section page-shell"><div className="section-heading section-heading--rule"><div><p className="eyebrow">Premium seçki</p><h2>Derine inen dosyalar</h2></div></div><div className="article-grid article-grid--three">{premiumArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></section>
    </>
  );
}
