import { Crown, Menu, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { getCatalog } from "@/lib/catalog";

export async function SiteHeader() {
  const catalog = await getCatalog();

  return (
    <>
      <div className="utility-bar utility-bar--v2">
        <div className="page-shell utility-bar__inner">
          <span>Hip Medya yayın ağı</span>
          <span className="utility-bar__promise">{catalog.stats.publications} yayın · {catalog.stats.activeNewsletters} aktif bülten</span>
          <Link href="/bultenler">Gelen kutunu kur</Link>
        </div>
      </div>

      <header className="site-header site-header--v2">
        <div className="page-shell site-header__inner">
          <nav className="site-header__primary" aria-label="Ana navigasyon">
            <Link href="/">Ana sayfa</Link>
            <Link href="/yayinlar">Yayınlar</Link>
            <Link href="/bultenler">Bültenler</Link>
          </nav>

          <Logo />

          <div className="site-header__actions">
            <Link className="icon-link" href="/arama" aria-label="Ara"><Search size={17} strokeWidth={1.8} /></Link>
            <Link className="text-link" href="/giris"><UserRound size={15} /> Giriş</Link>
            <Link className="button button--primary button--small" href="/premium"><Crown size={14} /> Premium</Link>
          </div>

          <details className="mobile-menu">
            <summary aria-label="Menüyü aç"><Menu size={21} /></summary>
            <nav aria-label="Mobil navigasyon">
              <Link href="/">Ana sayfa</Link><Link href="/yayinlar">Yayınlar</Link><Link href="/bultenler">Bültenler</Link><Link href="/arama">Ara</Link><Link href="/giris">Giriş yap</Link><Link href="/premium">Premium</Link>
            </nav>
          </details>
        </div>
      </header>

      <nav className="topic-nav topic-nav--v2" aria-label="İçerik kategorileri">
        <div className="page-shell topic-nav__inner">
          {catalog.categories.map((category) => <Link key={category.slug} href={`/kategori/${category.slug}`}>{category.shortName}</Link>)}
        </div>
      </nav>
    </>
  );
}
