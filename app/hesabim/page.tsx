import type { Metadata } from "next";
import { CheckCircle2, Crown, MailCheck, MailWarning } from "lucide-react";
import { redirect } from "next/navigation";
import { AccountProfileForm } from "@/components/account-profile-form";
import { AccountSecurityPanel } from "@/components/account-security-panel";
import { NewsletterPreferences } from "@/components/newsletter-preferences";
import { LogoutButton } from "@/components/logout-button";
import { getAuthSession } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Hesabım", description: "Hiposta hesabını ve bülten tercihlerini yönet." };

export default async function AccountPage() {
  const [session, catalog] = await Promise.all([getAuthSession(), getCatalog()]);
  if (!session) redirect("/giris");

  const premium = session.entitlements.some((item) => item.entitlement_key === "premium");
  const activeSubscriptions = session.subscriptions.filter((item) => item.status === "active");
  const activeSlugs = new Set(activeSubscriptions.map((item) => item.newsletter_slug));
  const preferenceItems = catalog.newsletters
    .map((newsletter) => {
      const publication = catalog.publications.find((item) => item.slug === newsletter.publicationSlug && item.status === "active");
      if (!publication) return null;
      return { newsletter, publication, subscribed: activeSlugs.has(newsletter.slug) };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="account-page page-shell">
      <header className="account-hero">
        <div>
          <p className="eyebrow">Hiposta hesabı</p>
          <h1>{session.account.display_name || "Hesabın"}</h1>
          <p>{session.account.email}</p>
        </div>
        <LogoutButton />
      </header>

      <div className="account-status-grid">
        <article>
          {session.account.email_verified ? <MailCheck size={22} /> : <MailWarning size={22} />}
          <span>E-posta</span>
          <strong>{session.account.email_verified ? "Doğrulandı" : "Doğrulama bekliyor"}</strong>
          <p>{session.account.email_verified ? "Hesabın e-posta sahipliği doğrulandı." : "Doğrulama bağlantısını güvenlik bölümünden yeniden isteyebilirsin."}</p>
        </article>
        <article>
          <Crown size={22} />
          <span>Üyelik</span>
          <strong>{premium ? "Premium" : "Ücretsiz"}</strong>
          <p>{premium ? "Premium içerik erişimin aktif." : "Ücretsiz hesap ve bülten yönetimi aktif."}</p>
        </article>
        <article>
          <CheckCircle2 size={22} />
          <span>Aktif bülten</span>
          <strong>{activeSubscriptions.length}</strong>
          <p>Doğrulanmış ve aktif newsletter aboneliklerin.</p>
        </article>
      </div>

      <section className="account-section account-section--profile">
        <div className="section-heading section-heading--rule"><div><p className="eyebrow">Profil</p><h2>Hesap bilgilerin</h2></div></div>
        <AccountProfileForm displayName={session.account.display_name} email={session.account.email} />
      </section>

      <section className="account-section account-section--security">
        <div className="section-heading section-heading--rule"><div><p className="eyebrow">Güvenlik</p><h2>Hesap güvenliği</h2></div><p>Şifreni ve e-posta doğrulama durumunu buradan yönet.</p></div>
        <AccountSecurityPanel verified={session.account.email_verified} />
      </section>

      <section className="account-section account-section--preferences">
        <div className="section-heading section-heading--rule">
          <div><p className="eyebrow">Gelen kutun</p><h2>Bülten tercihlerin</h2></div>
          <p>Hiposta ağındaki aktif bültenleri tek yerden yönet.</p>
        </div>
        {preferenceItems.length ? (
          <NewsletterPreferences items={preferenceItems} verified={session.account.email_verified} />
        ) : (
          <div className="account-empty"><h3>Şu anda yönetilebilir bülten yok.</h3><p>Aktif Hiposta bültenleri burada görünecek.</p></div>
        )}
      </section>
    </section>
  );
}
