"use client";

import { Bookmark, Check, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  contentId: number;
  returnPath: string;
};

type StatePayload = {
  ok?: boolean;
  data?: { saved?: boolean };
};

export function ArticleSaveAction({ contentId, returnPath }: Props) {
  const [saved, setSaved] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const response = await fetch(`/api/personalisation/content/${contentId}`, { cache: "no-store" });
        if (cancelled) return;
        if (response.status === 401) {
          setAuthenticated(false);
          return;
        }
        if (!response.ok) {
          setAuthenticated(null);
          return;
        }
        const payload = await response.json() as StatePayload;
        setAuthenticated(true);
        setSaved(Boolean(payload.data?.saved));
        void fetch(`/api/personalisation/content/${contentId}`, { method: "PATCH", cache: "no-store" });
      } catch {
        if (!cancelled) setAuthenticated(null);
      }
    }

    void initialize();
    return () => { cancelled = true; };
  }, [contentId]);

  async function toggle() {
    if (authenticated === false) {
      window.location.href = `/giris?next=${encodeURIComponent(returnPath)}`;
      return;
    }
    if (authenticated !== true || busy) return;

    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/personalisation/content/${contentId}`, {
        method: saved ? "DELETE" : "POST",
        cache: "no-store",
      });
      if (response.status === 401) {
        setAuthenticated(false);
        window.location.href = `/giris?next=${encodeURIComponent(returnPath)}`;
        return;
      }
      if (!response.ok) throw new Error("save_failed");
      const next = !saved;
      setSaved(next);
      setMessage(next ? "Kaydedildi" : "Kayıttan çıkarıldı");
      window.setTimeout(() => setMessage(""), 1800);
    } catch {
      setMessage("Şu anda kaydedilemedi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="article-save-action">
      <button
        type="button"
        className={saved ? "is-saved" : ""}
        onClick={toggle}
        disabled={busy || authenticated === null}
        aria-pressed={saved}
      >
        {busy ? <LoaderCircle size={15} className="spin" /> : saved ? <Check size={15} /> : <Bookmark size={15} />}
        <span>{saved ? "Kaydedildi" : authenticated === false ? "Kaydetmek için giriş yap" : "Kaydet"}</span>
      </button>
      <span role="status" aria-live="polite">{message}</span>
    </div>
  );
}
