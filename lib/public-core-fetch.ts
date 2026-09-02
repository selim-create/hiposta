export type PublicCoreFetchInit = RequestInit & { next?: { revalidate: number } };

const isDevelopment = process.env.NODE_ENV === "development";
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

export function publicCoreUrl(url: string): string {
  return url;
}

export function publicCoreFetchInit(): PublicCoreFetchInit {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (isDevelopment) {
    headers["Cache-Control"] = "no-cache";
    return { headers, cache: "no-store" };
  }
  return { headers, next: { revalidate: 60 } };
}

function retryDelay(response: Response, attempt: number): number {
  const retryAfter = response.headers.get("retry-after");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.min(5000, seconds * 1000);
  }
  return Math.min(2400, 300 * Math.pow(2, attempt));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPublicCore(url: string, init: PublicCoreFetchInit = publicCoreFetchInit(), attempts = 3): Promise<Response> {
  let lastResponse: Response | null = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const response = await fetch(publicCoreUrl(url), init);
    lastResponse = response;
    if (!RETRYABLE_STATUSES.has(response.status) || attempt === attempts - 1) return response;
    await sleep(retryDelay(response, attempt));
  }
  return lastResponse as Response;
}

export function allowDevelopmentMockFallback(): boolean {
  return isDevelopment && process.env.HIPOSTA_ENABLE_MOCK_FALLBACK === "true";
}
