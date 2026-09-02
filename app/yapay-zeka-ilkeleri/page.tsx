import { TrustPage } from "@/components/trust-page";
import { publicMetadata } from "@/lib/seo";
import { trustPages } from "@/lib/trust-pages";
export const metadata = publicMetadata({ title: "Yapay zekâ ilkeleri", description: "Hiposta’nın yapay zekâ destekli üretim, insan kontrolü ve doğrulama ilkeleri.", path: "/yapay-zeka-ilkeleri" });
export default function AiPrinciplesPage(){return <TrustPage page={trustPages.ai}/>;}
