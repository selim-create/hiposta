"use client";

import { FormEvent, useId, useState } from "react";
import { ArrowRight, Check, LoaderCircle, Mail } from "lucide-react";

type SubscribeFormProps = {
  newsletterName: string;
  newsletterSlugs: string[];
  dark?: boolean;
  compact?: boolean;
};

export function SubscribeForm({ newsletterName, newsletterSlugs, dark = false, compact = false }: SubscribeFormProps) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const emailId = useId();
  const consentId = useId();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const consent = form.get("consent") === "on";
    if (!email || !consent || !newsletterSlugs.length) return;

    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newsletters: newsletterSlugs, consent: true }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.code || "subscription_failed");
      }
      setState("success");
      setMessage(payload?.delivery_available === false
        ? "Seçimin kaydedildi. Doğrulama e-postası gönderimi yakında etkinleşecek."
        : "Seçimin kaydedildi. Gelen kutundaki doğrulama bağlantısını onayla.");
    } catch {
      setState("error");
      setMessage("Abonelik isteği şu anda tamamlanamadı. Lütfen biraz sonra tekrar dene.");
    }
  }

  if (state === "success") {
    return (
      <div className={`subscribe-success${dark ? " subscribe-success--dark" : ""}`} role="status">
        <span><Check size={18} /></span>
        <div>
          <strong>Postan hazırlanıyor.</strong>
          <p>{newsletterName}: {message}</p>
        </div>
      </div>
    );
  }

  return (
    <form className={`subscribe-form${dark ? " subscribe-form--dark" : ""}${compact ? " subscribe-form--compact" : ""}`} onSubmit={submit}>
      <label htmlFor={emailId}>E-posta adresin</label>
      <div className="subscribe-form__row">
        <span><Mail size={17} /></span>
        <input id={emailId} name="email" type="email" placeholder="sen@ornek.com" autoComplete="email" required disabled={state === "loading"} />
        <button type="submit" disabled={state === "loading"}>
          {state === "loading" ? <LoaderCircle size={16} className="spin" /> : compact ? "Abone ol" : "Ücretsiz abone ol"} {state !== "loading" && <ArrowRight size={16} />}
        </button>
      </div>
      <label className="consent" htmlFor={consentId}>
        <input id={consentId} name="consent" type="checkbox" required disabled={state === "loading"} />
        <span>Hiposta’nın seçtiğim bültenleri ve ilgili üyelik iletilerini göndermesini kabul ediyorum.</span>
      </label>
      {state === "error" && <p className="form-feedback form-feedback--error" role="alert">{message}</p>}
    </form>
  );
}
