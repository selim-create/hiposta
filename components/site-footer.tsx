import Link from "next/link";
import { Logo } from "@/components/logo";
import { PrivacyPreferencesLink } from "@/components/privacy-preferences-link";
import { getCatalog } from "@/lib/catalog";

export async function SiteFooter() {
  const catalog = await getCatalog();
  const networkCopy = catalog.source === "unavailable"
    ? "Hip Medya yayın ağı, tek bir keşif ve abonelik deneyiminde buluşuyor."
    : `${catalog.stats.publications} farklı yayın kimliği, tek bir keşif ve abonelik deneyiminde buluşuyor.`;

  return (
    <footer className="site-footer site-footer--v2 site-footer--v3">
      <div className="page-shell site-footer__intro">
        <div><p className="footer-label">hiposta.</p><h2>Ne okuyacağını sen seç.<br />Biz doğru zamanda gönderelim.</h2></div>
        <p>{networkCopy}</p>
      </div>
      <div className="page-shell site-footer__grid">
        <div className="site-footer__brand"><Logo inverse compact /><p>İlgi alanın kadar posta.</p></div>
        <div><p className="footer-label">Keşfet</p><nav><Link href="/yayinlar">Yayınlar</Link><Link href="/bultenler">Bültenler</Link><Link href="/premium">Premium</Link></nav></div>
        <div><p className="footer-label">Hiposta</p><nav><Link href="/hakkimizda">Hakkımızda</Link><Link href="/iletisim">İletişim</Link><Link href="/yardim">Yardım Merkezi</Link></nav></div>
        <div><p className="footer-label">İş birlikleri</p><nav><Link href="/reklam-ver">Reklam Ver</Link><Link href="/reklam-ve-sponsorluk-ilkeleri">Sponsorluk ilkeleri</Link></nav></div>
        <div><p className="footer-label">İlkeler</p><nav><Link href="/yayin-ilkeleri">Yayın ilkeleri</Link><Link href="/duzeltme-politikasi">Düzeltme politikası</Link><Link href="/yapay-zeka-ilkeleri">Yapay zekâ ilkeleri</Link></nav></div>
        <div><p className="footer-label">Yasal</p><nav><Link href="/gizlilik-politikasi">Gizlilik</Link><Link href="/kvkk-aydinlatma-metni">KVKK</Link><Link href="/cerez-politikasi">Çerezler</Link><Link href="/kullanim-kosullari">Kullanım koşulları</Link><Link href="/uyelik-ve-abonelik-kosullari">Üyelik & abonelik</Link></nav></div>
      </div>
      <div className="page-shell site-footer__bottom">
        <span>© 2026 Hip Medya Limited Şirketi</span>
        <span>Hiposta · içerik, bülten ve üyelik platformu</span>
        <div><PrivacyPreferencesLink /><Link href="/yardim">Destek</Link><Link href="/iletisim">İletişim</Link></div>
      </div>
    </footer>
  );
}
