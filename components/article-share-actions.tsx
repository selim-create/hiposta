"use client";

import { Check, Link2, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

type Props = {
  url: string;
  title: string;
  description?: string;
  mode?: "rail" | "inline";
};

function copyFallback(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function ArticleShareActions({ url, title, description = "", mode = "rail" }: Props) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title} ${url}`);
  const trackShare = (shareChannel: string) => trackAnalyticsEvent({ eventType: "content_share", meta: { source: "article", share_channel: shareChannel } });

  async function copyLink() {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
      else copyFallback(url);
      trackShare("copy_link");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      copyFallback(url);
      trackShare("copy_link");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({ title, text: description || title, url });
      trackShare("native");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }

  const className = `article-share article-share--${mode}`;

  return (
    <div className={className} aria-label="İçeriği paylaş">
      <span className="article-share__label">Paylaş</span>
      <div className="article-share__actions">
        <a onClick={() => trackShare("x")} href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="X üzerinde paylaş" title="X üzerinde paylaş"><span aria-hidden="true" className="article-share__brand">X</span></a>
        <a onClick={() => trackShare("linkedin")} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn üzerinde paylaş" title="LinkedIn üzerinde paylaş"><span aria-hidden="true" className="article-share__brand">in</span></a>
        <a onClick={() => trackShare("facebook")} href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook üzerinde paylaş" title="Facebook üzerinde paylaş"><span aria-hidden="true" className="article-share__brand">f</span></a>
        <a onClick={() => trackShare("whatsapp")} href={`https://wa.me/?text=${encodedText}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ile paylaş" title="WhatsApp ile paylaş"><MessageCircle size={15} aria-hidden="true" /></a>
        <button type="button" onClick={nativeShare} aria-label="Paylaşım menüsünü aç" title="Paylaş"><Share2 size={15} aria-hidden="true" /></button>
        <button type="button" onClick={copyLink} aria-label="Bağlantıyı kopyala" title="Bağlantıyı kopyala">{copied ? <Check size={15} aria-hidden="true" /> : <Link2 size={15} aria-hidden="true" />}</button>
      </div>
      <span className="article-share__status" role="status" aria-live="polite">{copied ? "Bağlantı kopyalandı" : ""}</span>
    </div>
  );
}
