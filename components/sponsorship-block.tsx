import Image from "next/image";
import type { Sponsorship } from "@/lib/types";

type Props = {
  sponsorship: Sponsorship;
  compact?: boolean;
};

export function SponsorshipBlock({ sponsorship, compact = false }: Props) {
  const href = sponsorship.ctaUrl || sponsorship.brand.websiteUrl;
  const label = sponsorship.disclosureLabel || "Sponsorlu içerik";

  return (
    <aside className={`sponsorship-block${compact ? " sponsorship-block--compact" : ""}`} aria-label={`${label}: ${sponsorship.brand.name}`}>
      <div className="sponsorship-block__disclosure">
        <span>{label}</span>
        <strong>{sponsorship.brand.name}</strong>
      </div>

      <div className="sponsorship-block__body">
        {sponsorship.imageUrl && (
          <div className="sponsorship-block__image">
            <Image src={sponsorship.imageUrl} alt="" fill sizes={compact ? "180px" : "(max-width: 760px) 100vw, 360px"} />
          </div>
        )}

        <div className="sponsorship-block__copy">
          {sponsorship.brand.logoUrl && <img className="sponsorship-block__logo" src={sponsorship.brand.logoUrl} alt={`${sponsorship.brand.name} logosu`} />}
          {sponsorship.headline && <h2>{sponsorship.headline}</h2>}
          {sponsorship.bodyText && <p>{sponsorship.bodyText}</p>}
          {href && (
            <a href={href} target="_blank" rel="sponsored noopener noreferrer">
              {sponsorship.ctaText || `${sponsorship.brand.name} hakkında bilgi al`} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
