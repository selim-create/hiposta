"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import Link from "next/link";

const errorText: Record<string, string> = {
  invalid_or_expired_token: "Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.",
  invalid_token: "Şifre sıfırlama bağlantısı geçersiz.",
  weak_password: "Yeni şifren en az 10 karakter olmalı.",
  rate_limited: "Çok fazla deneme yapıldı. Bir süre sonra tekrar dene.",
};

export function ResetPasswordForm({ token }: { token: string }) {
  const [validation, setValidation] = useState<"checking" | "valid" | "invalid">(token ? "checking" : "invalid");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const response = await fetch(`/api/auth/password/reset?token=${encodeURIComponent(token)}`, { cache: "no-store" });
        const payload = await response.json().catch(() => ({}));
        if (!active) return;
        if (response.ok && payload?.ok === true && payload?.valid === true) setValidation("valid");
        else {
          setValidation("invalid");
          setMessage(errorText[String(payload?.code ?? "")] ?? "Bu şifre sıfırlama bağlantısı kullanılamıyor.");
        }
      } catch {
        if (!active) return;
        setValidation("invalid");
        setMessage("Şifre sıfırlama bağlantısı kontrol edilemedi.");
      }
    })();
    return () => { active = false; };
  }, [token]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirm_password") ?? "");
    if (password !== confirmPassword) {
      setState("error");
      setMessage("Şifreler birbiriyle eşleşmiyor.");
      return;
    }
    try {
      const response = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok !== true) {
        setState("error");
        setMessage(errorText[String(payload?.code ?? "")] ?? "Şifre sıfırlanamadı. Tekrar deneyebilirsin.");
        return;
      }
      setState("success");
    } catch {
      setState("error");
      setMessage("Şifre sıfırlanamadı. Biraz sonra tekrar dene.");
    }
  }

  if (validation === "checking") return <div className="recovery-state"><LoaderCircle size={22} className="spin" /><p>Bağlantı kontrol ediliyor…</p></div>;
  if (validation === "invalid") return <div className="auth-success recovery-success"><h2>Bağlantı kullanılamıyor.</h2><p>{message || "Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş."}</p><Link className="button button--primary" href="/sifremi-unuttum">Yeni bağlantı iste</Link></div>;
  if (state === "success") return <div className="auth-success recovery-success" role="status"><CheckCircle2 size={32} /><h2>Şifren güncellendi.</h2><p>Tüm eski oturumlar kapatıldı. Yeni şifrenle tekrar giriş yapabilirsin.</p><Link className="button button--primary" href="/giris">Giriş yap <ArrowRight size={16} /></Link></div>;

  return (
    <form className="auth-form recovery-form" onSubmit={submit}>
      <label>Yeni şifren<input name="password" type="password" autoComplete="new-password" minLength={10} placeholder="En az 10 karakter" required disabled={state === "loading"} /></label>
      <label>Yeni şifren tekrar<input name="confirm_password" type="password" autoComplete="new-password" minLength={10} placeholder="Şifreni tekrar yaz" required disabled={state === "loading"} /></label>
      <button className="button button--primary auth-form__submit" type="submit" disabled={state === "loading"}>
        {state === "loading" ? <><LoaderCircle size={16} className="spin" /> Güncelleniyor</> : <>Yeni şifreyi kaydet <ArrowRight size={16} /></>}
      </button>
      {state === "error" && <p className="form-feedback form-feedback--error" role="alert">{message}</p>}
    </form>
  );
}
