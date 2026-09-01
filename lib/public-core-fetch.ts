export type PublicCoreFetchInit = RequestInit & { next?: { revalidate: number } };

const isDevelopment = process.env.NODE_ENV === "development";

export function publicCoreUrl(url: string): string {
  if (!isDevelopment) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}__hiposta_dev=${Date.now()}`;
}

export function publicCoreFetchInit(): PublicCoreFetchInit {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (isDevelopment) {
    headers["Cache-Control"] = "no-cache";
    return { headers, cache: "no-store" };
  }
  return { headers, next: { revalidate: 60 } };
}
