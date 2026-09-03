import type { CSSProperties } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { NewsletterSubscribeAction } from "@/components/newsletter-subscribe-action";
import { PublicationLogo } from "@/components/publication-logo";
import { getPublication } from "@/lib/data";
import type { Newsletter, Publication } from "@/lib/types";

type Props = {
  newsletter: Newsletter;
  publication?: Publication;
  showSubscriptionAction?: boolean;
  authenticated?: boolean;
  verified?: boolean;
  subscribed?: boolean;
  source?: string;
};

export function NewsletterCard({ newsletter, publication: suppliedPublication, showSubscriptionAction = false, authenticated = false, verified = false, subscribed = false, source = "newsletter_card" }: Props) {
  const publication = suppliedPublication ?? getPublication(newsletter.publicationSlug);
  if (!publication) return null;

  const style = { "--newsletter-accent": newsletter.accent } as CSSProperties;

  return (
    <article className={`newsletter-card${subscribed ? " is-subscribed" : ""}`} style={style}>
      <div className="newsletter-card__top">
        <PublicationLogo publication={publication} size="small" />
        <Link href={`/yayinlar/${publication.slug}`}>{publication.name}</Link>
      </div>
      <div>
        <p className="eyebrow">{newsletter.format}</p>
        <h3><Link href={`/bultenler/${newsletter.slug}`}>{newsletter.name}</Link></h3>
        <p>{newsletter.description}</p>
      </div>
      <div className="newsletter-card__footer">
        <span><Clock3 size={13} /> {newsletter.schedule}{newsletter.deliveryTime ? ` · ${newsletter.deliveryTime}` : ""}</span>
        <Link href={`/bultenler/${newsletter.slug}`} aria-label={`${newsletter.name} detayını gör`}>
          <ArrowUpRight size={16} />
        </Link>
      </div>
      {showSubscriptionAction && <NewsletterSubscribeAction newsletterName={newsletter.name} newsletterSlug={newsletter.slug} authenticated={authenticated} verified={verified} subscribed={subscribed} compact source={source} />}
    </article>
  );
}
