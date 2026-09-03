import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/json-ld";
import { PrivacyConsentCenter } from "@/components/privacy-consent";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, DEFAULT_SOCIAL_IMAGE_PATH, getSiteUrl, SITE_DESCRIPTION } from "@/lib/seo";
import "./globals.css";
import "./newsletter-issues.css";
import "./visual-foundation-v2.css";
import "./product-surfaces-v2.css";
import "./account-v1.css";
import "./auth-recovery-v1.css";
import "./premium-article-fix.css";
import "./content-experience-v2.css";
import "./newsletter-wizard-v2.css";
import "./newsletter-wizard-v5.css";
import "./newsletter-account-manager.css";
import "./newsletter-growth-v2.css";
import "./sponsorship-v1.css";
import "./personalisation-v1.css";
import "./personalised-discovery-v1.css";
import "./editorial-network-v1.css";
import "./trust-corporate-v1.css";
import "./privacy-consent-v1.css";
import "./footer-polish-v1.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: "Hiposta — İlgi alanın kadar posta", template: "%s — Hiposta" },
  description: SITE_DESCRIPTION,
  applicationName: "Hiposta",
  keywords: ["Hiposta", "Hip Medya", "e-posta bülteni", "premium içerik", "yayın platformu"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Hiposta",
    url: absoluteUrl("/"),
    title: "Hiposta — İlgi alanın kadar posta",
    description: SITE_DESCRIPTION,
    images: [{ url: absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH), alt: "Hiposta — İlgi alanın kadar posta" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hiposta — İlgi alanın kadar posta",
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH)],
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
        <PrivacyConsentCenter />
      </body>
    </html>
  );
}
