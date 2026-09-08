import { NextRequest, NextResponse } from "next/server";
import { coreAuthUrl, getSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = await getSessionToken();
    if (!token) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });

    const body = await request.json();
    const changes = Array.isArray(body?.changes) ? body.changes : [];
    if (!changes.length || changes.length > 25) {
      return NextResponse.json({ ok: false, code: "invalid_request" }, { status: 400 });
    }

    const core = await fetch(coreAuthUrl("/auth/preferences/newsletters/batch"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({ changes }),
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
