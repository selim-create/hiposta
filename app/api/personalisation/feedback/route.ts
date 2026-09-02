import { NextRequest, NextResponse } from "next/server";
import { coreAuthUrl, getSessionToken, SESSION_COOKIE } from "@/lib/auth";

const allowed = new Set([
  "dismiss_content",
  "restore_content",
  "more_category",
  "less_category",
  "more_publication",
  "less_publication",
]);

export async function POST(request: NextRequest) {
  try {
    const token = await getSessionToken();
    if (!token) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({})) as { content_id?: number; action?: string };
    const contentId = Number(body.content_id ?? 0);
    const action = String(body.action ?? "");
    if (!Number.isInteger(contentId) || contentId <= 0 || !allowed.has(action)) {
      return NextResponse.json({ ok: false, code: "invalid_feedback" }, { status: 422 });
    }

    const core = await fetch(coreAuthUrl("/me/recommendations/feedback"), {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content_id: contentId, action }),
      cache: "no-store",
    });
    const payload = await core.json().catch(() => ({}));
    const response = NextResponse.json(payload, { status: core.status });
    response.headers.set("Cache-Control", "private, no-store");
    if (core.status === 401) response.cookies.delete(SESSION_COOKIE);
    return response;
  } catch {
    return NextResponse.json({ ok: false, code: "service_unavailable" }, { status: 503 });
  }
}
