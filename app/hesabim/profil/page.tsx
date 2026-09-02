import type { Metadata } from "next";
import { AccountProfileForm } from "@/components/account-profile-form";
import { getAuthSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Profil", description: "Hiposta profil bilgilerini yönet." };

export default async function ProfilePage() {
  const session = await getAuthSession();
  if (!session) return null;
  return (
    <section className="account-section account-section--profile">
      <div className="section-heading section-heading--rule"><div><p className="eyebrow">Profil</p><h2>Hesap bilgilerin</h2></div><p>Adını ve hesapta görünen temel bilgilerini buradan güncelle.</p></div>
      <AccountProfileForm displayName={session.account.display_name} email={session.account.email} />
    </section>
  );
}
