import { TrustPage } from "@/components/trust-page";
import { publicMetadata } from "@/lib/seo";
import { trustPages } from "@/lib/trust-pages";

export const metadata = publicMetadata({ title: "Hiposta hakkında", description: "Hiposta’nın yayın, abonelik, kişiselleştirme ve içerik ürün modelini keşfet.", path: "/hakkimizda" });

export default function AboutPage() {
  return <TrustPage page={trustPages.about} />;
}
