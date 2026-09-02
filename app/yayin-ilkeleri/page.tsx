import { TrustPage } from "@/components/trust-page";
import { publicMetadata } from "@/lib/seo";
import { trustPages } from "@/lib/trust-pages";
export const metadata = publicMetadata({ title: "Yayın ilkeleri", description: "Hiposta’nın editoryal bağımsızlık, kaynak, doğruluk ve yayın sonrası sorumluluk ilkeleri.", path: "/yayin-ilkeleri" });
export default function EditorialPrinciplesPage(){return <TrustPage page={trustPages.editorial}/>;}
