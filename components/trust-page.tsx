import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { TrustPageDefinition } from "@/lib/trust-pages";

export function TrustPage({ page }: { page: TrustPageDefinition }) {
  return (
    <div className="trust-page">
      <header className="trust-hero page-shell">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="trust-hero__lead">{page.lead}</p>
        {page.actions?.length ? <div className="trust-actions">{page.actions.map((action) => action.external ? <a key={action.href} className="button button--primary" href={action.href} target="_blank" rel="noopener noreferrer">{action.label} <ArrowRight size={15} /></a> : <Link key={action.href} className="button button--primary" href={action.href}>{action.label} <ArrowRight size={15} /></Link>)}</div> : null}
      </header>

      {page.highlights?.length ? <section className="trust-highlights page-shell">{page.highlights.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</section> : null}

      <section className="trust-content page-shell">
        <aside><span>Bu sayfada</span><nav>{page.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav></aside>
        <div className="trust-sections">
          {page.sections.map((section) => <section key={section.id} id={section.id}>
            <p className="eyebrow">{section.kicker || page.eyebrow}</p>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items?.length ? <ul>{section.items.map((item) => <li key={item}><CheckCircle2 size={17} /><span>{item}</span></li>)}</ul> : null}
          </section>)}
        </div>
      </section>

      {page.cta ? <section className="trust-cta page-shell"><div><p className="eyebrow">{page.cta.eyebrow}</p><h2>{page.cta.title}</h2><p>{page.cta.text}</p></div>{page.cta.external ? <a className="button button--yellow" href={page.cta.href} target="_blank" rel="noopener noreferrer">{page.cta.label} <ArrowRight size={16} /></a> : <Link className="button button--yellow" href={page.cta.href}>{page.cta.label} <ArrowRight size={16} /></Link>}</section> : null}
    </div>
  );
}
