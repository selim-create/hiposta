"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { Sponsorship } from "@/lib/types";

type Props = {
  sponsorship: Sponsorship;
  compact?: boolean;
};

export function SponsorshipBlock({ sponsorship, compact = false }: Props) {
  const href = sponsorship.ctaUrl || sponsorship.brand.websiteUrl;
  const label = sponsorship.disclosureLabel || "Sponsorlu içerik";
  const rootRef = useRef<HTMLElement | null>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || trackedRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5) || trackedRef.current) return;
      trackedRef.current = true;
      trackAnalyticsEvent({
        eventType: "sponsor_impression",
        sponsorshipPlacementId: sponsorship.id,
        meta: { source: "sponsorship_block", placement: sponsorship.placementKey },
      });
      observer.disconnect();
    }, { threshold: [0.5] });
    observer.observe(node);
    return () => observer.disconnect();
  }, [sponsorship.id, sponsorship.placementKey]);

  return (
    <aside ref={rootRef} className={`sponsorship-block${compact ? " sponsorship-block--compact" : ""}`} aria-label={`${label}: ${sponsorship.brand.name}`}>
      <div className="sponsorship-block__disclosure">
        <span>{label}</span>
        <strong>{sponsorship.brand.name}</strong>
      </div>

      <div className="sponsorship-block__body">
        {sponsorship.imageUrl && (
          <div className="sponsorship-block__image" role="img" aria-label={`${sponsorship.brand.name} sponsor görseli`} style={{ backgroundImage: `url(${JSON.stringify(sponsorship.imageUrl).slice(1, -1)})` } as CSSProperties} />
        )}

        <div className="sponsorship-block__copy">
          {sponsorship.brand.logoUrl && (
            <span className="sponsorship-block__logo" role="img" aria-label={`${sponsorship.brand.name} logosu`} style={{ backgroundImage: `url(${JSON.stringify(sponsorship.brand.logoUrl).slice(1, -1)})` } as CSSProperties} />
          )}
          {sponsorship.headline && <h2>{sponsorship.headline}</h2>}
          {sponsorship.bodyText && <p>{sponsorship.bodyText}</p>}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => trackAnalyticsEvent({ eventType: "sponsor_click", sponsorshipPlacementId: sponsorship.id, meta: { source: "sponsorship_block", placement: sponsorship.placementKey } })}
            >
              {sponsorship.ctaText || `${sponsorship.brand.name} hakkında bilgi al`} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
