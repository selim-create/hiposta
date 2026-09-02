import { TrustPage } from "@/components/trust-page";
import { publicMetadata } from "@/lib/seo";
import { trustPages } from "@/lib/trust-pages";
export const metadata = publicMetadata({ title: "Reklam ve sponsorluk ilkeleri", description: "Hiposta’nın reklam, sponsorluk, etiketleme ve editoryal sınır ilkeleri.", path: "/reklam-ve-sponsorluk-ilkeleri" });
export default function SponsorshipPrinciplesPage(){return <TrustPage page={trustPages.sponsorship}/>;}
