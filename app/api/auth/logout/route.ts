import { NextResponse } from "next/server";
import { coreAuthUrl, getSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const token = await getSessionToken();
  if (token) {
    await fetch(coreAuthUrl("/auth/logout"), {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => null);
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ name: SESSION_COOKIE, value: "", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
