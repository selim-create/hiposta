"use client";

import type { CSSProperties, FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, LoaderCircle, Mail, Minus, Plus, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PublicationLogo } from "@/components/publication-logo";
import type { Category, Newsletter, NewsletterBundle, Publication } from "@/lib/types";

type Props = { categories: Category[]; newsletters: Newsletter[]; bundles: NewsletterBundle[]; publications: Publication[] };
type Saved = { version?: 3; step?: number; interests?: string[]; selected?: string[] };

const STORAGE_KEY = "hiposta-newsletter-wizard-v3";
const LEGACY_KEY = "hiposta-newsletter-wizard-v2";
const unique = (items: string[]) => Array.from(new Set(items));

export function NewsletterGuestWizard({ categories, newsletters, bundles, publications }: Props) {
  const activePublications = useMemo(() => new Set(publications.filter((item) => item.status !== "inactive" && !item.isComingSoon).map((item) => item.slug)), [publications]);
  const available = useMemo(() => newsletters.filter((item) => activePublications.has(item.publicationSlug)), [activePublications, newsletters]);
  const availableSlugs = useMemo(() => new Set(available.map((item) => item.slug)), [available]);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      localStorage.removeItem(LEGACY_KEY);
      let saved: Saved = {};
      try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Saved; } catch { saved = {}; }
      if (saved.version === 3) {
        setInterests(Array.isArray(saved.interests) ? saved.interests.filter((slug) => categories.some((item) => item.slug === slug)) : []);
        setSelected(Array.isArray(saved.selected) ? saved.selected.filter((slug) => availableSlugs.has(slug)) : []);
        setStep(Number.isInteger(saved.step) ? Math.min(Math.max(Number(saved.step), 1), 4) : 1);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [availableSlugs, categories]);

  useEffect(() => {
    if (!ready || step === 5) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 3, step, interests, selected } satisfies Saved));
  }, [ready, step, interests, selected]);

  const recommendations = useMemo(() => {
    const wanted = new Set(interests);
    return available.filter((item) => wanted.has(item.categorySlug)).sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (b.audienceCount || 0) - (a.audienceCount || 0));
  }, [available, interests]);
  const selectedItems = useMemo(() => selected.map((slug) => available.find((item) => item.slug === slug)).filter(Boolean) as Newsletter[], [available, selected]);
  const publicationFor = (newsletter: Newsletter) => publications.find((item) => item.slug === newsletter.publicationSlug);

  function go(next: number) { setState("idle"); setFeedback(""); setStep(Math.min(Math.max(next, 1), 5)); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function toggleInterest(slug: string) { setInterests((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]); }
  function toggleNewsletter(slug: string) { setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]); setState("idle"); }
  function toggleBundle(bundle: NewsletterBundle) {
    const slugs = bundle.newsletterSlugs.filter((slug) => availableSlugs.has(slug));
    const allSelected = slugs.length > 0 && slugs.every((slug) => selected.includes(slug));
    setSelected((current) => allSelected ? current.filter((slug) => !slugs.includes(slug)) : unique([...current, ...slugs]));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const consent = form.get("consent") === "on";
    if (!email || !consent || !selected.length) { setState("error"); setFeedback("E-posta adresini girip bülten ileti iznini onayla."); return; }
    setState("loading"); setFeedback("");
    try {
      const response = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, newsletters: selected, consent: true }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok === false) throw new Error(String(payload?.code || "subscription_failed"));
      const delivery = payload?.delivery_available !== false;
      setDeliveryAvailable(delivery);
      setFeedback(delivery ? `${selected.length} bülten seçimin kaydedildi. Gelen kutundaki doğrulama bağlantısını onayla.` : `${selected.length} bülten seçimin kaydedildi. E-posta gönderimi henüz aktif olmadığı için doğrulama mesajı şu anda gönderilemeyecek.`);
      localStorage.removeItem(STORAGE_KEY); setState("success"); setStep(5);
    } catch (error) {
      const code = error instanceof Error ? error.message : "subscription_failed";
      setState("error");
      setFeedback(code === "suppressed" ? "Bu e-posta adresi gönderim engelinde olduğu için yeniden abonelik açılamıyor." : "Seçimlerin şu anda kaydedilemedi. Lütfen biraz sonra tekrar dene.");
    }
  }

  function restart() { localStorage.removeItem(STORAGE_KEY); setInterests([]); setSelected([]); setState("idle"); setFeedback(""); setStep(1); }
  const steps = ["İlgi alanları", "Öneriler", "Seçim", "Onay", "Tamamlandı"];
  if (!ready) return <div className="wizard-loading" role="status"><LoaderCircle className="spin" size={22} /> Bülten deneyimin hazırlanıyor…</div>;

  return <div className="newsletter-wizard">
    <nav className="wizard-progress" aria-label="Bülten seçim adımları">{steps.map((label, index) => { const number = index + 1; const complete = number < step; return <div key={label} className={`${number === step ? "is-current" : ""}${complete ? " is-complete" : ""}`} aria-current={number === step ? "step" : undefined}><span>{complete ? <Check size={14} /> : number}</span><strong>{label}</strong></div>; })}</nav>
    {step < 5 && <div className="wizard-toolbar"><button type="button" onClick={() => go(step - 1)} disabled={step === 1}><ArrowLeft size={15} /> Geri</button><span>{selected.length ? `${selected.length} bülten seçili` : "Henüz bülten seçmedin"}</span></div>}

    {step === 1 && <section className="wizard-panel"><header><p className="eyebrow">1 / 4 · Başlangıç</p><h2>Neleri takip etmek istiyorsun?</h2><p>Bir veya daha fazla ilgi alanı seç. Bir sonraki adımda sana uygun yayın ve bültenleri öne çıkaracağız.</p></header><div className="wizard-interest-grid">{categories.map((category) => { const count = available.filter((item) => item.categorySlug === category.slug).length; const active = interests.includes(category.slug); return <button key={category.slug} type="button" className={active ? "is-selected" : ""} style={{ "--wizard-accent": category.color } as CSSProperties} onClick={() => toggleInterest(category.slug)} aria-pressed={active}><span>{active ? <Check size={16} /> : <Plus size={16} />}</span><strong>{category.shortName}</strong><small>{count} bülten</small><p>{category.description}</p></button>; })}</div><footer><button className="button button--primary" type="button" onClick={() => go(2)} disabled={!interests.length}>Önerileri göster <ArrowRight size={16} /></button></footer></section>}

    {step === 2 && <section className="wizard-panel"><header><p className="eyebrow">2 / 4 · Sana göre</p><h2>İlgi alanlarına göre öneriler</h2><p>Seçtiğin kategorilerdeki aktif bültenleri öne çıkardık.</p></header>{recommendations.length ? <><div className="wizard-section-actions"><span>{recommendations.length} öneri</span><button type="button" onClick={() => setSelected((current) => unique([...current, ...recommendations.map((item) => item.slug)]))}>Tüm önerileri seç</button></div><div className="wizard-newsletter-grid">{recommendations.map((newsletter) => { const publication = publicationFor(newsletter); const active = selected.includes(newsletter.slug); return <button key={newsletter.slug} type="button" className={active ? "is-selected" : ""} onClick={() => toggleNewsletter(newsletter.slug)} aria-pressed={active} style={{ "--wizard-accent": newsletter.accent } as CSSProperties}><div>{publication && <PublicationLogo publication={publication} size="small" />}<span>{active ? <Check size={15} /> : <Plus size={15} />}</span></div><small>{publication?.name || "Hiposta"}</small><strong>{newsletter.name}</strong><p>{newsletter.description}</p><em>{newsletter.schedule}{newsletter.deliveryTime ? ` · ${newsletter.deliveryTime}` : ""}</em></button>; })}</div></> : <div className="wizard-empty">Bu ilgi alanlarında aktif bülten bulunamadı.</div>}<footer><button className="button button--primary" type="button" onClick={() => go(3)}>Seçimi düzenle <ArrowRight size={16} /></button></footer></section>}

    {step === 3 && <section className="wizard-panel"><header><p className="eyebrow">3 / 4 · Son seçim</p><h2>Tek tek seç veya paket ekle</h2><p>Bundle seçimi ayrı abonelik oluşturmaz; paketteki bültenler tek tek seçimine eklenir.</p></header>{!!bundles.length && <div className="wizard-bundles">{bundles.map((bundle) => { const slugs = bundle.newsletterSlugs.filter((slug) => availableSlugs.has(slug)); if (!slugs.length) return null; const active = slugs.every((slug) => selected.includes(slug)); return <button key={bundle.slug} type="button" className={active ? "is-selected" : ""} onClick={() => toggleBundle(bundle)} aria-pressed={active} style={{ "--wizard-accent": bundle.accent } as CSSProperties}><span>{active ? <Minus size={16} /> : <Plus size={16} />}</span><div><small>{bundle.eyebrow}</small><strong>{bundle.name}</strong><p>{bundle.description}</p><em>{slugs.length} bülten</em></div></button>; })}</div>}<div className="wizard-all-newsletters">{available.map((newsletter) => { const publication = publicationFor(newsletter); const active = selected.includes(newsletter.slug); return <button key={newsletter.slug} type="button" className={active ? "is-selected" : ""} onClick={() => toggleNewsletter(newsletter.slug)} aria-pressed={active}><span>{active ? <Check size={14} /> : <Plus size={14} />}</span><div><strong>{newsletter.name}</strong><small>{publication?.name || "Hiposta"} · {newsletter.schedule}</small></div></button>; })}</div><footer><button className="button button--primary" type="button" onClick={() => go(4)} disabled={!selected.length}>{selected.length} bültenle devam et <ArrowRight size={16} /></button></footer></section>}

    {step === 4 && <section className="wizard-panel wizard-panel--review"><header><p className="eyebrow">4 / 4 · Onay</p><h2>Seçimini gözden geçir</h2><p>Gönderim tercihini kaydetmeden önce seçtiğin bültenleri kontrol et.</p></header><div className="wizard-review-grid"><div className="wizard-review-list"><h3>{selectedItems.length} bülten seçtin</h3>{selectedItems.map((newsletter) => <div key={newsletter.slug}><span><strong>{newsletter.name}</strong><small>{publicationFor(newsletter)?.name || "Hiposta"} · {newsletter.schedule}</small></span><button type="button" onClick={() => toggleNewsletter(newsletter.slug)}>Kaldır</button></div>)}</div><form className="wizard-confirm" onSubmit={submit}><label>E-posta adresin<input name="email" type="email" inputMode="email" autoComplete="email" placeholder="sen@ornek.com" required disabled={state === "loading"} /></label><label className="wizard-consent"><input name="consent" type="checkbox" required disabled={state === "loading"} /><span>Seçtiğim bültenler için Hiposta’dan e-posta ile ileti almayı açıkça kabul ediyorum.</span></label><p className="wizard-privacy"><Mail size={14} /> Ücretsiz bülten aboneliği için hesap açman gerekmez. E-posta adresin kaynak yayınlarla paylaşılmaz.</p><button className="button button--yellow" type="submit" disabled={state === "loading" || !selected.length}>{state === "loading" ? <><LoaderCircle size={16} className="spin" /> Kaydediliyor</> : <>Seçimi tamamla <ArrowRight size={16} /></>}</button>{state === "error" && <p className="form-feedback form-feedback--error" role="alert">{feedback}</p>}</form></div></section>}

    {step === 5 && <section className="wizard-complete"><span><CheckCircle2 size={34} /></span><p className="eyebrow">Seçim tamamlandı</p><h2>Gelen kutun artık sana göre.</h2><p>{feedback}</p>{!deliveryAvailable && <div className="wizard-delivery-note">Seçimlerin sistemde kayıtlı. E-posta teslim altyapısı etkinleştiğinde doğrulama/gönderim adımı devreye alınacak.</div>}<div><Link className="button button--primary" href="/">İçerikleri keşfet <ArrowRight size={16} /></Link><button className="button button--ghost" type="button" onClick={restart}><RotateCcw size={15} /> Seçimi yeniden düzenle</button></div></section>}
  </div>;
}