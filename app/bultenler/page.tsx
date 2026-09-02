import { NewsletterAccountManager } from "@/components/newsletter-account-manager";
import { NewsletterWizard } from "@/components/newsletter-wizard";
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
  const activeSlugs = session
    ? session.subscriptions.filter((item) => item.status === "active").map((item) => item.newsletter_slug)
    : [];

  return (
    <>
      <section className={`newsletter-directory-hero page-shell${session ? " newsletter-directory-hero--account" : ""}`}>
        {session ? (
          <>
            <div>
              <p className="eyebrow">{catalog.stats.activeNewsletters} aktif bülten · hesabına bağlı</p>
              <h1>Bültenlerini,<br /><span>tek yerden yönet.</span></h1>
            </div>
            <div>
              <p>Yeni bir onboarding tamamlamana gerek yok. Mevcut aboneliklerini gör, paketlerle hızlı seçim yap ve değişikliklerini hesabına kaydet.</p>
              <dl><div><dt>{String(activeSlugs.length).padStart(2, "0")}</dt><dd>Aktif bülten</dd></div><div><dt>01</dt><dd>Seçimini düzenle</dd></div><div><dt>02</dt><dd>Değişiklikleri kaydet</dd></div></dl>
            </div>
          </>
        ) : (
          <>
            <div><p className="eyebrow">{catalog.stats.activeNewsletters} bülten · {catalog.stats.categories} kategori</p><h1>Gelen kutun,<br /><span>senin yayın akışın.</span></h1></div>
            <div><p>İlgi alanlarını seç, sana uygun bültenleri keşfet ve tek bir akışta aboneliklerini tamamla. Hesap açmadan da ücretsiz bültenlere abone olabilirsin.</p><dl><div><dt>01</dt><dd>İlgi alanını seç</dd></div><div><dt>02</dt><dd>Önerileri düzenle</dd></div><div><dt>03</dt><dd>Seçimini onayla</dd></div></dl></div>
          </>
        )}
      </section>

      <section className="newsletter-directory newsletter-directory--wizard page-shell">
        {session ? (
          <NewsletterAccountManager
            email={session.account.email}
            verified={session.account.email_verified}
            activeSlugs={activeSlugs}
            newsletters={catalog.newsletters}
            bundles={catalog.bundles}
            publications={catalog.publications}
          />
        ) : (
          <NewsletterWizard categories={catalog.categories} newsletters={catalog.newsletters} bundles={catalog.bundles} publications={catalog.publications} />
        )}
      </section>
    </>
  );
}
