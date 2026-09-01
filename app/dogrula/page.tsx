import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { VerifyAccountPanel } from "@/components/verify-account-panel";

export const metadata: Metadata = { title: "E-posta doğrulama", description: "Hiposta hesabının e-posta adresini doğrula." };

type Props = { searchParams: Promise<{ token?: string }> };

export default async function VerifyPage({ searchParams }: Props) {
  const { token = "" } = await searchParams;
  return (
    <section className="auth-page page-shell recovery-page">
      <div className="auth-page__visual"><Logo inverse compact linked={false} /><span>E-posta doğrula.<br />Hesabını bağla.</span><p>Doğrulama, hesabının bülten ve üyelik verileriyle güvenli şekilde eşleşmesini sağlar.</p></div>
      <div className="auth-page__panel"><p className="eyebrow">E-posta güvenliği</p><h1>Hesabını<br />doğrula.</h1><p>Doğrulama bağlantın tek kullanımlıdır ve güvenli account lifecycle’ın bir parçasıdır.</p><VerifyAccountPanel token={token} /></div>
    </section>
  );
}
