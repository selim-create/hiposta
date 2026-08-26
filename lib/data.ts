import {
  articles,
  categories,
  newsletterBundles,
  newsletters,
  publications,
} from "@/lib/mock-data";

const normalize = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const getCategory = (slug: string) => categories.find((item) => item.slug === slug);
export const getPublication = (slug: string) => publications.find((item) => item.slug === slug);
export const getNewsletter = (slug: string) => newsletters.find((item) => item.slug === slug);
export const getArticle = (slug: string) => articles.find((item) => item.slug === slug);
export const getBundle = (slug: string) => newsletterBundles.find((item) => item.slug === slug);

export const getPublicationArticles = (slug: string) =>
  articles.filter((article) => article.publicationSlug === slug);

export const getPublicationNewsletters = (slug: string) =>
  newsletters.filter((newsletter) => newsletter.publicationSlug === slug);

export const getCategoryArticles = (slug: string) =>
  articles.filter((article) => article.categorySlug === slug);

export const getCategoryPublications = (slug: string) =>
  publications.filter((publication) => publication.categorySlug === slug);

export const getCategoryNewsletters = (slug: string) =>
  newsletters.filter((newsletter) => newsletter.categorySlug === slug);

export const searchAll = (query: string) => {
  const needle = normalize(query.trim());
  if (needle.length < 2) return { articles: [], publications: [], newsletters: [] };

  return {
    articles: articles.filter((article) =>
      normalize(`${article.title} ${article.dek} ${article.tags.join(" ")}`).includes(needle),
    ),
    publications: publications.filter((publication) =>
      normalize(`${publication.name} ${publication.description}`).includes(needle),
    ),
    newsletters: newsletters.filter((newsletter) =>
      normalize(`${newsletter.name} ${newsletter.description} ${newsletter.topics.join(" ")}`).includes(needle),
    ),
  };
};
