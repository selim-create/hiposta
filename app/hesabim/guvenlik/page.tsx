import type { Metadata } from "next";
import { AccountSecurityPanel } from "@/components/account-security-panel";
import { getAuthSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Güvenlik", description: "Hiposta hesap güvenliğini yönet." };

export default async function SecurityPage() {
  const session = await getAuthSession();
  if (!session) return null;
  return (
    <section className="account-section account-section--security">
      <div className="section-heading section-heading--rule"><div><p className="eyebrow">Güvenlik</p><h2>Hesap güvenliği</h2></div><p>Şifreni ve e-posta doğrulama durumunu buradan yönet.</p></div>
      <AccountSecurityPanel verified={session.account.email_verified} />
    </section>
  );
}
