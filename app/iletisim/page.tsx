import { TrustPage } from "@/components/trust-page";
import { companyLegal } from "@/lib/legal-pages";
import { publicMetadata } from "@/lib/seo";
import { trustPages } from "@/lib/trust-pages";

export const metadata = publicMetadata({ title: "İletişim", description: "Hiposta okur desteği, reklam, yayın iş birlikleri ve kurumsal iletişim yönlendirmeleri.", path: "/iletisim" });

export default function ContactPage() {
  return <>
    <TrustPage page={trustPages.contact} />
    <section className="legal-company contact-company page-shell" aria-labelledby="contact-company-title">
      <div>
        <p className="eyebrow">Resmî iletişim</p>
        <h2 id="contact-company-title">{companyLegal.legalName}</h2>
        <p>{companyLegal.address}</p>
      </div>
      <dl>
        <div><dt>Genel iletişim</dt><dd><a href={`mailto:${companyLegal.contactEmail}`}>{companyLegal.contactEmail}</a></dd></div>
        <div><dt>Telefon</dt><dd><a href={`tel:${companyLegal.phone.replace(/\s/g, "")}`}>{companyLegal.phone}</a></dd></div>
        <div><dt>KVKK / veri talepleri</dt><dd><a href={`mailto:${companyLegal.privacyEmail}`}>{companyLegal.privacyEmail}</a></dd></div>
        <div><dt>MERSİS</dt><dd>{companyLegal.mersisNumber}</dd></div>
      </dl>
    </section>
  </>;
}
