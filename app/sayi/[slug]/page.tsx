import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CalendarDays, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { PublicationMark } from "@/components/publication-mark";
import { SubscribeForm } from "@/components/subscribe-form";
import { getCatalog } from "@/lib/catalog";
import { getNewsletterIssue, getNewsletterIssues } from "@/lib/issues";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getNewsletterIssues()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const issue = await getNewsletterIssue((await params).slug);
  if (!issue) return {};
  return {
    title: issue.title,
    description: issue.preheader || `${issue.newsletterName} arşiv sayısı`,
    openGraph: {
      type: "article",
      title: issue.title,
      description: issue.preheader || `${issue.newsletterName} arşiv sayısı`,
      publishedTime: issue.publishedAt,
    },
  };
}

export default async function IssuePage({ params }: Props) {
  const slug = (await params).slug;
  const [issue, catalog] = await Promise.all([getNewsletterIssue(slug), getCatalog()]);
  if (!issue) notFound();

  const newsletter = catalog.newsletters.find((item) => item.slug === issue.newsletterSlug);
  const publication = catalog.publications.find((item) => item.slug === issue.publicationSlug);
  if (!newsletter || !publication) notFound();

  const items = issue.items ?? [];
  const style = {
    "--issue-accent": newsletter.accent,
    "--issue-ink": publication.foreground,
  } as CSSProperties;

  return (
    <article className="issue-page" style={style}>
      <header className="issue-hero">
        <div className="page-shell issue-hero__inner">
          <div className="breadcrumb">
            <Link href="/bultenler">Bültenler</Link><span>/</span>
            <Link href={`/bultenler/${newsletter.slug}`}>{newsletter.name}</Link><span>/</span>
            <span>{issue.displayDate}</span>
          </div>
          <div className="issue-hero__grid">
            <div>
              <PublicationMark publication={publication} linked={false} />
              <p className="eyebrow">{newsletter.name} · Web arşivi</p>
              <h1>{issue.title}</h1>
              {issue.preheader && <p className="issue-hero__dek">{issue.preheader}</p>}
            </div>
            <aside>
              <div className="issue-hero__date"><CalendarDays size={18} /><span><small>Yayın tarihi</small>{issue.displayDate}</span></div>
              <Link className="inline-arrow-link" href={`/bultenler/${newsletter.slug}`}><ArrowLeft size={15} /> Tüm sayılar</Link>
            </aside>
          </div>
        </div>
      </header>

      <div className="page-shell issue-sheet-wrap">
        <section className="issue-sheet">
          <div className="issue-sheet__brand">hiposta<span>.</span></div>
          <div className="issue-sheet__newsletter">{publication.name} · {newsletter.name}</div>
          <h2>{issue.title}</h2>
          {issue.introHtml && <div className="issue-sheet__intro" dangerouslySetInnerHTML={{ __html: issue.introHtml }} />}

          {items.length > 0 ? (
            <div className="issue-sheet__items">
              {items.map((item, index) => (
                <article className="issue-story" key={item.slug}>
                  <div className="issue-story__number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="issue-story__content">
                    <div className="issue-story__meta">
                      <span>{item.categoryShortName || item.categoryName || "Gündem"}</span>
                      {item.premium && <span className="premium-pill"><LockKeyhole size={10} /> Premium</span>}
                    </div>
                    <h3><Link href={`/icerik/${item.slug}`}>{item.title}</Link></h3>
                    {item.dek && <p>{item.dek}</p>}
                    {item.teaserHtml && <div className="issue-story__teaser" dangerouslySetInnerHTML={{ __html: item.teaserHtml }} />}
                    <Link className="issue-story__link" href={`/icerik/${item.slug}`}>İçeriği oku <ArrowRight size={14} /></Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="issue-empty"><span>0</span><h3>Bu sayıya henüz içerik eklenmemiş.</h3></div>
          )}
        </section>

        <aside className="issue-subscribe">
          <p className="eyebrow">Bir sonraki sayı</p>
          <h2>{newsletter.name}</h2>
          <p>{newsletter.schedule}{newsletter.deliveryTime ? ` · ${newsletter.deliveryTime}` : ""}</p>
          <SubscribeForm newsletterName={newsletter.name} newsletterSlugs={[newsletter.slug]} compact />
        </aside>
      </div>

      {items.length > 0 && (
        <section className="section page-shell issue-related">
          <div className="section-heading section-heading--rule"><div><p className="eyebrow">Bu sayıdan</p><h2>İçerik kartları</h2></div></div>
          <div className="article-grid article-grid--three">{items.slice(0, 3).map((item) => <ArticleCard key={item.slug} article={item} />)}</div>
        </section>
      )}
    </article>
  );
}
