"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [submitted, setSubmitted] = useState(false);
  const isRegister = mode === "register";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="auth-success" role="status">
        <CheckCircle2 size={32} />
        <h2>{isRegister ? "Hesabın mock olarak oluşturuldu." : "Demo oturumun açıldı."}</h2>
        <p>Bu prototipte gerçek kimlik doğrulama yapılmaz. Ürün akışını görmek için ana sayfaya dönebilirsin.</p>
        <Link className="button button--primary" href="/">Ana sayfaya dön <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {isRegister && (
        <label>
          Adın
          <input name="name" type="text" autoComplete="name" placeholder="Ad Soyad" required />
        </label>
      )}
      <label>
        E-posta adresin
        <input name="email" type="email" autoComplete="email" placeholder="sen@ornek.com" required />
      </label>
      <label>
        Şifren
        <input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={8} placeholder="En az 8 karakter" required />
      </label>
      {isRegister && (
        <label className="consent">
          <input type="checkbox" required />
          <span>Üyelik sözleşmesini ve kişisel veri bilgilendirmesini okudum.</span>
        </label>
      )}
      <button className="button button--primary auth-form__submit" type="submit">
        {isRegister ? "Ücretsiz hesap oluştur" : "Giriş yap"} <ArrowRight size={16} />
      </button>
      <p className="auth-form__switch">
        {isRegister ? "Zaten hesabın var mı?" : "Henüz hesabın yok mu?"}{" "}
        <Link href={isRegister ? "/giris" : "/kayit-ol"}>{isRegister ? "Giriş yap" : "Kayıt ol"}</Link>
      </p>
    </form>
  );
}
