import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountNavigation } from "@/components/account-navigation";
import { LogoutButton } from "@/components/logout-button";
import { getAuthSession } from "@/lib/auth";
import { privateRobotsMetadata } from "@/lib/seo";

export const metadata = privateRobotsMetadata;

export default async function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getAuthSession();
  if (!session) redirect("/giris");

  return (
    <section className="account-page account-page--hub page-shell">
      <header className="account-hero account-hero--compact">
        <div>
          <p className="eyebrow">Hiposta hesabı</p>
          <h1>{session.account.display_name || "Hesabın"}</h1>
          <p>{session.account.email}</p>
        </div>
        <LogoutButton />
      </header>
      {!session.account.email_verified && (
        <aside className="account-verification-banner" role="status" aria-live="polite">
          <div>
            <span>E-posta doğrulaması bekleniyor</span>
            <strong>Hesabını tamamlamak için e-posta adresini doğrula.</strong>
            <p>Doğrulama tamamlanana kadar bülten ve üyelik verilerin hesabına bağlanmaz; kişiselleştirme ve üyelik özellikleri sınırlı kalır.</p>
          </div>
          <Link href="/hesabim/guvenlik?verification=pending">Doğrulamayı tamamla →</Link>
        </aside>
      )}
      <AccountNavigation />
      <div className="account-module">{children}</div>
    </section>
  );
}
