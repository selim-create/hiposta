import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = { title: "Şifre sıfırla", description: "Hiposta hesabın için yeni bir şifre belirle." };

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token = "" } = await searchParams;
  return (
    <section className="auth-page page-shell recovery-page">
      <div className="auth-page__visual auth-page__visual--yellow"><Logo compact linked={false} /><span>Yeni şifre.<br />Temiz başlangıç.</span><p>Bağlantın doğrulandıktan sonra yeni şifreni belirle. Başarılı sıfırlama tüm eski oturumlarını kapatır.</p></div>
      <div className="auth-page__panel"><p className="eyebrow">Hesap güvenliği</p><h1>Yeni şifreni<br />belirle.</h1><p>Yeni şifren en az 10 karakter olmalı ve bu bağlantı yalnız bir kez kullanılabilir.</p><ResetPasswordForm token={token} /></div>
    </section>
  );
}
