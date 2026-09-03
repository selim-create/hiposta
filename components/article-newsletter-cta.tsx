"use client";

import { NewsletterSubscribeAction } from "@/components/newsletter-subscribe-action";

type Props = {
  newsletterName: string;
  newsletterSlug: string;
  verified: boolean;
  authenticated: boolean;
  subscribed: boolean;
  compact?: boolean;
};

export function ArticleNewsletterCta(props: Props) {
  return <NewsletterSubscribeAction {...props} source="article_account_cta" />;
}
