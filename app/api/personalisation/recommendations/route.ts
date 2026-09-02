import { NextRequest, NextResponse } from "next/server";
import { coreAuthUrl, getSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { mapApiArticle, type ApiContentItem } from "@/lib/content";

type CorePayload = {
  ok?: boolean;
  data?: {
    items?: Array<{ content: ApiContentItem; score: number; reason: string }>;
    meta?: Record<string, unknown>;
  };
};

export async function GET(request: NextRequest) {
  try {
    const token = await getSessionToken();
    if (!token) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });

    const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? 6);
    const limit = Math.min(24, Math.max(1, Number.isFinite(limitParam) ? Math.floor(limitParam) : 6));
    const core = await fetch(coreAuthUrl(`/me/recommendations?limit=${limit}`), {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const payload = await core.json().catch(() => ({})) as CorePayload;
    const body = core.ok && payload.ok && payload.data
      ? {
          ok: true,
          data: {
            items: Array.isArray(payload.data.items)
              ? payload.data.items.map((item) => ({ article: mapApiArticle(item.content), score: Number(item.score) || 0, reason: String(item.reason || "Senin için seçildi") }))
              : [],
            meta: payload.data.meta ?? {},
          },
        }
      : payload;

    const response = NextResponse.json(body, { status: core.status });
    response.headers.set("Cache-Control", "private, no-store");
    if (core.status === 401) response.cookies.delete(SESSION_COOKIE);
    return response;
  } catch {
    return NextResponse.json({ ok: false, code: "service_unavailable" }, { status: 503 });
  }
}
