"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import Link from "next/link";

export function VerifyAccountPanel({ token }: { token: string }) {
  const [state, setState] = useState<"checking" | "success" | "error">(token ? "checking" : "error");
  const [message, setMessage] = useState(token ? "" : "Doğrulama bağlantısı geçersiz.");

  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!active) return;
        if (response.ok && payload?.ok === true) setState("success");
        else {
          setState("error");
          setMessage("Bu doğrulama bağlantısı geçersiz, süresi dolmuş veya daha önce kullanılmış.");
        }
      } catch {
        if (!active) return;
        setState("error");
        setMessage("Doğrulama servisine ulaşılamadı. Biraz sonra tekrar deneyebilirsin.");
      }
    })();
    return () => { active = false; };
  }, [token]);

  if (state === "checking") return <div className="recovery-state"><LoaderCircle size={22} className="spin" /><p>E-posta adresin doğrulanıyor…</p></div>;
  if (state === "success") return <div className="auth-success recovery-success" role="status"><CheckCircle2 size={32} /><h2>E-posta adresin doğrulandı.</h2><p>Hesabın artık bülten abonelikleri ve üyelik erişimleriyle güvenli şekilde ilişkilendirilebilir.</p><Link className="button button--primary" href="/giris">Giriş yap <ArrowRight size={16} /></Link></div>;
  return <div className="auth-success recovery-success"><h2>Doğrulama tamamlanamadı.</h2><p>{message}</p><Link className="button button--primary" href="/giris">Giriş ekranına dön</Link></div>;
}
