import type { Metadata } from "next";

export const SITE_NAME = "Hiposta";
export const SITE_DESCRIPTION = "Hip Medya’nın yayınlarından içerikleri, premium dosyaları ve seçtiğin e-posta bültenlerini tek merkezde keşfet.";
export const DEFAULT_SOCIAL_IMAGE_PATH = "/opengraph-image";

export function getSiteUrl(): URL {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://hiposta.com";
  return new URL(value.endsWith("/") ? value : `${value}/`);
}

export function absoluteUrl(path = "/"): string {
  return new URL(path.replace(/^\//, ""), getSiteUrl()).toString();
}

function socialImage(image?: string | null): string {
  if (!image) return absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH);
  const normalized = image.toLowerCase().split("?")[0];
  if (normalized.endsWith(".svg") || normalized.endsWith("/content-placeholder.svg")) return absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH);
  return image.startsWith("http://") || image.startsWith("https://") ? image : absoluteUrl(image);
}

export function publicMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}): Metadata {
  const canonical = absoluteUrl(path);
  const resolvedImage = socialImage(image);
  const images = [{ url: resolvedImage, alt: title }];
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      locale: "tr_TR",
      siteName: SITE_NAME,
      url: canonical,
      title,
      description,
      images,
      ...(type === "article" ? { publishedTime, modifiedTime, authors } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [resolvedImage] },
  };
}

export const privateRobotsMetadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
