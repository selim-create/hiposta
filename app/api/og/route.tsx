import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const size = { width: 1200, height: 630 };

function safeColor(value: string | null, fallback: string) {
  return value && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

function clampText(value: string | null, fallback: string, max: number) {
  const text = (value || fallback).trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const kind = clampText(params.get("kind"), "Hiposta", 40);
  const eyebrow = clampText(params.get("eyebrow"), "Hip Medya yayın ağı", 70);
  const title = clampText(params.get("title"), "Hiposta", 120);
  const description = clampText(params.get("description"), "İçerik, bülten ve yayın platformu", 180);
  const accent = safeColor(params.get("accent"), "#3157ff");
  const background = safeColor(params.get("background"), "#f5f3ee");

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background, color: "#15161a", padding: "66px 74px", fontFamily: "Arial, sans-serif", borderTop: `18px solid ${accent}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 50, fontWeight: 900, letterSpacing: "-0.05em" }}><span>hiposta</span><span style={{ color: accent }}>.</span></div>
        <div style={{ display: "flex", padding: "10px 16px", border: "2px solid #15161a", fontSize: 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>{kind}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 1020 }}>
        <div style={{ display: "flex", color: accent, fontSize: 23, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>{eyebrow}</div>
        <div style={{ display: "flex", fontSize: title.length > 72 ? 58 : 70, lineHeight: 0.96, fontWeight: 900, letterSpacing: "-0.055em" }}>{title}</div>
        <div style={{ display: "flex", maxWidth: 900, fontSize: 25, lineHeight: 1.3, color: "#5f5c55" }}>{description}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 18, fontWeight: 700 }}><span>Hip Medya yayın ağı</span><span>hiposta.com</span></div>
    </div>,
    { ...size, headers: { "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
