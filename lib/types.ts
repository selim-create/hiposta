export type Category = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
};

export type Publication = {
  slug: string;
  name: string;
  kicker: string;
  description: string;
  longDescription: string;
  categorySlug: string;
  color: string;
  foreground: string;
  monogram: string;
  cadence: string;
  reach: string;
  featured?: boolean;
};

export type Newsletter = {
  slug: string;
  name: string;
  publicationSlug: string;
  categorySlug: string;
  description: string;
  longDescription: string;
  schedule: string;
  deliveryTime: string;
  format: string;
  audience: string;
  accent: string;
  featured?: boolean;
  topics: string[];
};

export type Article = {
  slug: string;
  title: string;
  dek: string;
  publicationSlug: string;
  categorySlug: string;
  author: string;
  publishedAt: string;
  displayDate: string;
  readTime: string;
  premium: boolean;
  featured?: boolean;
  heroImage: string;
  heroAlt: string;
  photoCredit: string;
  body: string[];
  relatedNewsletterSlug: string;
  tags: string[];
};

export type NewsletterBundle = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  newsletterSlugs: string[];
  accent: string;
  featured?: boolean;
};
