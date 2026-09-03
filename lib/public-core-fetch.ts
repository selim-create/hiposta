export type PublicCoreFetchInit = RequestInit & { next?: { revalidate: number } };

const isDevelopment = process.env.NODE_ENV === "development";
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
const SUCCESS_CACHE_MS = isDevelopment ? 5_000 : 30_000;
const FAILURE_CACHE_MS = 5_000;

type ResponseSnapshot = {
  body: string;
  status: number;
  statusText: string;
  headers: Array<[string, string]>;
  expiresAt: number;
};

const inFlight = new Map<string, Promise<ResponseSnapshot>>();
const responseCache = new Map<string, ResponseSnapshot>();

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

function cacheKey(url: string, init: PublicCoreFetchInit): string | null {
  const method = String(init.method ?? "GET").toUpperCase();
  return method === "GET" ? `${method}:${url}` : null;
}

function responseFromSnapshot(snapshot: ResponseSnapshot): Response {
  return new Response(snapshot.body, {
    status: snapshot.status,
    statusText: snapshot.statusText,
    headers: snapshot.headers,
  });
}

async function requestWithRetry(url: string, init: PublicCoreFetchInit, attempts: number): Promise<Response> {
  let lastResponse: Response | null = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const response = await fetch(publicCoreUrl(url), init);
    lastResponse = response;
    if (!RETRYABLE_STATUSES.has(response.status) || attempt === attempts - 1) return response;
    await sleep(retryDelay(response, attempt));
  }
  return lastResponse as Response;
}

async function snapshotResponse(response: Response): Promise<ResponseSnapshot> {
  const ttl = response.ok ? SUCCESS_CACHE_MS : FAILURE_CACHE_MS;
  return {
    body: await response.text(),
    status: response.status,
    statusText: response.statusText,
    headers: Array.from(response.headers.entries()),
    expiresAt: Date.now() + ttl,
  };
}

export async function fetchPublicCore(url: string, init: PublicCoreFetchInit = publicCoreFetchInit(), attempts = 3): Promise<Response> {
  const key = cacheKey(url, init);
  if (!key) return requestWithRetry(url, init, attempts);

  const now = Date.now();
  const cached = responseCache.get(key);
  if (cached && cached.expiresAt > now) return responseFromSnapshot(cached);
  if (cached) responseCache.delete(key);

  let pending = inFlight.get(key);
  if (!pending) {
    pending = requestWithRetry(url, init, attempts).then(async (response) => {
      const snapshot = await snapshotResponse(response);
      responseCache.set(key, snapshot);
      return snapshot;
    });
    inFlight.set(key, pending);
    void pending.then(
      () => { inFlight.delete(key); },
      () => { inFlight.delete(key); },
    );
  }

  return responseFromSnapshot(await pending);
}

export function allowDevelopmentMockFallback(): boolean {
  return isDevelopment && process.env.HIPOSTA_ENABLE_MOCK_FALLBACK === "true";
}
