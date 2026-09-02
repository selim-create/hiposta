import { NextRequest, NextResponse } from "next/server";
import { coreAuthUrl, getSessionToken, SESSION_COOKIE } from "@/lib/auth";

type Context = { params: Promise<{ id: string }> };

function contentId(raw: string): number {
  const id = Number.parseInt(raw, 10);
  return Number.isSafeInteger(id) && id > 0 ? id : 0;
}

async function proxy(method: "GET" | "POST" | "DELETE", path: string) {
  try {
    const token = await getSessionToken();
    if (!token) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });

    const core = await fetch(coreAuthUrl(path), {
      method,
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const payload = await core.json().catch(() => ({}));
    const response = NextResponse.json(payload, { status: core.status });
    response.headers.set("Cache-Control", "private, no-store");
    if (core.status === 401) response.cookies.delete(SESSION_COOKIE);
    return response;
  } catch {
    return NextResponse.json({ ok: false, code: "service_unavailable" }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
}

export async function GET(_: NextRequest, { params }: Context) {
  const id = contentId((await params).id);
  if (!id) return NextResponse.json({ ok: false, code: "invalid_content_id" }, { status: 400 });
  return proxy("GET", `/me/content-state/${id}`);
}

export async function POST(_: NextRequest, { params }: Context) {
  const id = contentId((await params).id);
  if (!id) return NextResponse.json({ ok: false, code: "invalid_content_id" }, { status: 400 });
  return proxy("POST", `/me/content/${id}/save`);
}

export async function DELETE(_: NextRequest, { params }: Context) {
  const id = contentId((await params).id);
  if (!id) return NextResponse.json({ ok: false, code: "invalid_content_id" }, { status: 400 });
  return proxy("DELETE", `/me/content/${id}/save`);
}

export async function PATCH(_: NextRequest, { params }: Context) {
  const id = contentId((await params).id);
  if (!id) return NextResponse.json({ ok: false, code: "invalid_content_id" }, { status: 400 });
  return proxy("POST", `/me/content/${id}/view`);
}
