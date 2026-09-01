import { NextRequest, NextResponse } from "next/server";
import { coreAuthUrl } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const displayName = typeof body.display_name === "string" ? body.display_name.trim() : "";
    if (!email || !password) return NextResponse.json({ ok: false, code: "invalid_request" }, { status: 400 });

    const core = await fetch(coreAuthUrl("/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      cache: "no-store",
      body: JSON.stringify({ email, password, display_name: displayName }),
    });
    const payload = await core.json().catch(() => ({}));
    return NextResponse.json(payload, { status: core.status });
  } catch {
    return NextResponse.json({ ok: false, code: "service_unavailable" }, { status: 503 });
  }
}
