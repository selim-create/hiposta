import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/lib/legal-pages";
import { publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({ title: "Gizlilik Politikası", description: "Hiposta’nın kişisel veri, hesap, abonelik, kişiselleştirme ve isteğe bağlı analitik yaklaşımı.", path: "/gizlilik-politikasi" });
export default function PrivacyPolicyPage() { return <LegalPage page={legalPages.privacy} />; }
