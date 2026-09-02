import { TrustPage } from "@/components/trust-page";
import { publicMetadata } from "@/lib/seo";
import { trustPages } from "@/lib/trust-pages";
export const metadata = publicMetadata({ title: "Düzeltme politikası", description: "Hiposta’nın maddi hata, güncelleme ve düzeltme yaklaşımı.", path: "/duzeltme-politikasi" });
export default function CorrectionsPolicyPage(){return <TrustPage page={trustPages.corrections}/>;}
