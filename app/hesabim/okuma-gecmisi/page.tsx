import type { Metadata } from "next";
import { AccountContentCollection } from "@/components/account-content-collection";
import { getReadingHistory } from "@/lib/personalisation";

export const metadata: Metadata = { title: "Okuma Geçmişi", description: "Hiposta okuma geçmişin." };

export default async function ReadingHistoryPage() {
  const items = await getReadingHistory(30);
  return <AccountContentCollection mode="history" eyebrow="Okuma geçmişi" title="Son okudukların" description="Giriş yapmışken açtığın içeriklere kaldığın yerden kolayca geri dön." items={items} />;
}
