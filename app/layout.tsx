import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, getSiteUrl, SITE_DESCRIPTION } from "@/lib/seo";
import "./globals.css";
import "./newsletter-issues.css";
import "./visual-foundation-v2.css";
import "./product-surfaces-v2.css";
import "./account-v1.css";
import "./auth-recovery-v1.css";
import "./premium-article-fix.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: "Hiposta — İlgi alanın kadar posta", template: "%s — Hiposta" },
  description: SITE_DESCRIPTION,
  applicationName: "Hiposta",
  keywords: ["Hiposta", "Hip Medya", "e-posta bülteni", "premium içerik", "yayın platformu"],
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Hiposta",
    url: absoluteUrl("/"),
    title: "Hiposta — İlgi alanın kadar posta",
    description: "Farklı yayınlar, tek keşif ve abonelik deneyimi.",
    images: [{ url: absoluteUrl("/hiposta-logo.svg"), alt: "Hiposta" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hiposta — İlgi alanın kadar posta",
    description: "Farklı yayınlar, tek keşif ve abonelik deneyimi.",
    images: [absoluteUrl("/hiposta-logo.svg")],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { colorScheme: "light", themeColor: "#f5f3ee" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hiposta",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/hiposta-logo.svg"),
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hiposta",
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    inLanguage: "tr-TR",
  };

  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body>
        <JsonLd data={[organization, website]} />
        <a className="skip-link" href="#main-content">İçeriğe geç</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
