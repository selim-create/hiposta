import type { Metadata } from "next";
import { ArrowRight, Database, MailCheck, Network, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Hiposta hakkında", description: "Hiposta’nın ürün vizyonu, veri yaklaşımı ve çalışma modeli." };

export default function AboutPage() {
  return (
    <>
      <section className="about-hero page-shell"><p className="eyebrow">Hip Medya’nın merkezi yayın platformu</p><h1>İçeriği dağıtan değil,<br /><span>ilişkiyi sahiplenen altyapı.</span></h1><p>Hiposta, 17 farklı yayın mecrasının e-posta aboneliklerini tek merkezde toplarken her yayının sesini ve kullanıcının seçimini korur.</p></section>
      <section className="about-principles page-shell">
        <article><Network size={23} /><span>01</span><h2>Tek merkez</h2><p>Her site ayrı bir ada olmaktan çıkar; kimlik, tercih ve abonelik yönetimi ortak bir ürün katmanında birleşir.</p></article>
        <article><ShieldCheck size={23} /><span>02</span><h2>Açık rıza</h2><p>Kullanıcı yalnızca seçtiği yayın ve konu için izin verir. Çapraz öneriler, mevcut tercihi bozmadan sunulur.</p></article>
        <article><Database size={23} /><span>03</span><h2>Birinci taraf veri</h2><p>Kaynak, kategori, sıklık ve etkileşim sinyalleri şeffaf bir profil altında tutulur; üçüncü taraf çereze dayanmaz.</p></article>
        <article><MailCheck size={23} /><span>04</span><h2>Teslimat disiplini</h2><p>Merkezi ESP, kaynak bazlı şablon ve itibar yönetimi ile operasyon ölçeklenirken gelen kutusu deneyimi korunur.</p></article>
      </section>
      <section className="architecture-section"><div className="page-shell"><div><p className="eyebrow">API-first omurga</p><h2>Her yayın kendi kimliğiyle,<br />aynı sistem üzerinden konuşur.</h2></div><ol><li><span>01</span><div><strong>Kaynak</strong><p>Ziyaretçi yayın sitesindeki forma e-postasını ve onayını bırakır.</p></div><code>source: kidsgourmet</code></li><li><span>02</span><div><strong>Segment</strong><p>Tercih; yayın, konu, sıklık ve consent sürümüyle merkezi profilde tutulur.</p></div><code>segment: family</code></li><li><span>03</span><div><strong>Dağıtım</strong><p>İçerik yayının logosu ve renkleriyle giydirilir; merkezi ESP üzerinden gönderilir.</p></div><code>template: branded</code></li></ol></div></section>
      <section className="about-cta page-shell"><div><p className="eyebrow">Okur olarak başla</p><h2>Gelen kutunu kendi ilgi alanlarına göre kur.</h2></div><Link className="button button--primary" href="/bultenler">Bültenleri seç <ArrowRight size={16} /></Link></section>
      <section className="legal-notes page-shell" id="kvkk"><h2>Prototip ve veri notu</h2><p>Bu repository ürün deneyimini göstermek için mock veriler ve demo formlar kullanır. Gerçek kişisel veri kaydı, e-posta gönderimi veya ödeme işlemi yapılmaz. Üretim sürümünde açık rıza kaydı, consent versiyonlama, double opt-in, silme/taşıma talepleri ve rol bazlı erişim ayrıca uygulanmalıdır.</p><div id="cerezler"><strong>Çerez yaklaşımı</strong><p>Temel vizyon üçüncü taraf takip çerezlerine bağımlı olmayan, kullanıcı tarafından açıkça verilen tercih ve etkileşimlerden oluşan birinci taraf veri modelidir.</p></div></section>
    </>
  );
}
