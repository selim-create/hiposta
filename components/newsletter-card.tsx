import type { CSSProperties } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { getPublication } from "@/lib/data";
import type { Newsletter } from "@/lib/types";

export function NewsletterCard({ newsletter }: { newsletter: Newsletter }) {
  const publication = getPublication(newsletter.publicationSlug);
  if (!publication) return null;

  const style = { "--newsletter-accent": newsletter.accent } as CSSProperties;

  return (
    <article className="newsletter-card" style={style}>
      <div className="newsletter-card__top">
        <span>{publication.monogram}</span>
        <Link href={`/yayinlar/${publication.slug}`}>{publication.name}</Link>
      </div>
      <div>
        <p className="eyebrow">{newsletter.format}</p>
        <h3><Link href={`/bultenler/${newsletter.slug}`}>{newsletter.name}</Link></h3>
        <p>{newsletter.description}</p>
      </div>
      <div className="newsletter-card__footer">
        <span><Clock3 size={13} /> {newsletter.schedule} · {newsletter.deliveryTime}</span>
        <Link href={`/bultenler/${newsletter.slug}`} aria-label={`${newsletter.name} detayını gör`}>
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
