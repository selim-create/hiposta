import { NextRequest, NextResponse } from "next/server";
import { coreAuthUrl, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password) return NextResponse.json({ ok: false, code: "invalid_request" }, { status: 400 });

    const core = await fetch(coreAuthUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      cache: "no-store",
      body: JSON.stringify({ email, password }),
    });
    const payload = await core.json().catch(() => ({}));
    if (!core.ok || !payload?.session_token) return NextResponse.json(payload, { status: core.status });

    const response = NextResponse.json({ ok: true, account: payload.account }, { status: 200 });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: String(payload.session_token),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, code: "service_unavailable" }, { status: 503 });
  }
}
