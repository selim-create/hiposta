import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Giriş yap", description: "Hiposta hesabına giriş yap." };

export default function LoginPage() {
  return (
    <section className="auth-page page-shell">
      <div className="auth-page__visual"><Logo inverse compact linked={false} /><span>17 yayın.<br />Tek hesap.</span><p>Bültenlerini yönet, premium içeriklerini oku ve kaldığın yerden devam et.</p></div>
      <div className="auth-page__panel"><p className="eyebrow">Tekrar hoş geldin</p><h1>Hiposta’ya<br />giriş yap.</h1><p>Hesabına giriş yaparak üyelik durumunu ve doğrulanmış bülten aboneliklerini tek yerden görüntüle.</p><AuthForm mode="login" /></div>
    </section>
  );
}
