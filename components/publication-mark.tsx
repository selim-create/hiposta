import type { CSSProperties } from "react";
import Link from "next/link";
import { PublicationLogo } from "@/components/publication-logo";
import type { Publication } from "@/lib/types";

type PublicationMarkProps = {
  publication: Publication;
  size?: "small" | "medium" | "large";
  linked?: boolean;
};

export function PublicationMark({ publication, size = "medium", linked = true }: PublicationMarkProps) {
  const style = {
    "--publication-color": publication.color,
    "--publication-foreground": publication.foreground,
  } as CSSProperties;

  const mark = (
    <span className={`publication-mark publication-mark--${size}`} style={style}>
      <PublicationLogo publication={publication} size={size} />
      <span className="publication-mark__name">{publication.name}</span>
    </span>
  );

  return linked ? <Link href={`/yayinlar/${publication.slug}`}>{mark}</Link> : mark;
}
