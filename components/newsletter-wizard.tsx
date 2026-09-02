"use client";

import type { CSSProperties, FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, LoaderCircle, Mail, Minus, Plus, RotateCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PublicationLogo } from "@/components/publication-logo";
import type { Category, Newsletter, NewsletterBundle, Publication } from "@/lib/types";

type Props = { categories: Category[]; newsletters: Newsletter[]; bundles: NewsletterBundle[]; publications: Publication[] };
type SessionState = { status: "loading" | "anonymous" | "authenticated"; email: string; verified: boolean; activeSlugs: string[] };
type PersistedWizard = { step?: number; interests?: string[]; selected?: string[] };

const STORAGE_KEY = "hiposta-newsletter-wizard-v2";

function unique(values: string[]) { return Array.from(new Set(values)); }

function activeSubscriptionSlugs(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") return [];
  const data = (payload as { data?: unknown }).data;
  if (!data || typeof data !== "object") return [];
  const subscriptions = (data as { subscriptions?: unknown }).subscriptions;
  if (!Array.isArray(subscriptions)) return [];
  return subscriptions
    .filter((item): item is { status?: string; newsletter_slug?: string } => Boolean(item && typeof item === "object"))
    .filter((item) => item.status === "active" && typeof item.newsletter_slug === "string")
    .map((item) => item.newsletter_slug as string);
}

export function NewsletterWizard({ categories, newsletters, bundles, publications }: Props) {
  const activePublicationSlugs = useMemo(() => new Set(publications.filter((item) => item.status !== "inactive" && !item.isComingSoon).map((item) => item.slug)), [publications]);
  const availableNewsletters = useMemo(() => newsletters.filter((item) => activePublicationSlugs.has(item.publicationSlug)), [activePublicationSlugs, newsletters]);
  const availableSlugs = useMemo(() => new Set(availableNewsletters.map((item) => item.slug)), [availableNewsletters]);

  const [initialized, setInitialized] = useState(false);
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [initialActiveSlugs, setInitialActiveSlugs] = useState<string[]>([]);
  const [session, setSession] = useState<SessionState>({ status: "loading", email: "", verified: false, activeSlugs: [] });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      let persisted: PersistedWizard = {};
      try { persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}") as PersistedWizard; } catch { persisted = {}; }

      let nextSession: SessionState = { status: "anonymous", email: "", verified: false, activeSlugs: [] };
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const payload = await response.json().catch(() => ({}));
        if (response.ok && payload?.ok === true && payload?.data?.account) {
          const activeSlugs = activeSubscriptionSlugs(payload).filter((slug) => availableSlugs.has(slug));
          nextSession = { status: "authenticated", email: String(payload.data.account.email || ""), verified: payload.data.account.email_verified === true, activeSlugs };
        }
      } catch {}

      if (cancelled) return;
      const savedInterests = Array.isArray(persisted.interests) ? persisted.interests.filter((slug) => categories.some((category) => category.slug === slug)) : [];
      const savedSelected = Array.isArray(persisted.selected) ? persisted.selected.filter((slug) => availableSlugs.has(slug)) : [];
      const savedStep = Number.isInteger(persisted.step) ? Math.min(Math.max(Number(persisted.step), 1), 4) : 1;
      setSession(nextSession);
      setInitialActiveSlugs(nextSession.activeSlugs);
      setInterests(savedInterests);
      setSelected(savedSelected.length ? savedSelected : nextSession.activeSlugs);
      setStep(savedStep);
      setInitialized(true);
    }
    hydrate();
    return () => { cancelled = true; };
  }, [availableSlugs, categories]);

  useEffect(() => {
    if (!initialized || step === 5) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, interests, selected } satisfies PersistedWizard));
  }, [initialized, interests, selected, step]);

  const selectedItems = useMemo(() => selected.map((slug) => availableNewsletters.find((item) => item.slug === slug)).filter(Boolean) as Newsletter[], [availableNewsletters, selected]);
  const recommendations = useMemo(() => {
    const interestSet = new Set(interests);
    return availableNewsletters.filter((item) => interestSet.has(item.categorySlug)).sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (b.audienceCount || 0) - (a.audienceCount || 0));
  }, [availableNewsletters, interests]);

  const publicationFor = (newsletter: Newsletter) => publications.find((item) => item.slug === newsletter.publicationSlug);
  const go = (next: number) => { setState("idle"); setFeedback(""); setStep(Math.min(Math.max(next, 1), 5)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const toggleInterest = (slug: string) => setInterests((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
  const toggleNewsletter = (slug: string) => setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
  const selectRecommendations = () => setSelected((current) => unique([...current, ...recommendations.map((item) => item.slug)]));

  function toggleBundle(bundle: NewsletterBundle) {
    const slugs = bundle.newsletterSlugs.filter((slug) => availableSlugs.has(slug));
    if (!slugs.length) return;
    const allSelected = slugs.every((slug) => selected.includes(slug));
    setSelected((current) => allSelected ? current.filter((slug) => !slugs.includes(slug)) : unique([...current, ...slugs]));
  }

  async function saveAuthenticatedPreferences() {
    const initial = new Set(initialActiveSlugs);
    const target = new Set(selected);
    const changes = availableNewsletters.map((newsletter) => ({ slug: newsletter.slug, subscribed: target.has(newsletter.slug) })).filter((item) => initial.has(item.slug) !== item.subscribed);
    for (const change of changes) {
      const response = await fetch(`/api/auth/preferences/newsletters/${encodeURIComponent(change.slug)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscribed: change.subscribed }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok !== true) {
        const code = String(payload?.code || "update_failed");
        if (code === "verification_required") throw new Error("verification_required");
        if (code === "suppressed") throw new Error("suppressed");
        throw new Error("update_failed");
      }
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected.length || state === "loading") return;
    setState("loading"); setFeedback("");
    try {
      if (session.status === "authenticated") {
        if (!session.verified) throw new Error("verification_required");
        await saveAuthenticatedPreferences();
        setInitialActiveSlugs(selected); setDeliveryAvailable(true); setFeedback("Bülten tercihlerin hesabında güncellendi."); setState("success"); window.localStorage.removeItem(STORAGE_KEY); setStep(5); return;
      }
      const form = new FormData(event.currentTarget);
      const email = String(form.get("email") ?? "").trim();
      const consent = form.get("consent") === "on";
      if (!email || !consent) throw new Error("invalid_request");
      const response = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, newsletters: selected, consent: true }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok === false) throw new Error(String(payload?.code || "subscription_failed"));
      const delivery = payload?.delivery_available !== false;
      setDeliveryAvailable(delivery);
      setFeedback(delivery ? `${selected.length} bülten seçimin kaydedildi. Gelen kutundaki doğrulama bağlantısını onayla.` : `${selected.length} bülten seçimin kaydedildi. E-posta gönderimi henüz aktif olmadığı için doğrulama mesajı şu anda gönderilemeyecek.`);
      setState("success"); window.localStorage.removeItem(STORAGE_KEY); setStep(5);
    } catch (error) {
      const code = error instanceof Error ? error.message : "subscription_failed";
      setState("error");
      setFeedback(code === "verification_required" ? "Bülten tercihlerini kaydetmek için hesabının e-posta adresini doğrulaman gerekiyor." : code === "suppressed" ? "Bu e-posta adresi gönderim engelinde olduğu için yeniden abonelik açılamıyor." : code === "invalid_request" ? "E-posta adresini girip bülten ileti iznini onayla." : session.status === "authenticated" ? "Tercihlerin tamamen güncellenemedi. Hesabım ekranından mevcut durumu kontrol edip tekrar deneyebilirsin." : "Seçimlerin şu anda kaydedilemedi. Lütfen biraz sonra tekrar dene.");
    }
  }

  function restart() { window.localStorage.removeItem(STORAGE_KEY); setInterests([]); setSelected(session.status === "authenticated" ? initialActiveSlugs : []); setState("idle"); setFeedback(""); setStep(1); }

  const steps = ["İlgi alanları", "Öneriler", "Seçim", "Onay", "Tamamlandı"];
  if (!initialized) return <div className="wizard-loading" role="status"><LoaderCircle className="spin" size={22} /> Bülten deneyimin hazırlanıyor…</div>;

  return <div className="newsletter-wizard">
    <nav className="wizard-progress" aria-label="Bülten seçim adımları">{steps.map((label, index) => { const number = index + 1; const complete = number < step; return <div key={label} className={`${number === step ? "is-current" : ""}${complete ? " is-complete" : ""}`} aria-current={number === step ? "step" : undefined}><span>{complete ? <Check size={14} /> : number}</span><strong>{label}</strong></div>; })}</nav>
    {step < 5 && <div className="wizard-toolbar"><button type="button" onClick={() => go(step - 1)} disabled={step === 1}><ArrowLeft size={15} /> Geri</button><span>{selected.length ? `${selected.length} bülten seçili` : "Henüz bülten seçmedin"}</span></div>}

    {step === 1 && <section className="wizard-panel"><header><p className="eyebrow">1 / 4 · Başlangıç</p><h2>Neleri takip etmek istiyorsun?</h2><p>Bir veya daha fazla ilgi alanı seç. Bir sonraki adımda sana uygun yayın ve bültenleri öne çıkaracağız.</p></header><div className="wizard-interest-grid">{categories.map((category) => { const count = availableNewsletters.filter((item) => item.categorySlug === category.slug).length; const active = interests.includes(category.slug); return <button key={category.slug} type="button" className={active ? "is-selected" : ""} style={{ "--wizard-accent": category.color } as CSSProperties} onClick={() => toggleInterest(category.slug)} aria-pressed={active}><span>{active ? <Check size={16} /> : <Plus size={16} />}</span><strong>{category.shortName}</strong><small>{count} bülten</small><p>{category.description}</p></button>; })}</div><footer><button className="button button--primary" type="button" onClick={() => go(2)} disabled={!interests.length}>Önerileri göster <ArrowRight size={16} /></button></footer></section>}

    {step === 2 && <section className="wizard-panel"><header><p className="eyebrow">2 / 4 · Sana göre</p><h2>İlgi alanlarına göre öneriler</h2><p>Seçtiğin kategorilerdeki aktif bültenleri öne çıkardık.</p></header>{recommendations.length ? <><div className="wizard-section-actions"><span>{recommendations.length} öneri</span><button type="button" onClick={selectRecommendations}>Tüm önerileri seç</button></div><div className="wizard-newsletter-grid">{recommendations.map((newsletter) => { const publication = publicationFor(newsletter); const active = selected.includes(newsletter.slug); return <button key={newsletter.slug} type="button" className={active ? "is-selected" : ""} onClick={() => toggleNewsletter(newsletter.slug)} aria-pressed={active} style={{ "--wizard-accent": newsletter.accent } as CSSProperties}><div>{publication && <PublicationLogo publication={publication} size="small" />}<span>{active ? <Check size={15} /> : <Plus size={15} />}</span></div><small>{publication?.name || "Hiposta"}</small><strong>{newsletter.name}</strong><p>{newsletter.description}</p><em>{newsletter.schedule}{newsletter.deliveryTime ? ` · ${newsletter.deliveryTime}` : ""}</em></button>; })}</div></> : <div className="wizard-empty">Bu ilgi alanlarında aktif bülten bulunamadı.</div>}<footer><button className="button button--primary" type="button" onClick={() => go(3)}>Seçimi düzenle <ArrowRight size={16} /></button></footer></section>}

    {step === 3 && <section className="wizard-panel"><header><p className="eyebrow">3 / 4 · Son seçim</p><h2>Tek tek seç veya paket ekle</h2><p>Bundle seçimi ayrı abonelik oluşturmaz; paketteki bültenler tek tek seçimine eklenir.</p></header>{!!bundles.length && <div className="wizard-bundles">{bundles.map((bundle) => { const slugs = bundle.newsletterSlugs.filter((slug) => availableSlugs.has(slug)); if (!slugs.length) return null; const active = slugs.every((slug) => selected.includes(slug)); return <button key={bundle.slug} type="button" className={active ? "is-selected" : ""} onClick={() => toggleBundle(bundle)} aria-pressed={active} style={{ "--wizard-accent": bundle.accent } as CSSProperties}><span>{active ? <Minus size={16} /> : <Plus size={16} />}</span><div><small>{bundle.eyebrow}</small><strong>{bundle.name}</strong><p>{bundle.description}</p><em>{slugs.length} bülten</em></div></button>; })}</div>}<div className="wizard-all-newsletters">{availableNewsletters.map((newsletter) => { const publication = publicationFor(newsletter); const active = selected.includes(newsletter.slug); return <button key={newsletter.slug} type="button" className={active ? "is-selected" : ""} onClick={() => toggleNewsletter(newsletter.slug)} aria-pressed={active}><span>{active ? <Check size={14} /> : <Plus size={14} />}</span><div><strong>{newsletter.name}</strong><small>{publication?.name || "Hiposta"} · {newsletter.schedule}</small></div></button>; })}</div><footer><button className="button button--primary" type="button" onClick={() => go(4)} disabled={!selected.length}>{selected.length} bültenle devam et <ArrowRight size={16} /></button></footer></section>}

    {step === 4 && <section className="wizard-panel wizard-panel--review"><header><p className="eyebrow">4 / 4 · Onay</p><h2>Seçimini gözden geçir</h2><p>Gönderim tercihini kaydetmeden önce seçtiğin bültenleri ve hesap durumunu kontrol et.</p></header><div className="wizard-review-grid"><div className="wizard-review-list"><h3>{selectedItems.length} bülten seçtin</h3>{selectedItems.map((newsletter) => <div key={newsletter.slug}><span><strong>{newsletter.name}</strong><small>{publicationFor(newsletter)?.name || "Hiposta"} · {newsletter.schedule}</small></span><button type="button" onClick={() => toggleNewsletter(newsletter.slug)}>Kaldır</button></div>)}</div><form className="wizard-confirm" onSubmit={submit}>{session.status === "authenticated" ? <><div className="wizard-account-state"><ShieldCheck size={22} /><div><small>Hiposta hesabı</small><strong>{session.email}</strong><span>{session.verified ? "Doğrulanmış hesap · tercihler hesabına kaydedilecek." : "E-posta doğrulaması gerekiyor."}</span></div></div>{!session.verified && <p className="wizard-warning">Bülten tercihlerini değiştirmek için e-posta doğrulaması gerekli. <Link href="/hesabim">Hesabım’dan doğrula.</Link></p>}</> : <><label>E-posta adresin<input name="email" type="email" inputMode="email" autoComplete="email" placeholder="sen@ornek.com" required disabled={state === "loading"} /></label><label className="wizard-consent"><input name="consent" type="checkbox" required disabled={state === "loading"} /><span>Seçtiğim bültenler için Hiposta’dan e-posta ile ileti almayı açıkça kabul ediyorum.</span></label><p className="wizard-privacy"><Mail size={14} /> Ücretsiz bülten aboneliği için hesap açman gerekmez. E-posta adresin kaynak yayınlarla paylaşılmaz.</p></>}<button className="button button--yellow" type="submit" disabled={state === "loading" || !selected.length || (session.status === "authenticated" && !session.verified)}>{state === "loading" ? <><LoaderCircle size={16} className="spin" /> Kaydediliyor</> : <>Seçimi tamamla <ArrowRight size={16} /></>}</button>{state === "error" && <p className="form-feedback form-feedback--error" role="alert">{feedback}</p>}</form></div></section>}

    {step === 5 && <section className="wizard-complete"><span><CheckCircle2 size={34} /></span><p className="eyebrow">Seçim tamamlandı</p><h2>Gelen kutun artık sana göre.</h2><p>{feedback}</p>{!deliveryAvailable && <div className="wizard-delivery-note">Seçimlerin sistemde kayıtlı. E-posta teslim altyapısı etkinleştiğinde doğrulama/gönderim adımı devreye alınacak.</div>}<div><Link className="button button--primary" href="/">İçerikleri keşfet <ArrowRight size={16} /></Link>{session.status === "authenticated" && <Link className="button button--ghost" href="/hesabim">Hesabım</Link>}<button className="button button--ghost" type="button" onClick={restart}><RotateCcw size={15} /> Seçimi yeniden düzenle</button></div></section>}
  </div>;
}
