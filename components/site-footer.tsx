import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { getCatalog } from "@/lib/catalog";

export async function SiteFooter() {
  const catalog = await getCatalog();

  return (
    <footer className="site-footer site-footer--v2">
      <div className="page-shell site-footer__intro">
        <div><p className="footer-label">hiposta.</p><h2>Ne okuyacağını sen seç.<br />Biz doğru zamanda gönderelim.</h2></div>
        <p>{catalog.stats.publications} farklı yayın kimliği, tek bir keşif ve abonelik deneyiminde buluşuyor.</p>
      </div>
      <div className="page-shell site-footer__grid">
        <div className="site-footer__brand">
          <Logo inverse compact />
          <p>İlgi alanın kadar posta.</p>
        </div>
        <div>
          <p className="footer-label">Keşfet</p>
          <nav><Link href="/yayinlar">Tüm yayınlar</Link><Link href="/bultenler">Tüm bültenler</Link><Link href="/premium">Hiposta Premium</Link><Link href="/hakkimizda">Hiposta hakkında</Link></nav>
        </div>
        <div>
          <p className="footer-label">Kategoriler</p>
          <nav>{catalog.categories.slice(0, 6).map((category) => <Link key={category.slug} href={`/kategori/${category.slug}`}>{category.shortName}</Link>)}</nav>
        </div>
        <div className="site-footer__cta">
          <p className="footer-label">Başlangıç noktası</p>
          <h2>Bültenlerini seç,<br />akışını kur.</h2>
          <Link className="footer-arrow-link" href="/bultenler">Bültenleri keşfet <ArrowUpRight size={17} /></Link>
        </div>
      </div>
      <div className="page-shell site-footer__bottom">
        <span>© 2026 Hip Medya</span>
        <span>Hiposta · içerik, bülten ve üyelik platformu</span>
        <div><Link href="/hakkimizda#kvkk">KVKK</Link><Link href="/hakkimizda#cerezler">Çerezler</Link></div>
      </div>
    </footer>
  );
}
