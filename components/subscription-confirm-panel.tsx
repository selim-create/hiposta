"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle, MailCheck } from "lucide-react";
import { useState } from "react";

type Props = { token: string; mode: "single" | "batch" };

type ConfirmPayload = {
  ok?: boolean;
  code?: string;
  status?: string;
  newsletter?: { slug?: string; name?: string };
  newsletters?: Array<{ slug?: string; name?: string }>;
};

export function SubscriptionConfirmPanel({ token, mode }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(token ? "idle" : "error");
  const [message, setMessage] = useState(token ? "" : "Doğrulama bağlantısı geçersiz.");
  const [result, setResult] = useState<ConfirmPayload | null>(null);

  async function confirm() {
    if (!token || state === "loading" || state === "success") return;
    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscriptions/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, mode }),
      });
      const payload = await response.json().catch(() => ({})) as ConfirmPayload;
      if (!response.ok || payload?.ok !== true) {
        setState("error");
        setMessage(
          payload?.code === "rate_limited"
            ? "Çok fazla doğrulama denemesi yapıldı. Birkaç dakika sonra tekrar deneyebilirsin."
            : "Bu doğrulama bağlantısı geçersiz, süresi dolmuş veya daha önce kullanılmış.",
        );
        return;
      }
      setResult(payload);
      setState("success");
    } catch {
      setState("error");
      setMessage("Doğrulama servisine ulaşılamadı. Biraz sonra tekrar deneyebilirsin.");
    }
  }

  if (state === "success") {
    const count = result?.newsletters?.length ?? (result?.newsletter ? 1 : 0);
    return (
      <div className="auth-success recovery-success" role="status">
        <CheckCircle2 size={32} />
        <h2>{count > 1 ? `${count} bülten aboneliğin doğrulandı.` : "Bülten aboneliğin doğrulandı."}</h2>
        <p>Seçtiğin bültenler artık Hiposta aboneliklerinde. Tercihlerini istediğin zaman hesabından yönetebilirsin.</p>
        <Link className="button button--primary" href="/bultenler">Bültenleri keşfet <ArrowRight size={16} /></Link>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="auth-success recovery-success">
        <h2>Doğrulama tamamlanamadı.</h2>
        <p>{message}</p>
        <Link className="button button--primary" href="/bultenler">Bültenlere dön</Link>
      </div>
    );
  }

  return (
    <div className="recovery-state">
      <MailCheck size={24} />
      <p>{mode === "batch" ? "Seçtiğin bültenlerin aboneliğini tek adımda doğrula." : "Bu bülten aboneliğini doğrula."}</p>
      <button className="button button--primary" type="button" onClick={confirm} disabled={state === "loading"}>
        {state === "loading" ? <><LoaderCircle size={16} className="spin" /> Doğrulanıyor</> : <>Aboneliği doğrula <ArrowRight size={16} /></>}
      </button>
    </div>
  );
}
