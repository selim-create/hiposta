import type { Metadata } from "next";
import { CheckCircle2, Crown, MailCheck, MailWarning } from "lucide-react";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { getAuthSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Hesabım", description: "Hiposta hesabını ve bülten tercihlerini yönet." };

export default async function AccountPage() {
  const session = await getAuthSession();
  if (!session) redirect("/giris");

  const premium = session.entitlements.some((item) => item.entitlement_key === "premium");
  const activeSubscriptions = session.subscriptions.filter((item) => item.status === "active");

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
          <p>{session.account.email_verified ? "Hesabın e-posta sahipliği doğrulandı." : "Doğrulama gönderimi geliştirme ortamında henüz aktif değil."}</p>
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
          <p>Doğrulanmış newsletter aboneliklerin burada görünür.</p>
        </article>
      </div>

      <section className="account-section">
        <div className="section-heading section-heading--rule"><div><p className="eyebrow">Tercihlerin</p><h2>Bülten aboneliklerin</h2></div></div>
        {!session.account.email_verified ? (
          <div className="account-empty"><h3>E-posta doğrulaması gerekli.</h3><p>Mevcut Subscriber kaydın ve aboneliklerin, e-posta sahipliği doğrulanmadan hesabına bağlanmaz.</p></div>
        ) : session.subscriptions.length ? (
          <div className="account-subscriptions">
            {session.subscriptions.map((item) => (
              <article key={`${item.publication_slug}-${item.newsletter_slug}`}>
                <div><small>{item.publication_name}</small><strong>{item.newsletter_name}</strong></div>
                <span className={`account-subscription-status account-subscription-status--${item.status}`}>{item.status === "active" ? "Aktif" : item.status}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="account-empty"><h3>Henüz bağlı bir bülten yok.</h3><p>Bülten seçimlerini Hiposta Bülten Merkezi’nden yapabilirsin.</p></div>
        )}
      </section>
    </section>
  );
}
