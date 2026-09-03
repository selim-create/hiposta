import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/lib/legal-pages";
import { publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({ title: "KVKK Aydınlatma Metni", description: "Hiposta internet sitesi, hesap ve abonelik süreçleri için KVKK aydınlatma metni.", path: "/kvkk-aydinlatma-metni" });
export default function KvkkPage() { return <LegalPage page={legalPages.kvkk} />; }
