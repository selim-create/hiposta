import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Hiposta — İlgi alanın kadar posta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f3ee",
          color: "#15161a",
          padding: "72px 78px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 54, fontWeight: 900, letterSpacing: "-0.05em" }}>
            <span>hiposta</span><span style={{ color: "#3157ff" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#66645e" }}>Hip Medya yayın ağı</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 980 }}>
          <div style={{ display: "flex", fontSize: 86, lineHeight: 0.94, fontWeight: 900, letterSpacing: "-0.065em" }}>Okumaya değer olanı bul.</div>
          <div style={{ display: "flex", fontSize: 38, lineHeight: 1.15, color: "#57554f" }}>İstediğini gelen kutuna al.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700 }}>
          <span>İçerik · Bülten · Tek hesap</span>
          <span>hiposta.com</span>
        </div>
      </div>
    ),
    size,
  );
}
