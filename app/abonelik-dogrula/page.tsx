import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { SubscriptionConfirmPanel } from "@/components/subscription-confirm-panel";

export const metadata: Metadata = {
  title: "Bülten aboneliğini doğrula",
  description: "Hiposta bülten aboneliğini güvenli şekilde doğrula.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string; mode?: string }> };

export default async function SubscriptionConfirmPage({ searchParams }: Props) {
  const { token = "", mode = "single" } = await searchParams;
  const safeMode = mode === "batch" ? "batch" : "single";

  return (
    <section className="auth-page page-shell recovery-page">
      <div className="auth-page__visual">
        <Logo inverse compact linked={false} />
        <span>Bültenini doğrula.<br />Gelen kutuna ekle.</span>
        <p>Doğrulama işlemi yalnız bu sayfadaki butona bastığında tamamlanır.</p>
      </div>
      <div className="auth-page__panel">
        <p className="eyebrow">Bülten doğrulama</p>
        <h1>Seçimini<br />tamamla.</h1>
        <p>Hiposta bülten tercihini onaylamak için aşağıdaki güvenli doğrulama adımını tamamla.</p>
        <SubscriptionConfirmPanel token={token} mode={safeMode} />
      </div>
    </section>
  );
}
