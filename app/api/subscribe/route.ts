import { NextRequest, NextResponse } from "next/server";

const CORE_BASE_URL = (process.env.HIPOSTA_CORE_URL ?? "https://api.hiposta.com/wp-json/hiposta/v1").replace(/\/$/, "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const newsletters = Array.isArray(body.newsletters)
      ? body.newsletters.filter((item: unknown): item is string => typeof item === "string" && item.length > 0)
      : [];

    if (!email || !newsletters.length || body.consent !== true) {
      return NextResponse.json({ ok: false, code: "invalid_request" }, { status: 400 });
    }

    const response = await fetch(`${CORE_BASE_URL}/subscriptions/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        email,
        newsletters,
        consent: true,
        consent_version: "v1",
        source: "hiposta-web",
        locale: "tr",
      }),
    });

    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, code: "service_unavailable" }, { status: 503 });
  }
}
