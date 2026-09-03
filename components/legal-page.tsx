import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { companyLegal, LEGAL_LAST_UPDATED, LEGAL_VERSION, type LegalPageDefinition } from "@/lib/legal-pages";

export function LegalPage({ page }: { page: LegalPageDefinition }) {
  return (
    <div className="trust-page legal-page">
      <header className="trust-hero page-shell">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="trust-hero__lead">{page.lead}</p>
        <div className="legal-meta" aria-label="Belge bilgisi">
          <span>Sürüm {LEGAL_VERSION}</span>
          <span>Son güncelleme: {LEGAL_LAST_UPDATED}</span>
        </div>
      </header>

      {page.showCompany && (
        <section className="legal-company page-shell" aria-labelledby="legal-company-title">
          <div>
            <p className="eyebrow">Veri sorumlusu / hizmet sağlayıcı</p>
            <h2 id="legal-company-title">{companyLegal.legalName}</h2>
            <p>{companyLegal.address}</p>
          </div>
          <dl>
            <div><dt>Vergi dairesi / no</dt><dd>{companyLegal.taxOffice} · {companyLegal.taxNumber}</dd></div>
            <div><dt>Sicil no</dt><dd>{companyLegal.registryNumber}</dd></div>
            <div><dt>MERSİS</dt><dd>{companyLegal.mersisNumber}</dd></div>
            <div><dt>İletişim</dt><dd><a href={`mailto:${companyLegal.contactEmail}`}>{companyLegal.contactEmail}</a> · <a href={`tel:${companyLegal.phone.replace(/\s/g, "")}`}>{companyLegal.phone}</a></dd></div>
            <div><dt>KVKK</dt><dd><a href={`mailto:${companyLegal.privacyEmail}`}>{companyLegal.privacyEmail}</a></dd></div>
          </dl>
        </section>
      )}

      <section className="trust-content page-shell">
        <aside>
          <span>Bu sayfada</span>
          <nav>{page.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav>
          <p className="legal-scope"><strong>Kapsam</strong>{page.scope}</p>
        </aside>
        <div className="trust-sections">
          {page.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <p className="eyebrow">{page.eyebrow}</p>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.items?.length ? <ul>{section.items.map((item) => <li key={item}><CheckCircle2 size={17} /><span>{item}</span></li>)}</ul> : null}
            </section>
          ))}
        </div>
      </section>

      <section className="legal-related page-shell" aria-label="İlgili yasal sayfalar">
        <span>İlgili belgeler</span>
        <div>
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma</Link>
          <Link href="/cerez-politikasi">Çerez Politikası</Link>
          <Link href="/kullanim-kosullari">Kullanım Koşulları</Link>
          <Link href="/uyelik-ve-abonelik-kosullari">Üyelik & Abonelik</Link>
        </div>
      </section>
    </div>
  );
}
