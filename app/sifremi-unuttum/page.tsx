import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Şifremi unuttum", description: "Hiposta hesabın için şifre sıfırlama bağlantısı iste." };

export default function ForgotPasswordPage() {
  return (
    <section className="auth-page page-shell recovery-page">
      <div className="auth-page__visual"><Logo inverse compact linked={false} /><span>Tek bağlantı.<br />Yeni şifre.</span><p>Hesabına yeniden güvenli şekilde erişebilmen için şifre sıfırlama akışını buradan başlat.</p></div>
      <div className="auth-page__panel"><p className="eyebrow">Hesap kurtarma</p><h1>Şifreni<br />yenile.</h1><p>E-posta adresini yaz. Bu adresle aktif bir hesap varsa güvenli bir sıfırlama bağlantısı hazırlanır.</p><ForgotPasswordForm /></div>
    </section>
  );
}
