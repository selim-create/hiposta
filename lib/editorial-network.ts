import type { Article, Newsletter, Publication } from "@/lib/types";

export type EditorialNetwork = {
  sameTopic: Article[];
  samePublication: Article[];
  relatedPublications: Publication[];
  relatedNewsletters: Newsletter[];
};

function normalizedTags(article: Article) {
  return new Set(article.tags.map((tag) => tag.trim().toLocaleLowerCase("tr-TR")).filter(Boolean));
}

function tagOverlap(a: Article, b: Article) {
  const tags = normalizedTags(a);
  return b.tags.reduce((count, tag) => count + (tags.has(tag.trim().toLocaleLowerCase("tr-TR")) ? 1 : 0), 0);
}

function newestFirst(a: Article, b: Article) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export function buildEditorialNetwork(params: {
  current: Article;
  articles: Article[];
  publications: Publication[];
  newsletters: Newsletter[];
  limit?: number;
}): EditorialNetwork {
  const { current, articles, publications, newsletters, limit = 3 } = params;
  const candidates = articles.filter((item) => item.slug !== current.slug);

  const sameTopic = candidates
    .map((item) => ({
      item,
      score:
        (item.categorySlug === current.categorySlug ? 10 : 0) +
        tagOverlap(current, item) * 4 +
        (item.publicationSlug !== current.publicationSlug ? 2 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || newestFirst(a.item, b.item))
    .map(({ item }) => item)
    .filter((item, index, list) => list.findIndex((candidate) => candidate.publicationSlug === item.publicationSlug) === index)
    .slice(0, limit);

  const samePublication = candidates
    .filter((item) => item.publicationSlug === current.publicationSlug)
    .sort(newestFirst)
    .slice(0, limit);

  const relatedPublicationSlugs = new Set(sameTopic.map((item) => item.publicationSlug));
  const relatedPublications = publications
    .filter((item) => relatedPublicationSlugs.has(item.slug) && item.status === "active" && !item.isComingSoon)
    .slice(0, limit);

  const relatedNewsletters = newsletters
    .filter((item) => item.slug !== current.relatedNewsletterSlug)
    .map((item) => ({
      item,
      score:
        (item.categorySlug === current.categorySlug ? 8 : 0) +
        (relatedPublicationSlugs.has(item.publicationSlug) ? 4 : 0) +
        (item.featured ? 1 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (b.item.audienceCount || 0) - (a.item.audienceCount || 0))
    .map(({ item }) => item)
    .slice(0, limit);

  return { sameTopic, samePublication, relatedPublications, relatedNewsletters };
}
