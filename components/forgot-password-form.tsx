"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    try {
      const response = await fetch("/api/auth/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok !== true) {
        setState("error");
        return;
      }
      setDeliveryAvailable(payload?.delivery_available !== false);
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="auth-success recovery-success" role="status">
        <CheckCircle2 size={32} />
        <h2>İsteğin alındı.</h2>
        <p>Bu e-posta adresiyle aktif bir hesap varsa şifre sıfırlama bağlantısı hazırlanmıştır.</p>
        {!deliveryAvailable && <p className="recovery-dev-note">E-posta gönderimi geliştirme ortamında henüz aktif değil.</p>}
        <Link className="button button--primary" href="/giris">Girişe dön <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <form className="auth-form recovery-form" onSubmit={submit}>
      <label>E-posta adresin<input name="email" type="email" autoComplete="email" placeholder="sen@ornek.com" required disabled={state === "loading"} /></label>
      <button className="button button--primary auth-form__submit" type="submit" disabled={state === "loading"}>
        {state === "loading" ? <><LoaderCircle size={16} className="spin" /> İşleniyor</> : <>Sıfırlama bağlantısı iste <ArrowRight size={16} /></>}
      </button>
      {state === "error" && <p className="form-feedback form-feedback--error" role="alert">İstek tamamlanamadı. Biraz sonra tekrar dene.</p>}
      <p className="auth-form__switch"><Link href="/giris">Giriş ekranına dön</Link></p>
    </form>
  );
}
