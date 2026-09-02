import type { Metadata } from "next";
import { AccountContentCollection } from "@/components/account-content-collection";
import { getSavedContent } from "@/lib/personalisation";

export const metadata: Metadata = { title: "Kaydettiklerim", description: "Hiposta kişisel kütüphanen." };

export default async function SavedPage() {
  const items = await getSavedContent(30);
  return <AccountContentCollection mode="saved" eyebrow="Kütüphanen" title="Kaydettiklerin" description="Sonra dönmek istediğin içerikleri kişisel Hiposta kütüphanende tut." items={items} />;
}
