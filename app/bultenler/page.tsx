import Link from "next/link";
import { NewsletterAccountManager } from "@/components/newsletter-account-manager";
import { NewsletterGuestWizard } from "@/components/newsletter-guest-wizard";
import { getAuthSession } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({
  title: "Bültenler",
  description: "İlgi alanına, gününe ve okuma ritmine göre Hiposta bültenlerini seç.",
  path: "/bultenler",
});

export default async function NewslettersPage() {
  const [catalog, session] = await Promise.all([getCatalog(), getAuthSession()]);
  const catalogAvailable = catalog.source !== "unavailable";
  const activeSlugs = session
    ? session.subscriptions.filter((item) => item.status === "active").map((item) => item.newsletter_slug)
    : [];

  return (
    <>
      <section className={`newsletter-directory-hero page-shell${session ? " newsletter-directory-hero--account" : ""}`}>
        {session ? (
          <>
            <div>
              <p className="eyebrow">{catalogAvailable ? `${catalog.stats.activeNewsletters} aktif bülten · hesabına bağlı` : "Bülten ağına şu anda ulaşılamıyor"}</p>
              <h1>Bültenlerini,<br /><span>tek yerden yönet.</span></h1>
            </div>
            <div>
              <p>Yeni bir onboarding tamamlamana gerek yok. Mevcut aboneliklerini gör, paketlerle hızlı seçim yap ve değişikliklerini hesabına kaydet.</p>
              <dl><div><dt>{String(activeSlugs.length).padStart(2, "0")}</dt><dd>Aktif bülten</dd></div><div><dt>01</dt><dd>Seçimini düzenle</dd></div><div><dt>02</dt><dd>Değişiklikleri kaydet</dd></div></dl>
            </div>
          </>
        ) : (
          <>
            <div><p className="eyebrow">{catalogAvailable ? `${catalog.stats.activeNewsletters} bülten · ${catalog.stats.categories} kategori` : "Hiposta bülten ağı"}</p><h1>Gelen kutun,<br /><span>senin yayın akışın.</span></h1></div>
            <div><p>Önce ilgi alanını, sonra takip etmek istediğin yayınları seç. Yalnızca sana uygun bültenleri gör, istersen hazır paketlerle seçimini genişlet ve tek adımda tamamla.</p><dl><div><dt>01</dt><dd>İlgi alanını seç</dd></div><div><dt>02</dt><dd>Yayınlarını belirle</dd></div><div><dt>03</dt><dd>Bültenlerini oluştur</dd></div></dl></div>
          </>
        )}
      </section>

      <section className="newsletter-directory newsletter-directory--wizard page-shell">
        {!catalogAvailable ? (
          <div className="empty-state"><span>H</span><h2>Bülten kataloğuna şu anda ulaşılamıyor.</h2><p>Seçimlerini eksik veriyle göstermiyoruz. Bağlantı yeniden kurulduğunda bültenlerini burada yönetebilirsin.</p></div>
        ) : session ? (
          <NewsletterAccountManager
            email={session.account.email}
            verified={session.account.email_verified}
            activeSlugs={activeSlugs}
            newsletters={catalog.newsletters}
            bundles={catalog.bundles}
            publications={catalog.publications}
          />
        ) : (
          <>
            <NewsletterGuestWizard categories={catalog.categories} newsletters={catalog.newsletters} bundles={catalog.bundles} publications={catalog.publications} />
            <p className="legal-inline-notice legal-inline-notice--wizard">Bülten seçimi sırasında verdiğin e-posta ve tercihlerin nasıl işlendiğini <Link href="/kvkk-aydinlatma-metni" target="_blank">KVKK Aydınlatma Metni</Link>, abonelik kurallarını <Link href="/uyelik-ve-abonelik-kosullari" target="_blank">Üyelik ve Abonelik Koşulları</Link> açıklar.</p>
          </>
        )}
      </section>
    </>
  );
}
