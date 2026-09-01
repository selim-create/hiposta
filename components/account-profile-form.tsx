"use client";

import { FormEvent, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AccountProfileForm({ displayName, email }: { displayName: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(displayName);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    setMessage("");
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: name }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok !== true) throw new Error(String(payload?.code || "update_failed"));
      setState("saved");
      setMessage("Profil bilgilerin güncellendi.");
      router.refresh();
    } catch {
      setState("error");
      setMessage("Profil güncellenemedi. Tekrar deneyebilirsin.");
    }
  }

  return (
    <form className="account-profile-form" onSubmit={submit}>
      <div>
        <label htmlFor="account-display-name">Adın</label>
        <input id="account-display-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={120} autoComplete="name" />
      </div>
      <div>
        <label>E-posta</label>
        <input value={email} disabled readOnly />
        <small>E-posta adresi bu sürümde değiştirilemiyor.</small>
      </div>
      <div className="account-profile-form__actions">
        <button className="button button--primary" type="submit" disabled={state === "saving"}>
          {state === "saving" ? <><Loader2 size={15} className="spin" /> Kaydediliyor</> : <><Check size={15} /> Profili kaydet</>}
        </button>
        {message && <span className={`account-form-message account-form-message--${state}`}>{message}</span>}
      </div>
    </form>
  );
}
