import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/lib/legal-pages";
import { publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({ title: "Kullanım Koşulları", description: "Hiposta web sitesi, içerik ve hesap özellikleri için kullanım koşulları.", path: "/kullanim-kosullari" });
export default function TermsPage() { return <LegalPage page={legalPages.terms} />; }
