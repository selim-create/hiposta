"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NewsletterAccountManager } from "@/components/newsletter-account-manager";
import { NewsletterGuestWizard } from "@/components/newsletter-guest-wizard";
import { getClientAuthSession, type ClientAuthSession } from "@/lib/client-session";
import type { Category, Newsletter, NewsletterBundle, Publication } from "@/lib/types";

type Props = {
  categories: Category[];
  newsletters: Newsletter[];
  bundles: NewsletterBundle[];
  publications: Publication[];
  activeNewsletterCount: number;
  categoryCount: number;
};

export function NewsletterDirectoryExperience({ categories, newsletters, bundles, publications, activeNewsletterCount, categoryCount }: Props) {
  const [session, setSession] = useState<ClientAuthSession | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    void getClientAuthSession().then((value) => { if (active) setSession(value); });
    return () => { active = false; };
  }, []);

  const activeSlugs = useMemo(
    () => session?.subscriptions.filter((item) => item.status === "active").map((item) => item.newsletter_slug) ?? [],
    [session],
  );

  if (session === undefined) {
    return (
      <>
        <section className="newsletter-directory-hero page-shell">
          <div><p className="eyebrow">{activeNewsletterCount} bülten · {categoryCount} kategori</p><h1>Gelen kutun,<br /><span>senin yayın akışın.</span></h1></div>
          <div><p>Bülten deneyimin hazırlanıyor.</p></div>
        </section>
        <section className="newsletter-directory newsletter-directory--wizard page-shell"><div className="loading-page" role="status" aria-live="polite"><span /><span /><span /><span className="sr-only">Bülten tercihleri yükleniyor</span></div></section>
      </>
    );
  }

  return (
    <>
      <section className={`newsletter-directory-hero page-shell${session ? " newsletter-directory-hero--account" : ""}`}>
        {session ? (
          <>
            <div>
              <p className="eyebrow">{activeNewsletterCount} aktif bülten · hesabına bağlı</p>
              <h1>Bültenlerini,<br /><span>tek yerden yönet.</span></h1>
            </div>
            <div>
              <p>Yeni bir onboarding tamamlamana gerek yok. Mevcut aboneliklerini gör, paketlerle hızlı seçim yap ve değişikliklerini hesabına kaydet.</p>
              <dl><div><dt>{String(activeSlugs.length).padStart(2, "0")}</dt><dd>Aktif bülten</dd></div><div><dt>01</dt><dd>Seçimini düzenle</dd></div><div><dt>02</dt><dd>Değişiklikleri kaydet</dd></div></dl>
            </div>
          </>
        ) : (
          <>
            <div><p className="eyebrow">{activeNewsletterCount} bülten · {categoryCount} kategori</p><h1>Gelen kutun,<br /><span>senin yayın akışın.</span></h1></div>
            <div><p>Önce ilgi alanını, sonra takip etmek istediğin yayınları seç. Yalnızca sana uygun bültenleri gör, istersen hazır paketlerle seçimini genişlet ve tek adımda tamamla.</p><dl><div><dt>01</dt><dd>İlgi alanını seç</dd></div><div><dt>02</dt><dd>Yayınlarını belirle</dd></div><div><dt>03</dt><dd>Bültenlerini oluştur</dd></div></dl></div>
          </>
        )}
      </section>

      <section className="newsletter-directory newsletter-directory--wizard page-shell">
        {session ? (
          <NewsletterAccountManager
            email={session.account.email}
            verified={session.account.email_verified}
            activeSlugs={activeSlugs}
            newsletters={newsletters}
            bundles={bundles}
            publications={publications}
          />
        ) : (
          <>
            <NewsletterGuestWizard categories={categories} newsletters={newsletters} bundles={bundles} publications={publications} />
            <p className="legal-inline-notice legal-inline-notice--wizard">Bülten seçimi sırasında verdiğin e-posta ve tercihlerin nasıl işlendiğini <Link href="/kvkk-aydinlatma-metni" target="_blank">KVKK Aydınlatma Metni</Link>, abonelik kurallarını <Link href="/uyelik-ve-abonelik-kosullari" target="_blank">Üyelik ve Abonelik Koşulları</Link> açıklar.</p>
          </>
        )}
      </section>
    </>
  );
}
