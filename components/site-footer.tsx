import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { getCatalog } from "@/lib/catalog";

export async function SiteFooter() {
  const catalog = await getCatalog();

  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__grid">
        <div className="site-footer__brand">
          <Logo inverse compact />
          <p>{catalog.stats.publications} yayın, tek hesap, yalnızca seçtiğin konular.</p>
        </div>
        <div>
          <p className="footer-label">Keşfet</p>
          <nav>
            <Link href="/yayinlar">Tüm yayınlar</Link>
            <Link href="/bultenler">Tüm bültenler</Link>
            <Link href="/premium">Hiposta Premium</Link>
            <Link href="/hakkimizda">Hiposta hakkında</Link>
          </nav>
        </div>
        <div>
          <p className="footer-label">Kategoriler</p>
          <nav>
            {catalog.categories.slice(0, 5).map((category) => (
              <Link key={category.slug} href={`/kategori/${category.slug}`}>{category.shortName}</Link>
            ))}
          </nav>
        </div>
        <div className="site-footer__cta">
          <p className="footer-label">Her hafta</p>
          <h2>Haftanın en iyileri tek postada.</h2>
          <Link className="footer-arrow-link" href="/bultenler/hiposta-haftalik">
            Hiposta Haftalık’a bak <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="page-shell site-footer__bottom">
        <span>© 2026 Hip Medya</span>
        <span>Yayın ve bülten kataloğu Hiposta Core’dan beslenir.</span>
        <div><Link href="/hakkimizda#kvkk">KVKK</Link><Link href="/hakkimizda#cerezler">Çerezler</Link></div>
      </div>
    </footer>
  );
}
