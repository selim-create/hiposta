"use client";

import Link from "next/link";
import { Check, Loader2, MailPlus } from "lucide-react";
import { useState } from "react";

type Props = {
  slug: string;
  name: string;
  verified: boolean;
  subscribed: boolean;
};

export function AccountNewsletterCta({ slug, name, verified, subscribed: initialSubscribed }: Props) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function subscribe() {
    if (!verified || subscribed || pending) return;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch(`/api/auth/preferences/newsletters/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscribed: true }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok !== true) throw new Error(String(payload?.code || "update_failed"));
      setSubscribed(true);
      setMessage(`${name} bültenine aboneliğin açıldı.`);
    } catch (error) {
      const code = error instanceof Error ? error.message : "update_failed";
      setMessage(code === "suppressed" ? "Bu e-posta adresi gönderim engelinde olduğu için abonelik açılamıyor." : "Abonelik açılamadı. Tekrar deneyebilirsin.");
    } finally {
      setPending(false);
    }
  }

  if (subscribed) {
    return <div className="subscribe-success" role="status"><span><Check size={18} /></span><div><strong>Bu bülteni takip ediyorsun.</strong><p><Link href="/hesabim/bultenler">Bülten tercihlerini yönet</Link></p></div></div>;
  }

  if (!verified) {
    return <div className="account-empty"><h3>Tek tıkla abonelik için e-postanı doğrula.</h3><p>Hesabını doğruladıktan sonra e-posta adresini yeniden girmeden bu bülteni takip edebilirsin.</p><Link href="/hesabim/profil">Hesabını kontrol et</Link></div>;
  }

  return (
    <div>
      <button className="button button--yellow" type="button" disabled={pending} onClick={subscribe}>
        {pending ? <Loader2 size={15} className="spin" /> : <MailPlus size={15} />} Tek tıkla abone ol
      </button>
      {message ? <p className="form-feedback" role="status">{message}</p> : null}
    </div>
  );
}
