import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "./newsletter-issues.css";
import "./visual-foundation-v2.css";
import "./product-surfaces-v2.css";
import "./account-v1.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiposta.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Hiposta — İlgi alanın kadar posta", template: "%s — Hiposta" },
  description: "Hip Medya’nın yayınlarından içerikleri, premium dosyaları ve seçtiğin e-posta bültenlerini tek merkezde keşfet.",
  applicationName: "Hiposta",
  keywords: ["Hiposta", "Hip Medya", "e-posta bülteni", "premium içerik", "yayın platformu"],
  openGraph: { type: "website", locale: "tr_TR", siteName: "Hiposta", title: "Hiposta — İlgi alanın kadar posta", description: "Farklı yayınlar, tek keşif ve abonelik deneyimi." },
  twitter: { card: "summary_large_image", title: "Hiposta — İlgi alanın kadar posta", description: "Farklı yayınlar, tek keşif ve abonelik deneyimi." },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { colorScheme: "light", themeColor: "#f5f3ee" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">İçeriğe geç</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
