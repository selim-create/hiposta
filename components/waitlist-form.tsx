"use client";

import { FormEvent, useId, useState } from "react";
import { ArrowRight, Check, LoaderCircle, Mail } from "lucide-react";

type Props = {
  publicationSlug: string;
  publicationName: string;
};

export function WaitlistForm({ publicationSlug, publicationName }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const emailId = useId();
  const consentId = useId();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const consent = form.get("consent") === "on";
    if (!email || !consent) return;

    setState("loading");
    setMessage("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, publication: publicationSlug, consent: true }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok === false) throw new Error(payload?.code || "waitlist_failed");
      setState("success");
      setMessage(`${publicationName} yayına başladığında sana haber vereceğiz.`);
    } catch {
      setState("error");
      setMessage("Haber ver isteği şu anda kaydedilemedi. Lütfen biraz sonra tekrar dene.");
    }
  }

  if (state === "success") {
    return <div className="subscribe-success" role="status"><span><Check size={18} /></span><div><strong>Listeye eklendin.</strong><p>{message}</p></div></div>;
  }

  return (
    <form className="subscribe-form" onSubmit={submit}>
      <label htmlFor={emailId}>E-posta adresin</label>
      <div className="subscribe-form__row">
        <span><Mail size={17} /></span>
        <input id={emailId} name="email" type="email" placeholder="sen@ornek.com" autoComplete="email" required disabled={state === "loading"} />
        <button type="submit" disabled={state === "loading"}>
          {state === "loading" ? <LoaderCircle size={16} className="spin" /> : <>Haber ver <ArrowRight size={16} /></>}
        </button>
      </div>
      <label className="consent" htmlFor={consentId}>
        <input id={consentId} name="consent" type="checkbox" required disabled={state === "loading"} />
        <span>Bu yayının açılışı ve ilgili Hiposta duyuruları için ileti almayı kabul ediyorum.</span>
      </label>
      {state === "error" && <p className="form-feedback form-feedback--error" role="alert">{message}</p>}
    </form>
  );
}
