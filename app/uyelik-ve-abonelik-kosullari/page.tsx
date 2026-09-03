import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/lib/legal-pages";
import { publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({ title: "Üyelik ve Abonelik Koşulları", description: "Hiposta hesap, ücretsiz bülten aboneliği ve ileti tercihleri için üyelik ve abonelik koşulları.", path: "/uyelik-ve-abonelik-kosullari" });
export default function MembershipTermsPage() { return <LegalPage page={legalPages.membership} />; }
