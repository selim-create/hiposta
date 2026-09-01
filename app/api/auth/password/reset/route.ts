import { NextRequest, NextResponse } from "next/server";
import { coreAuthUrl } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")?.trim() ?? "";
    if (!token) return NextResponse.json({ ok: false, code: "invalid_token" }, { status: 400 });
    const core = await fetch(`${coreAuthUrl("/auth/password/reset")}?token=${encodeURIComponent(token)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const payload = await core.json().catch(() => ({}));
    const response = NextResponse.json(payload, { status: core.status });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ ok: false, code: "service_unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!token || !password) return NextResponse.json({ ok: false, code: "invalid_request" }, { status: 400 });

    const core = await fetch(coreAuthUrl("/auth/password/reset"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      cache: "no-store",
      body: JSON.stringify({ token, password }),
    });
    const payload = await core.json().catch(() => ({}));
    const response = NextResponse.json(payload, { status: core.status });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ ok: false, code: "service_unavailable" }, { status: 503 });
  }
}
