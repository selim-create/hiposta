import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  inverse?: boolean;
  compact?: boolean;
  linked?: boolean;
};

function Wordmark({ inverse = false, compact = false }: Omit<LogoProps, "linked">) {
  const src = inverse ? "/brand/hiposta-wordmark-light.svg" : "/brand/hiposta-wordmark-dark.svg";
  const width = compact ? 138 : 168;
  const height = compact ? 39 : 47;

  return (
    <span className={`wordmark${inverse ? " wordmark--inverse" : ""}${compact ? " wordmark--compact" : ""}`}>
      <Image src={src} alt="Hiposta" width={width} height={height} priority={!compact} />
      {!compact && <span className="wordmark__descriptor">Hip Medya bülten platformu</span>}
    </span>
  );
}

export function Logo({ inverse = false, compact = false, linked = true }: LogoProps) {
  if (!linked) return <Wordmark inverse={inverse} compact={compact} />;
  return (
    <Link className="wordmark-link" href="/" aria-label="Hiposta ana sayfa">
      <Wordmark inverse={inverse} compact={compact} />
    </Link>
  );
}
