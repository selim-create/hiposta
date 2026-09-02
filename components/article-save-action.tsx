"use client";

import { Bookmark, Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { shouldTrackContentView, trackAnalyticsEvent } from "@/lib/analytics";

type Props = {
  contentId: number;
  returnPath: string;
};

type StatePayload = {
  ok?: boolean;
  data?: { saved?: boolean };
};

export function ArticleSaveAction({ contentId, returnPath }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (shouldTrackContentView(contentId)) {
      trackAnalyticsEvent({ eventType: "content_view", contentId, meta: { source: "article" } });
      if (document.querySelector(".paywall")) {
        trackAnalyticsEvent({ eventType: "premium_gate_view", contentId, meta: { source: "article", access_level: "premium" } });
      }
    }

    const premiumCta = document.querySelector<HTMLAnchorElement>(".paywall .button--yellow");
    const onPremiumClick = () => trackAnalyticsEvent({ eventType: "premium_cta_click", contentId, meta: { source: "article", cta_variant: "paywall_primary" } });
    premiumCta?.addEventListener("click", onPremiumClick);

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
    return () => {
      cancelled = true;
      premiumCta?.removeEventListener("click", onPremiumClick);
    };
  }, [contentId]);

  async function toggle() {
    if (authenticated === false) {
      router.push(`/giris?next=${encodeURIComponent(returnPath)}`);
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
        router.push(`/giris?next=${encodeURIComponent(returnPath)}`);
        return;
      }
      if (!response.ok) throw new Error("save_failed");
      const next = !saved;
      setSaved(next);
      trackAnalyticsEvent({ eventType: next ? "content_save" : "content_unsave", contentId, meta: { source: "article" } });
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
