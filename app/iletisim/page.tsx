import { TrustPage } from "@/components/trust-page";
import { publicMetadata } from "@/lib/seo";
import { trustPages } from "@/lib/trust-pages";
export const metadata = publicMetadata({ title: "İletişim", description: "Hiposta okur desteği, reklam, yayın iş birlikleri ve kurumsal iletişim yönlendirmeleri.", path: "/iletisim" });
export default function ContactPage(){return <TrustPage page={trustPages.contact}/>;}
