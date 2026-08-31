import Image from "next/image";
import type { CSSProperties } from "react";
import type { Publication } from "@/lib/types";

type Props = {
  publication: Publication;
  size?: "small" | "medium" | "large";
  className?: string;
};

const dimensions = {
  small: { width: 38, height: 38 },
  medium: { width: 56, height: 56 },
  large: { width: 86, height: 86 },
};

export function PublicationLogo({ publication, size = "medium", className = "" }: Props) {
  const box = dimensions[size];
  const style = {
    "--publication-color": publication.color,
    "--publication-foreground": publication.foreground,
  } as CSSProperties;

  if (publication.logoUrl) {
    return (
      <span className={`publication-logo publication-logo--${size} publication-logo--image ${className}`.trim()} style={style}>
        <Image
          src={publication.logoUrl}
          alt={`${publication.name} logosu`}
          width={box.width * 2}
          height={box.height * 2}
          sizes={`${box.width}px`}
          className="publication-logo__image"
        />
      </span>
    );
  }

  return (
    <span
      className={`publication-logo publication-logo--${size} publication-logo--fallback ${className}`.trim()}
      style={style}
      aria-label={`${publication.name} logo yerine monogram`}
    >
      <span>{publication.monogram}</span>
    </span>
  );
}
