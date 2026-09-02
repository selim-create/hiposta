import { NextRequest, NextResponse } from "next/server";
import { coreAuthUrl, getSessionToken, SESSION_COOKIE } from "@/lib/auth";

async function forward(path: string, init?: RequestInit) {
  try {
    const token = await getSessionToken();
    if (!token) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
    const core = await fetch(coreAuthUrl(path), {
      ...init,
      headers: { Accept: "application/json", Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
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

export async function GET() {
  return forward("/me/preferences");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { action?: string };
  if (body.action !== "reset") return NextResponse.json({ ok: false, code: "invalid_action" }, { status: 422 });
  return forward("/me/preferences/reset", { method: "POST" });
}

export async function DELETE(request: NextRequest) {
  const entityType = request.nextUrl.searchParams.get("entity_type") ?? "";
  const entityId = Number(request.nextUrl.searchParams.get("entity_id") ?? 0);
  if (!new Set(["category", "publication"]).has(entityType) || !Number.isInteger(entityId) || entityId <= 0) {
    return NextResponse.json({ ok: false, code: "invalid_preference" }, { status: 422 });
  }
  return forward(`/me/preferences/${entityType}/${entityId}`, { method: "DELETE" });
}
