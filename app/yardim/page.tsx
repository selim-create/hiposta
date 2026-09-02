import { TrustPage } from "@/components/trust-page";
import { publicMetadata } from "@/lib/seo";
import { trustPages } from "@/lib/trust-pages";
export const metadata = publicMetadata({ title: "Yardım Merkezi", description: "Hiposta hesap, abonelik, içerik, kişiselleştirme ve premium yardım merkezi.", path: "/yardim" });
export default function HelpPage(){return <TrustPage page={trustPages.help}/>;}
