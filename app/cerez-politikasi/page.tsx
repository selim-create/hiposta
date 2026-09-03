import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/lib/legal-pages";
import { publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({ title: "Çerez ve Benzer Teknolojiler Politikası", description: "Hiposta’nın gerekli depolama, analitik tercihi ve tarayıcı teknolojileri yaklaşımı.", path: "/cerez-politikasi" });
export default function CookiePolicyPage() { return <LegalPage page={legalPages.cookies} />; }
