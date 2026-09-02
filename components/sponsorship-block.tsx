import type { CSSProperties } from "react";
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
          <div
            className="sponsorship-block__image"
            role="img"
            aria-label={`${sponsorship.brand.name} sponsor görseli`}
            style={{ backgroundImage: `url(${JSON.stringify(sponsorship.imageUrl).slice(1, -1)})` } as CSSProperties}
          />
        )}

        <div className="sponsorship-block__copy">
          {sponsorship.brand.logoUrl && (
            <span
              className="sponsorship-block__logo"
              role="img"
              aria-label={`${sponsorship.brand.name} logosu`}
              style={{ backgroundImage: `url(${JSON.stringify(sponsorship.brand.logoUrl).slice(1, -1)})` } as CSSProperties}
            />
          )}
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
