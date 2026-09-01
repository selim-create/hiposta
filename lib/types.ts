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
  logoUrl?: string | null;
  status?: "active" | "inactive";
  isComingSoon?: boolean;
  audienceCount?: number;
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
  audienceCount?: number;
};

export type Article = {
  slug: string;
  title: string;
  dek: string;
  publicationSlug: string;
  publicationName?: string;
  categorySlug: string;
  categoryName?: string;
  categoryShortName?: string;
  newsletterName?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  displayDate: string;
  readTime: string;
  premium: boolean;
  featured?: boolean;
  heroImage: string;
  heroAlt: string;
  photoCredit: string;
  body: string[];
  teaserHtml?: string;
  bodyHtml?: string | null;
  locked?: boolean;
  relatedNewsletterSlug: string;
  tags: string[];
};

export type NewsletterIssue = {
  slug: string;
  title: string;
  preheader: string;
  publishedAt: string;
  updatedAt?: string;
  displayDate: string;
  newsletterSlug: string;
  newsletterName: string;
  publicationSlug: string;
  publicationName: string;
  introHtml?: string;
  items?: Article[];
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

export type CatalogMeta = {
  revision: string;
  generatedAt: string;
  coreVersion: string;
};

export type CatalogSnapshot = {
  categories: Category[];
  publications: Publication[];
  newsletters: Newsletter[];
  bundles: NewsletterBundle[];
  stats: {
    publications: number;
    activePublications: number;
    comingSoonPublications: number;
    activeNewsletters: number;
    categories: number;
    bundles: number;
  };
  meta: CatalogMeta;
  source: "core" | "mock";
};
