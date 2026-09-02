import { redirect } from "next/navigation";
import { AccountNavigation } from "@/components/account-navigation";
import { LogoutButton } from "@/components/logout-button";
import { getAuthSession } from "@/lib/auth";
import { privateRobotsMetadata } from "@/lib/seo";

export const metadata = privateRobotsMetadata;

export default async function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getAuthSession();
  if (!session) redirect("/giris");

  return (
    <section className="account-page account-page--hub page-shell">
      <header className="account-hero account-hero--compact">
        <div>
          <p className="eyebrow">Hiposta hesabı</p>
          <h1>{session.account.display_name || "Hesabın"}</h1>
          <p>{session.account.email}</p>
        </div>
        <LogoutButton />
      </header>
      <AccountNavigation />
      <div className="account-module">{children}</div>
    </section>
  );
}
