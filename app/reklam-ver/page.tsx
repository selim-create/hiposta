import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Mail, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { getCatalog } from "@/lib/catalog";
import { publicMetadata } from "@/lib/seo";
import styles from "./advertise-v2.module.css";

export const metadata = publicMetadata({
  title: "Reklam Ver",
  description: "Hiposta yayın ağı, bülten envanteri ve web + e-posta sponsorluk modelleri için marka iş birlikleri.",
  path: "/reklam-ver",
});

const formatNumber = (value: number) => new Intl.NumberFormat("tr-TR").format(value);

function WebPreview() {
  return <div className={styles.preview} aria-label="Web içerik sponsorluğu örneği">
    <div className={styles.browserBar}><i /><i /><i /></div>
    <div className={styles.webFrame}>
      <div className={styles.webMeta} />
      <div className={styles.webTitle} />
      <div className={styles.webLine} />
      <div className={styles.webLine} />
      <div className={styles.webLine} />
      <div className={styles.sponsorDemo}>
        <small>Sponsorlu içerik · Örnek marka</small>
        <strong>İçeriğin doğal akışında görünür sponsor alanı</strong>
        <p>Marka mesajı, görseli ve CTA’sı editoryal içerikten açıkça ayrılarak sunulur.</p>
      </div>
      <div className={styles.webLine} />
      <div className={styles.webLine} />
    </div>
  </div>;
}

function EmailPreview() {
  return <div className={styles.preview} aria-label="E-posta bülten sponsorluğu örneği">
    <div className={styles.emailShell}>
      <div className={styles.emailHead}>hiposta.</div>
      <div className={styles.emailSponsor}>
        <small>Bülten üst sponsorluğu</small>
        <strong>Örnek Marka × Hiposta</strong>
        <span>Kısa marka mesajı · CTA →</span>
      </div>
      <div className={styles.emailContent}>
        <div className={styles.emailStory}><b /><i /></div>
        <div className={styles.emailStory}><b /><i /></div>
        <div className={styles.emailSponsor}>
          <small>Bülten orta sponsorluğu</small>
          <strong>İçerik akışının içinde ikinci temas</strong>
          <span>Marka mesajı · CTA →</span>
        </div>
        <div className={styles.emailStory}><b /><i /></div>
      </div>
    </div>
  </div>;
}

function NetworkPreview() {
  return <div className={styles.preview} aria-label="Yayın ve bülten sponsorluğu örneği">
    <div className={styles.networkPreview}>
      {["Gündem", "Ekonomi", "Yaşam", "Sektörel"].map((label) => <div key={label} className={styles.networkTile}><small>Yayın bağlamı</small><strong>{label}</strong></div>)}
    </div>
  </div>;
}

export default async function AdvertisePage() {
  const catalog = await getCatalog();
  const activePublicationSlugs = new Set(catalog.publications.filter((item) => item.status === "active" && !item.isComingSoon).map((item) => item.slug));
  const activeNewsletters = catalog.newsletters
    .filter((item) => activePublicationSlugs.has(item.publicationSlug))
    .sort((a, b) => (b.audienceCount || 0) - (a.audienceCount || 0));
  const totalNewsletterSubscriptions = activeNewsletters.reduce((sum, item) => sum + (item.audienceCount || 0), 0);
  const publicationBySlug = new Map(catalog.publications.map((item) => [item.slug, item]));

  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className="page-shell">
        <div className={styles.heroGrid}>
          <div>
            <p className={styles.eyebrow}>Markalar ve iş ortakları için</p>
            <h1>Doğru yayında.<br />Doğru içerikte.<br /><span>Doğru anda.</span></h1>
            <p className={styles.lead}>Hiposta; farklı yayınların kendi kitle ve editoryal bağlamlarını koruduğu, web ve e-posta sponsorluklarının tek bir ürün ve ölçüm katmanında planlanabildiği yeni nesil yayın ağıdır.</p>
            <div className={styles.heroActions}>
              <a className={styles.primary} href="mailto:iletisim@hipmedya.com?subject=Hiposta%20Reklam%20ve%20Sponsorluk%20Talebi"><Mail size={15} /> Teklif iste</a>
              <Link className={styles.secondary} href="/reklam-ve-sponsorluk-ilkeleri">Sponsorluk ilkeleri <ArrowRight size={14} /></Link>
            </div>
          </div>
          <aside className={styles.heroPanel}>
            <span>Canlı ağ görünümü</span>
            <dl>
              <div><dt>{catalog.source === "core" ? formatNumber(catalog.stats.activePublications) : "—"}</dt><dd>aktif yayın</dd></div>
              <div><dt>{catalog.source === "core" ? formatNumber(catalog.stats.activeNewsletters) : "—"}</dt><dd>aktif bülten</dd></div>
              <div><dt>{catalog.source === "core" ? formatNumber(catalog.stats.categories) : "—"}</dt><dd>içerik kategorisi</dd></div>
              <div><dt>{catalog.source === "core" ? formatNumber(totalNewsletterSubscriptions) : "—"}</dt><dd>toplam bülten abonelik kaydı*</dd></div>
            </dl>
          </aside>
        </div>
      </div>
    </section>

    <section className={styles.section}>
      <div className="page-shell">
        <div className={styles.sectionHead}>
          <span>01 · Canlı envanter</span>
          <div><h2>Yayındaki bültenler ve gerçek abone ölçekleri.</h2><p>Marka planlamasını yalnız soyut kategori vaatleriyle değil, aktif yayın ve bülten envanteri üzerinden yapıyoruz. Aşağıdaki rakamlar Hiposta kataloğundaki güncel bülten abonelik kayıtlarından gelir.</p></div>
        </div>
        {catalog.source === "core" && activeNewsletters.length ? <div className={styles.inventory}>
          {activeNewsletters.map((newsletter) => {
            const publication = publicationBySlug.get(newsletter.publicationSlug);
            return <article className={styles.inventoryCard} key={newsletter.slug}>
              <div className={styles.inventoryTop}>
                <div><small>{publication?.name ?? "Hiposta yayını"}</small><h3>{newsletter.name}</h3></div>
                <span className={styles.dot} style={{ "--accent": newsletter.accent } as CSSProperties} />
              </div>
              <strong>{formatNumber(newsletter.audienceCount || 0)}</strong>
              <p>abone · {newsletter.schedule}{newsletter.deliveryTime ? ` · ${newsletter.deliveryTime}` : ""}</p>
            </article>;
          })}
        </div> : <div className={styles.unavailable}>Canlı yayın envanteri şu anda Core servisinden alınamıyor. Bu bölüm herhangi bir tahmini veya mock abone rakamı göstermiyor; servis yeniden erişilebilir olduğunda gerçek katalog verisi otomatik olarak görünür.</div>}
      </div>
    </section>

    <section className={styles.section}>
      <div className="page-shell">
        <div className={styles.sectionHead}>
          <span>02 · Neden Hiposta?</span>
          <div><h2>Yalnız görünürlük değil, bağlam satın alın.</h2><p>Hiposta’nın ticari ürünü, kullanıcıyı siteler arasında takip eden gizli profilleme yerine yayın, bülten ve içerik bağlamını merkeze alır.</p></div>
        </div>
        <div className={styles.whyGrid}>
          <article className={styles.whyCard}><span className={styles.whyNumber}><Target size={16} /></span><h3>Bağlamsal hedefleme</h3><p>Kampanyayı belirli yayın, bülten, içerik veya döneme bağlayın. Marka mesajı doğru editoryal çevrede yer alsın.</p></article>
          <article className={styles.whyCard}><span className={styles.whyNumber}><ShieldCheck size={16} /></span><h3>Açık sponsorluk</h3><p>Her ticari alan sponsor etiketiyle editoryal içerikten ayrılır. Kullanıcı güveni reklam ürününün tasarım girdisidir.</p></article>
          <article className={styles.whyCard}><span className={styles.whyNumber}><TrendingUp size={16} /></span><h3>Birinci taraf ölçüm</h3><p>İzinli analytics katmanı üzerinden sponsor gösterimi ve tıklama eventleri ölçülebilir; raporlama ürünün kendi event mimarisine dayanır.</p></article>
        </div>
      </div>
    </section>

    <section className={styles.section}>
      <div className="page-shell">
        <div className={styles.sectionHead}>
          <span>03 · Sponsorluk ürünleri</span>
          <div><h2>Web’de ve gelen kutusunda aynı marka hikâyesi.</h2><p>Mevcut Hiposta sponsorluk motoru web içeriklerinde içerik içi / içerik sonu; bültenlerde ise üst / orta / alt yerleşimlerini destekler.</p></div>
        </div>
        <div className={styles.products}>
          <article className={styles.product}>
            <div className={styles.productCopy}><span>Web · article_inline / article_end</span><h3>İçerik sponsorluğu</h3><p>Marka mesajı makalenin doğal okuma akışına, açık sponsor etiketi ve CTA ile yerleşir. İçeriğin tonuna müdahale etmeden görünürlük kazanır.</p><ul className={styles.featureList}><li><span className={styles.check}>✓</span>İçerik içi ve içerik sonu yerleşimleri</li><li><span className={styles.check}>✓</span>Marka logo, görsel, başlık, açıklama ve CTA alanı</li><li><span className={styles.check}>✓</span>Yayın veya içerik bağlamına göre planlama</li><li><span className={styles.check}>✓</span>Görünür gösterim ve tıklama ölçümü</li></ul></div>
            <WebPreview />
          </article>
          <article className={styles.product}>
            <div className={styles.productCopy}><span>E-posta · newsletter_top / mid / footer</span><h3>Bülten sponsorluğu</h3><p>Markanız doğrudan seçilmiş bir bülten kitlesinin gelen kutusuna, editoryal akıştan ayrıştırılmış ama tasarımla bütünleşen sponsor bloklarıyla girer.</p><ul className={styles.featureList}><li><span className={styles.check}>✓</span>Bülten üst, orta ve alt sponsor konumları</li><li><span className={styles.check}>✓</span>Belirli bülten veya sayı bazlı dönem planlaması</li><li><span className={styles.check}>✓</span>E-posta template’inde gerçek sponsor render desteği</li><li><span className={styles.check}>✓</span>Kampanya snapshot yapısıyla gönderim anındaki sponsor kreatifinin korunması</li></ul></div>
            <EmailPreview />
          </article>
          <article className={styles.product}>
            <div className={styles.productCopy}><span>Ağ paketi · yayın / bülten bağlamı</span><h3>Yayın ve dönem sponsorluğu</h3><p>Tek bir yerleşim yerine belirli bir yayın, bülten veya editoryal tema çevresinde dönemsel görünürlük planlayın. Web ve e-posta temaslarını aynı marka kurgusunda birleştirin.</p><ul className={styles.featureList}><li><span className={styles.check}>✓</span>Yayın ve bülten bazlı hedefleme</li><li><span className={styles.check}>✓</span>Belirli başlangıç / bitiş tarihi</li><li><span className={styles.check}>✓</span>Web + e-posta kombinasyonu</li><li><span className={styles.check}>✓</span>Özel proje ve editoryal iş birliği planlaması</li></ul></div>
            <NetworkPreview />
          </article>
        </div>
      </div>
    </section>

    <section className={styles.section}>
      <div className="page-shell">
        <div className={styles.measurement}>
          <div className={styles.measurementCopy}><p className={styles.eyebrow}>04 · Ölçüm ve şeffaflık</p><h2>Ne sunduğumuzu ve ne ölçtüğümüzü netleştiriyoruz.</h2><p>Hiposta, açık sponsorluk etiketini, yayın bağlamını ve izinli birinci taraf ölçümü aynı ticari ürünün parçaları olarak ele alır.</p></div>
          <div className={styles.measurementGrid}>
            <div className={styles.metric}><strong>Sponsor impression</strong><span>Web sponsor alanı görünürlük eşiğini geçtiğinde event üretilebilir.</span></div>
            <div className={styles.metric}><strong>Sponsor click</strong><span>Marka CTA tıklamaları placement kimliğiyle ilişkilendirilebilir.</span></div>
            <div className={styles.metric}><strong>Placement bilgisi</strong><span>İçerik içi, içerik sonu, bülten üst, orta ve alt konumları ayrı raporlanabilir.</span></div>
            <div className={styles.metric}><strong>Bağlam</strong><span>Kampanya yayın, bülten veya içerik hedefiyle birlikte değerlendirilebilir.</span></div>
            <div className={styles.metric}><strong>Consent-first analytics</strong><span>Zorunlu olmayan web analytics ölçümleri kullanıcı izni olmadan çalışmaz.</span></div>
            <div className={styles.metric}><strong>Editoryal sınır</strong><span>Ticari yerleşimler editoryal içerikten açık etiket ve tasarım ayrımıyla sunulur.</span></div>
          </div>
        </div>
      </div>
    </section>

    <section className={styles.cta}>
      <div className="page-shell">
        <div className={styles.ctaGrid}>
          <div><p className={styles.eyebrow}>Markanız için çalışma planlayalım</p><h2>Hedef kitlenizi değil, doğru yayın bağlamını seçerek başlayalım.</h2><p>Marka, kampanya dönemi, hedeflenen kategori/yayınlar ve tercih ettiğiniz web veya bülten yerleşimlerini paylaşın. Hip Medya ekibi uygun sponsorluk paketini planlasın.</p></div>
          <div className={styles.ctaActions}><a className={styles.primary} href="mailto:iletisim@hipmedya.com?subject=Hiposta%20Reklam%20ve%20Sponsorluk%20Talebi"><Mail size={15} /> Teklif iste</a><Link className={styles.secondary} href="/iletisim">İletişim bilgileri</Link></div>
        </div>
      </div>
    </section>

    <div className={`page-shell ${styles.finePrint}`}>* “Toplam bülten abonelik kaydı”, bülten bazındaki abonelik sayılarının toplamıdır; aynı kişinin birden fazla bültene abone olması halinde tekil kullanıcı sayısını ifade etmez. Sponsorluk uygulamaları <Link href="/reklam-ve-sponsorluk-ilkeleri">Reklam ve Sponsorluk İlkeleri</Link> doğrultusunda yürütülür.</div>
  </div>;
}
