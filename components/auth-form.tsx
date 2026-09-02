"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import Link from "next/link";

const messages: Record<string, string> = {
  invalid_email: "Geçerli bir e-posta adresi gir.",
  weak_password: "Şifren en az 10 karakter olmalı.",
  account_exists: "Bu e-posta adresiyle zaten bir hesap var.",
  invalid_credentials: "E-posta adresi veya şifre hatalı.",
  rate_limited: "Çok fazla deneme yapıldı. Bir süre sonra tekrar dene.",
  service_unavailable: "Hesap servisine şu anda ulaşılamıyor. Biraz sonra tekrar dene.",
};

export function AuthForm({ mode, nextPath = "/hesabim" }: { mode: "login" | "register"; nextPath?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const isRegister = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setFeedback("");
    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
      display_name: String(form.get("name") ?? "").trim(),
    };

    try {
      const response = await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.ok === false) {
        setState("error");
        setFeedback(messages[String(data?.code ?? "")] ?? "İşlem tamamlanamadı. Bilgilerini kontrol edip tekrar dene.");
        return;
      }

      if (isRegister) {
        setState("success");
        setFeedback(data?.delivery_available === false
          ? "Hesabın oluşturuldu. Doğrulama bağlantısı hazırlandı; e-posta gönderimi geliştirme ortamında henüz aktif değil. Hesabına giriş yapabilirsin."
          : "Hesabın oluşturuldu. E-posta adresine gelen doğrulama bağlantısını aç.");
        return;
      }

      window.location.assign(nextPath);
    } catch {
      setState("error");
      setFeedback(messages.service_unavailable);
    }
  }

  if (state === "success" && isRegister) {
    return (
      <div className="auth-success" role="status">
        <CheckCircle2 size={32} />
        <h2>Hesabın oluşturuldu.</h2>
        <p>{feedback}</p>
        <Link className="button button--primary" href="/giris">Giriş yap <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {isRegister && <label>Adın<input name="name" type="text" autoComplete="name" placeholder="Ad Soyad" required disabled={state === "loading"} /></label>}
      <label>E-posta adresin<input name="email" type="email" autoComplete="email" placeholder="sen@ornek.com" required disabled={state === "loading"} /></label>
      <label>Şifren<input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={10} placeholder="En az 10 karakter" required disabled={state === "loading"} /></label>
      {!isRegister && <div className="auth-form__recovery"><Link href="/sifremi-unuttum">Şifremi unuttum</Link></div>}
      {isRegister && <label className="consent"><input type="checkbox" required disabled={state === "loading"} /><span>Üyelik sözleşmesini ve kişisel veri bilgilendirmesini okudum.</span></label>}
      <button className="button button--primary auth-form__submit" type="submit" disabled={state === "loading"}>
        {state === "loading" ? <><LoaderCircle size={16} className="spin" /> İşleniyor</> : <>{isRegister ? "Ücretsiz hesap oluştur" : "Giriş yap"} <ArrowRight size={16} /></>}
      </button>
      {state === "error" && <p className="form-feedback form-feedback--error" role="alert">{feedback}</p>}
      <p className="auth-form__switch">{isRegister ? "Zaten hesabın var mı?" : "Henüz hesabın yok mu?"} <Link href={isRegister ? "/giris" : "/kayit-ol"}>{isRegister ? "Giriş yap" : "Kayıt ol"}</Link></p>
    </form>
  );
}
