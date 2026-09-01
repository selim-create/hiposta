import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, data: session }, { status: 200, headers: { "Cache-Control": "private, no-store" } });
}
