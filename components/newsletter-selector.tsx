"use client";

import type { CSSProperties, FormEvent } from "react";
import { ArrowRight, Check, Minus, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Newsletter, NewsletterBundle, Publication } from "@/lib/types";

type Props = {
  categories: Category[];
  newsletters: Newsletter[];
  bundles: NewsletterBundle[];
  publications: Publication[];
};

export function NewsletterSelector({ categories, newsletters, bundles, publications }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState<string[]>(["piyasa-acilisi"]);
  const [emailMode, setEmailMode] = useState(false);
  const [complete, setComplete] = useState(false);

  const visible = useMemo(
    () => activeCategory === "all" ? newsletters : newsletters.filter((item) => item.categorySlug === activeCategory),
    [activeCategory, newsletters],
  );

  const selectedItems = useMemo(
    () => selected.map((slug) => newsletters.find((item) => item.slug === slug)).filter(Boolean) as Newsletter[],
    [newsletters, selected],
  );

  function toggle(slug: string) {
    setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
    setComplete(false);
  }

  function toggleBundle(bundle: NewsletterBundle) {
    const allSelected = bundle.newsletterSlugs.every((slug) => selected.includes(slug));
    setSelected((current) => allSelected
      ? current.filter((slug) => !bundle.newsletterSlugs.includes(slug))
      : Array.from(new Set([...current, ...bundle.newsletterSlugs])));
    setComplete(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setComplete(true);
  }

  return (
    <div className="selector">
      <div className="selector__filters" aria-label="Bülten kategorisi">
        <button className={activeCategory === "all" ? "active" : ""} onClick={() => setActiveCategory("all")} type="button">Tümü</button>
        {categories.map((category) => (
          <button key={category.slug} className={activeCategory === category.slug ? "active" : ""} onClick={() => setActiveCategory(category.slug)} type="button">
            {category.shortName}
          </button>
        ))}
      </div>

      <div className="selector__layout">
        <div>
          <div className="selector__grid">
            {visible.map((newsletter) => {
              const publication = publications.find((item) => item.slug === newsletter.publicationSlug);
              const isSelected = selected.includes(newsletter.slug);
              const style = { "--selector-accent": newsletter.accent } as CSSProperties;
              return (
                <button key={newsletter.slug} className={`selector-card${isSelected ? " selected" : ""}`} style={style} onClick={() => toggle(newsletter.slug)} type="button" aria-pressed={isSelected}>
                  <span className="selector-card__mark">{publication?.monogram}</span>
                  <span className="selector-card__action">{isSelected ? <Check size={15} /> : <Plus size={15} />}</span>
                  <span className="selector-card__publication">{publication?.name}</span>
                  <strong>{newsletter.name}</strong>
                  <span>{newsletter.description}</span>
                  <small>{newsletter.schedule} · {newsletter.deliveryTime}</small>
                </button>
              );
            })}
          </div>

          <section className="bundle-strip" aria-labelledby="bundle-heading">
            <div className="section-heading section-heading--small">
              <p className="eyebrow">Hızlı seçim</p>
              <h2 id="bundle-heading">Hazır bülten paketleri</h2>
            </div>
            <div className="bundle-strip__grid">
              {bundles.map((bundle) => {
                const active = bundle.newsletterSlugs.every((slug) => selected.includes(slug));
                return (
                  <button key={bundle.slug} type="button" onClick={() => toggleBundle(bundle)} className={active ? "active" : ""}>
                    <span style={{ background: bundle.accent }} aria-hidden="true" />
                    <div><small>{bundle.eyebrow}</small><strong>{bundle.name}</strong><p>{bundle.description}</p></div>
                    {active ? <Minus size={17} /> : <Plus size={17} />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="selection-summary" aria-live="polite">
          {complete ? (
            <div className="selection-summary__complete">
              <span><Check size={24} /></span>
              <h2>Seçimlerin kaydedildi.</h2>
              <p>{selected.length} bülten için doğrulama e-postası mock olarak gönderildi.</p>
              <button type="button" onClick={() => { setComplete(false); setEmailMode(false); }}>Seçimleri düzenle</button>
            </div>
          ) : (
            <>
              <div className="selection-summary__count"><strong>{selected.length}</strong><span>bülten<br />seçtin</span></div>
              <div className="selection-summary__list">
                {selectedItems.length ? selectedItems.map((item) => (
                  <div key={item.slug}>
                    <span>{item.name}<small>{item.schedule}</small></span>
                    <button type="button" onClick={() => toggle(item.slug)} aria-label={`${item.name} seçimini kaldır`}><X size={14} /></button>
                  </div>
                )) : <p>İlgini çeken bültenleri soldan seç.</p>}
              </div>
              {emailMode ? (
                <form className="selection-summary__form" onSubmit={submit}>
                  <label>E-posta adresin<input type="email" placeholder="sen@ornek.com" required autoFocus /></label>
                  <label className="consent consent--inverse"><input type="checkbox" required /><span>Seçtiğim bültenler için ileti almayı kabul ediyorum.</span></label>
                  <button className="button button--yellow" type="submit">Seçimi tamamla <ArrowRight size={16} /></button>
                </form>
              ) : (
                <button className="button button--yellow selection-summary__button" type="button" disabled={!selected.length} onClick={() => setEmailMode(true)}>
                  Devam et <ArrowRight size={16} />
                </button>
              )}
              <small>İstediğin zaman tek tıkla ayrılabilirsin.</small>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
