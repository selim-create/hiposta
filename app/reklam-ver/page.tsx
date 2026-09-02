import { TrustPage } from "@/components/trust-page";
import { publicMetadata } from "@/lib/seo";
import { trustPages } from "@/lib/trust-pages";

export const metadata = publicMetadata({ title: "Reklam ver", description: "Hiposta yayın ağı için içerik ve bülten sponsorluk modellerini keşfet.", path: "/reklam-ver" });

export default function AdvertisePage() {
  return <TrustPage page={trustPages.advertise} />;
}
