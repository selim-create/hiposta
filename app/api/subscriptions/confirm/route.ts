import { NextRequest, NextResponse } from "next/server";
import { coreAuthUrl } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const mode = body.mode === "batch" ? "batch" : "single";

    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json({ ok: false, code: "invalid_token" }, { status: 400 });
    }

    const path = mode === "batch" ? "/subscriptions/batch/confirm" : "/subscriptions/confirm";
    const core = await fetch(`${coreAuthUrl(path)}?token=${encodeURIComponent(token)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const payload = await core.json().catch(() => ({}));
    const response = NextResponse.json(payload, { status: core.status });
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch {
    return NextResponse.json({ ok: false, code: "service_unavailable" }, { status: 503 });
  }
}
