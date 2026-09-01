"use client";

import { FormEvent, useState } from "react";
import { Check, Loader2, MailCheck, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const passwordMessages: Record<string, string> = {
  invalid_current_password: "Mevcut şifren doğru değil.",
  weak_password: "Yeni şifren en az 10 karakter olmalı.",
  password_unchanged: "Yeni şifren mevcut şifrenle aynı olamaz.",
  rate_limited: "Çok fazla deneme yapıldı. Bir süre sonra tekrar dene.",
  unauthorized: "Oturumun sona ermiş. Tekrar giriş yapman gerekiyor.",
};

export function AccountSecurityPanel({ verified }: { verified: boolean }) {
  const router = useRouter();
  const [passwordState, setPasswordState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [verifyState, setVerifyState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [verifyMessage, setVerifyMessage] = useState("");

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordState("loading");
    setPasswordMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get("current_password") ?? "");
    const newPassword = String(data.get("new_password") ?? "");
    const confirmPassword = String(data.get("confirm_password") ?? "");
    if (newPassword !== confirmPassword) {
      setPasswordState("error");
      setPasswordMessage("Yeni şifreler birbiriyle eşleşmiyor.");
      return;
    }
    try {
      const response = await fetch("/api/auth/password/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok !== true) {
        const code = String(payload?.code ?? "update_failed");
        setPasswordState("error");
        setPasswordMessage(passwordMessages[code] ?? "Şifre güncellenemedi. Tekrar deneyebilirsin.");
        if (code === "unauthorized") router.push("/giris");
        return;
      }
      form.reset();
      setPasswordState("success");
      setPasswordMessage("Şifren güncellendi. Diğer açık oturumların kapatıldı.");
    } catch {
      setPasswordState("error");
      setPasswordMessage("Şifre güncellenemedi. Biraz sonra tekrar dene.");
    }
  }

  async function resendVerification() {
    setVerifyState("loading");
    setVerifyMessage("");
    try {
      const response = await fetch("/api/auth/verification/resend", { method: "POST" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok !== true) {
        const code = String(payload?.code ?? "send_failed");
        if (code === "already_verified") {
          setVerifyState("success");
          setVerifyMessage("E-posta adresin zaten doğrulanmış.");
          router.refresh();
          return;
        }
        setVerifyState("error");
        setVerifyMessage(code === "rate_limited" ? "Çok fazla istek yapıldı. Bir süre sonra tekrar dene." : "Doğrulama bağlantısı hazırlanamadı.");
        return;
      }
      setVerifyState("success");
      setVerifyMessage(payload?.delivery_available === false
        ? "Yeni doğrulama bağlantısı hazırlandı; e-posta gönderimi geliştirme ortamında henüz aktif değil."
        : "Yeni doğrulama bağlantısı e-posta adresine gönderildi.");
    } catch {
      setVerifyState("error");
      setVerifyMessage("Doğrulama isteği tamamlanamadı. Biraz sonra tekrar dene.");
    }
  }

  return (
    <div className="account-security-grid">
      <article className="account-security-card">
        <ShieldCheck size={22} />
        <div><p className="eyebrow">Şifre</p><h3>Şifreni değiştir</h3><p>Mevcut şifreni doğrulayarak yeni bir şifre belirle. En az 10 karakter kullan.</p></div>
        <form className="account-security-form" onSubmit={changePassword}>
          <label>Mevcut şifren<input name="current_password" type="password" autoComplete="current-password" required disabled={passwordState === "loading"} /></label>
          <label>Yeni şifren<input name="new_password" type="password" autoComplete="new-password" minLength={10} required disabled={passwordState === "loading"} /></label>
          <label>Yeni şifren tekrar<input name="confirm_password" type="password" autoComplete="new-password" minLength={10} required disabled={passwordState === "loading"} /></label>
          <button className="button button--primary" type="submit" disabled={passwordState === "loading"}>{passwordState === "loading" ? <><Loader2 size={15} className="spin" /> Güncelleniyor</> : <><Check size={15} /> Şifreyi güncelle</>}</button>
          {passwordMessage && <p className={`account-security-message account-security-message--${passwordState}`} role="status">{passwordMessage}</p>}
        </form>
      </article>

      <article className="account-security-card">
        <MailCheck size={22} />
        <div><p className="eyebrow">E-posta güvenliği</p><h3>{verified ? "E-posta doğrulandı" : "Doğrulama bekliyor"}</h3><p>{verified ? "E-posta sahipliğin doğrulandı. Bülten ve üyelik verilerin hesabına güvenli şekilde bağlı." : "Bülten tercihlerini ve üyelik verilerini hesabına bağlamak için e-posta adresini doğrula."}</p></div>
        {!verified && <button className="button button--secondary" type="button" onClick={resendVerification} disabled={verifyState === "loading"}>{verifyState === "loading" ? <><Loader2 size={15} className="spin" /> Hazırlanıyor</> : "Doğrulama bağlantısını yeniden iste"}</button>}
        {verifyMessage && <p className={`account-security-message account-security-message--${verifyState}`} role="status">{verifyMessage}</p>}
      </article>
    </div>
  );
}
