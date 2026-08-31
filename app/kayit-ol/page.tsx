import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Kayıt ol", description: "Ücretsiz Hiposta hesabını oluştur." };

export default function RegisterPage() {
  return (
    <section className="auth-page page-shell">
      <div className="auth-page__visual auth-page__visual--yellow"><Logo compact linked={false} /><span>Okuma ritmini<br />sen belirle.</span><p>Seçtiğin bültenler, kaydettiğin içerikler ve premium üyeliğin tek profilde.</p></div>
      <div className="auth-page__panel"><p className="eyebrow">Ücretsiz hesap</p><h1>Hiposta’ya<br />katıl.</h1><p>Hesap ve ödeme altyapısı geliştirme aşamasında. Bu ekran kayıt deneyiminin ürün önizlemesini gösterir.</p><AuthForm mode="register" /></div>
    </section>
  );
}
