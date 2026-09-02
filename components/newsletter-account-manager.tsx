"use client";

import type { CSSProperties } from "react";
import { Check, CheckCircle2, LoaderCircle, Minus, Plus, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PublicationLogo } from "@/components/publication-logo";
import type { Newsletter, NewsletterBundle, Publication } from "@/lib/types";

type Props = {
  email: string;
  verified: boolean;
  activeSlugs: string[];
  newsletters: Newsletter[];
  bundles: NewsletterBundle[];
  publications: Publication[];
};

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export function NewsletterAccountManager({ email, verified, activeSlugs, newsletters, bundles, publications }: Props) {
  const activePublicationSlugs = useMemo(
    () => new Set(publications.filter((item) => item.status !== "inactive" && !item.isComingSoon).map((item) => item.slug)),
    [publications],
  );
  const availableNewsletters = useMemo(
    () => newsletters.filter((item) => activePublicationSlugs.has(item.publicationSlug)),
    [activePublicationSlugs, newsletters],
  );
  const availableSlugs = useMemo(() => new Set(availableNewsletters.map((item) => item.slug)), [availableNewsletters]);
  const initial = useMemo(() => activeSlugs.filter((slug) => availableSlugs.has(slug)), [activeSlugs, availableSlugs]);

  const [selected, setSelected] = useState<string[]>(initial);
  const [saved, setSaved] = useState<string[]>(initial);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const dirty = useMemo(() => [...selected].sort().join("|") !== [...saved].sort().join("|"), [saved, selected]);

  function publicationFor(newsletter: Newsletter) {
    return publications.find((item) => item.slug === newsletter.publicationSlug);
  }

  function toggleNewsletter(slug: string) {
    if (!verified || state === "loading") return;
    setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
    setState("idle");
    setFeedback("");
  }

  function toggleBundle(bundle: NewsletterBundle) {
    if (!verified || state === "loading") return;
    const slugs = bundle.newsletterSlugs.filter((slug) => availableSlugs.has(slug));
    if (!slugs.length) return;
    const allSelected = slugs.every((slug) => selected.includes(slug));
    setSelected((current) => allSelected ? current.filter((slug) => !slugs.includes(slug)) : unique([...current, ...slugs]));
    setState("idle");
    setFeedback("");
  }

  async function saveChanges() {
    if (!verified || !dirty || state === "loading") return;

    const previous = new Set(saved);
    const target = new Set(selected);
    const changes = availableNewsletters
      .map((newsletter) => ({ slug: newsletter.slug, subscribed: target.has(newsletter.slug) }))
      .filter((item) => previous.has(item.slug) !== item.subscribed);

    setState("loading");
    setFeedback("");

    try {
      for (const change of changes) {
        const response = await fetch(`/api/auth/preferences/newsletters/${encodeURIComponent(change.slug)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscribed: change.subscribed }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload?.ok !== true) {
          const code = String(payload?.code || "update_failed");
          if (code === "verification_required") throw new Error("verification_required");
          if (code === "suppressed") throw new Error("suppressed");
          throw new Error("update_failed");
        }
      }

      setSaved(selected);
      setState("success");
      setFeedback("Bülten tercihlerin güncellendi.");
    } catch (error) {
      const code = error instanceof Error ? error.message : "update_failed";
      setState("error");
      setFeedback(
        code === "verification_required"
          ? "Tercihleri değiştirmek için e-posta doğrulaması gerekli."
          : code === "suppressed"
            ? "Bu e-posta adresi gönderim engelinde olduğu için yeniden abonelik açılamıyor."
            : "Tercihler tamamen güncellenemedi. Hesabım ekranındaki mevcut durumu kontrol edip tekrar deneyebilirsin.",
      );
    }
  }

  return (
    <div className="newsletter-account-manager">
      <section className="newsletter-account-status">
        <div className="newsletter-account-status__identity">
          {verified ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
          <div><small>Hiposta hesabı</small><strong>{email}</strong><span>{verified ? "Doğrulanmış hesap" : "E-posta doğrulaması bekliyor"}</span></div>
        </div>
        <div className="newsletter-account-status__count"><strong>{selected.length}</strong><span>aktif bülten</span></div>
        <Link href="/hesabim">Hesabım →</Link>
      </section>

      {!verified && <section className="newsletter-account-verify">
        <ShieldAlert size={25} />
        <div><h2>Tercihlerini değiştirmek için e-postanı doğrula.</h2><p>Mevcut bültenlerini görebilirsin; yeni abonelik açma veya kapatma işlemi doğrulanmış hesap gerektiriyor.</p></div>
        <Link className="button button--primary" href="/hesabim">Doğrulamaya git</Link>
      </section>}

      {!!bundles.length && <section className="newsletter-account-bundles">
        <header><p className="eyebrow">Hızlı seçim</p><h2>Hazır bülten paketleri</h2><p>Paket seçimi ayrı abonelik oluşturmaz; içindeki bültenleri tek tek açar veya kapatır.</p></header>
        <div>
          {bundles.map((bundle) => {
            const slugs = bundle.newsletterSlugs.filter((slug) => availableSlugs.has(slug));
            if (!slugs.length) return null;
            const active = slugs.every((slug) => selected.includes(slug));
            return <button key={bundle.slug} type="button" disabled={!verified || state === "loading"} className={active ? "is-selected" : ""} onClick={() => toggleBundle(bundle)} style={{ "--wizard-accent": bundle.accent } as CSSProperties} aria-pressed={active}>
              <span>{active ? <Minus size={16} /> : <Plus size={16} />}</span><div><small>{bundle.eyebrow}</small><strong>{bundle.name}</strong><p>{bundle.description}</p><em>{slugs.length} bülten</em></div>
            </button>;
          })}
        </div>
      </section>}

      <section className="newsletter-account-list">
        <header><div><p className="eyebrow">Gelen kutun</p><h2>Bültenlerini yönet</h2></div><p>Aktif Hiposta bültenlerini tek yerden açıp kapat.</p></header>
        <div className="newsletter-account-grid">
          {availableNewsletters.map((newsletter) => {
            const publication = publicationFor(newsletter);
            const active = selected.includes(newsletter.slug);
            return <article key={newsletter.slug} className={active ? "is-selected" : ""} style={{ "--wizard-accent": newsletter.accent } as CSSProperties}>
              <div className="newsletter-account-card__brand">{publication && <PublicationLogo publication={publication} size="small" />}<span>{publication?.name || "Hiposta"}</span></div>
              <h3>{newsletter.name}</h3><p>{newsletter.description}</p><small>{newsletter.schedule}{newsletter.deliveryTime ? ` · ${newsletter.deliveryTime}` : ""}</small>
              <button type="button" role="switch" aria-checked={active} disabled={!verified || state === "loading"} onClick={() => toggleNewsletter(newsletter.slug)}>
                {active ? <><Check size={14} /> Aktif</> : <><Plus size={14} /> Abone ol</>}
              </button>
            </article>;
          })}
        </div>
      </section>

      <div className="newsletter-account-savebar">
        <div><strong>{selected.length} bülten seçili</strong><span>{dirty ? "Kaydedilmemiş değişikliklerin var." : "Tercihlerin güncel."}</span></div>
        {feedback && <p className={state === "error" ? "is-error" : ""} role="status">{feedback}</p>}
        <button className="button button--yellow" type="button" onClick={saveChanges} disabled={!verified || !dirty || state === "loading"}>
          {state === "loading" ? <><LoaderCircle size={16} className="spin" /> Kaydediliyor</> : state === "success" && !dirty ? <><CheckCircle2 size={16} /> Kaydedildi</> : "Değişiklikleri kaydet"}
        </button>
      </div>
    </div>
  );
}
