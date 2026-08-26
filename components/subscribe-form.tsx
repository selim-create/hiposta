"use client";

import { FormEvent, useId, useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";

type SubscribeFormProps = {
  newsletterName: string;
  newsletterSlugs: string[];
  dark?: boolean;
  compact?: boolean;
};

export function SubscribeForm({ newsletterName, newsletterSlugs, dark = false, compact = false }: SubscribeFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const emailId = useId();
  const consentId = useId();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={`subscribe-success${dark ? " subscribe-success--dark" : ""}`} role="status">
        <span><Check size={18} /></span>
        <div>
          <strong>Postan hazırlanıyor.</strong>
          <p>{newsletterName} için doğrulama e-postası mock olarak gönderildi.</p>
        </div>
      </div>
    );
  }

  return (
    <form className={`subscribe-form${dark ? " subscribe-form--dark" : ""}${compact ? " subscribe-form--compact" : ""}`} onSubmit={submit}>
      <input type="hidden" name="newsletters" value={newsletterSlugs.join(",")} />
      <label htmlFor={emailId}>E-posta adresin</label>
      <div className="subscribe-form__row">
        <span><Mail size={17} /></span>
        <input id={emailId} name="email" type="email" placeholder="sen@ornek.com" autoComplete="email" required />
        <button type="submit">
          {compact ? "Abone ol" : "Ücretsiz abone ol"} <ArrowRight size={16} />
        </button>
      </div>
      <label className="consent" htmlFor={consentId}>
        <input id={consentId} type="checkbox" required />
        <span>Hiposta’nın seçtiğim bültenleri ve ilgili üyelik iletilerini göndermesini kabul ediyorum.</span>
      </label>
    </form>
  );
}
