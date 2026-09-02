import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { coreAuthUrl, getSessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const events = Array.isArray(body?.events) ? body.events.slice(0, 20) : [];
    if (!events.length) return NextResponse.json({ ok: false, code: "invalid_batch" }, { status: 422 });

    const anonymousId = String(events[0]?.anonymous_id ?? "").slice(0, 191);
    const analyticsIdentity = anonymousId
      ? createHash("sha256").update(anonymousId).digest("hex").slice(0, 32)
      : "anonymous";

    const token = await getSessionToken();
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": `HipostaAnalytics/${analyticsIdentity}`,
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const core = await fetch(coreAuthUrl("/analytics/events"), {
      method: "POST",
      headers,
      body: JSON.stringify({ events }),
      cache: "no-store",
    });
    const payload = await core.json().catch(() => ({}));
    return NextResponse.json(payload, {
      status: core.status,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      { ok: false, code: "analytics_unavailable" },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
