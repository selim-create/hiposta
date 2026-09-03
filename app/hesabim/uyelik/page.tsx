import type { Metadata } from "next";
import { Crown, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { getPremiumAccountState, premiumIntervalLabel } from "@/lib/premium";

export const metadata: Metadata = { title: "Üyelik", description: "Hiposta üyelik durumunu görüntüle." };

function statusLabel(status?: string | null) {
  if (status === "active") return "Aktif";
  if (status === "past_due") return "Ödeme bekliyor";
  if (status === "cancelled") return "İptal edildi";
  if (status === "expired") return "Sona erdi";
  if (status === "pending") return "Bekliyor";
  return "Ücretsiz";
}

export default async function MembershipPage() {
  const [session, premiumState] = await Promise.all([getAuthSession(), getPremiumAccountState()]);
  if (!session) return null;

  const entitlementPremium = session.entitlements.some((item) => item.entitlement_key === "premium");
  const premium = premiumState?.premium ?? entitlementPremium;
  const subscription = premiumState?.subscription ?? null;

  return (
    <>
      <div className="section-heading section-heading--rule"><div><p className="eyebrow">Üyelik</p><h2>Hiposta üyeliğin</h2></div><p>Premium erişim ve abonelik durumu Core tarafından yönetilir.</p></div>

      <div className="account-status-grid account-status-grid--summary">
        <article><Crown size={22} /><span>Plan</span><strong>{subscription?.plan?.name ?? (premium ? "Premium" : "Ücretsiz")}</strong><p>{subscription?.plan ? `${premiumIntervalLabel(subscription.plan.billing_interval)} üyelik` : premium ? "Premium içerik erişimin aktif." : "Ücretsiz hesap özelliklerin aktif."}</p></article>
        <article><ShieldCheck size={22} /><span>Durum</span><strong>{statusLabel(subscription?.status ?? (premium ? "active" : null))}</strong><p>{premiumState ? "Üyelik durumu Hiposta Core ile doğrulandı." : "Abonelik detayı şu anda alınamadı; mevcut erişim hakkın korunuyor."}</p></article>
        <article><Sparkles size={22} /><span>Satın alma</span><strong>{premiumState?.commerce_enabled ? "Hazırlanıyor" : "Henüz aktif değil"}</strong><p>PayTR sözleşmesi ve ödeme entegrasyonu tamamlanana kadar checkout açılmayacak.</p></article>
      </div>

      {!premium && (
        <section className="account-hub" style={{ marginTop: 28 }}>
          <div className="account-hub-card" style={{ cursor: "default" }}>
            <Crown size={20} />
            <div><strong>Premium yakında</strong><p>Fiyatlandırma ve ödeme akışı kesinleştiğinde üyelik ekranı üzerinden gerçek bilgilerle sunulacak.</p></div>
            <Link className="text-link" href="/premium">Premium’u keşfet</Link>
          </div>
        </section>
      )}
    </>
  );
}
