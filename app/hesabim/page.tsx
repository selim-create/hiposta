import type { Metadata } from "next";
import { ArrowRight, Bookmark, CheckCircle2, Clock3, Compass, Crown, Mail, MailCheck, MailWarning, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Hesabım", description: "Hiposta hesabının özetini görüntüle ve kişisel modüllerine geç." };

const modules = [
  { href: "/hesabim/senin-icin", title: "Senin İçin", description: "Okuma ve kaydetme davranışlarınla şekillenen kişisel içerik akışın.", icon: Compass },
  { href: "/hesabim/kaydettiklerim", title: "Kaydettiklerim", description: "Daha sonra dönmek istediğin içeriklerden oluşan kişisel kütüphanen.", icon: Bookmark },
  { href: "/hesabim/okuma-gecmisi", title: "Okuma Geçmişi", description: "Son açtığın içerikleri kronolojik olarak yeniden bul.", icon: Clock3 },
  { href: "/hesabim/bultenler", title: "Bültenler", description: "Aktif bülten aboneliklerini ve gelen kutusu tercihlerini yönet.", icon: Mail },
  { href: "/hesabim/profil", title: "Profil", description: "Adını ve hesap bilgilerini güncelle.", icon: UserRound },
  { href: "/hesabim/guvenlik", title: "Güvenlik", description: "Şifreni ve e-posta doğrulama durumunu yönet.", icon: ShieldCheck },
];

export default async function AccountPage() {
  const session = await getAuthSession();
  if (!session) return null;

  const premium = session.entitlements.some((item) => item.entitlement_key === "premium");
  const activeSubscriptions = session.subscriptions.filter((item) => item.status === "active");

  return (
    <>
      <div className="account-status-grid account-status-grid--summary">
        <article>{session.account.email_verified ? <MailCheck size={22} /> : <MailWarning size={22} />}<span>E-posta</span><strong>{session.account.email_verified ? "Doğrulandı" : "Doğrulama bekliyor"}</strong><p>{session.account.email_verified ? "Hesabın doğrulanmış durumda." : "Güvenlik bölümünden doğrulama bağlantısını yeniden isteyebilirsin."}</p></article>
        <article><Crown size={22} /><span>Üyelik</span><strong>{premium ? "Premium" : "Ücretsiz"}</strong><p>{premium ? "Premium içerik erişimin aktif." : "Ücretsiz hesap özelliklerin aktif."}</p></article>
        <article><CheckCircle2 size={22} /><span>Aktif bülten</span><strong>{activeSubscriptions.length}</strong><p>Gelen kutuna bağlı aktif Hiposta bültenleri.</p></article>
      </div>

      <section className="account-hub">
        <div className="section-heading section-heading--rule"><div><p className="eyebrow">Hesap merkezi</p><h2>Ne yapmak istiyorsun?</h2></div><p>Her modülü ayrı bir alanda yönet; hesabın tek uzun sayfaya dönüşmesin.</p></div>
        <div className="account-hub__grid">
          {modules.map(({ href, title, description, icon: Icon }) => (
            <Link key={href} href={href} className="account-hub-card">
              <Icon size={20} />
              <div><strong>{title}</strong><p>{description}</p></div>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
