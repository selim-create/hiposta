import Link from "next/link";

type LogoProps = {
  inverse?: boolean;
  compact?: boolean;
  linked?: boolean;
};

function Wordmark({ inverse = false, compact = false }: Omit<LogoProps, "linked">) {
  return (
    <span className={`wordmark${inverse ? " wordmark--inverse" : ""}${compact ? " wordmark--compact" : ""}`}>
      <span className="wordmark__name" aria-label="hiposta.">
        hiposta<span className="wordmark__dot" aria-hidden="true">.</span>
      </span>
      {!compact && <span className="wordmark__descriptor">seç · oku · gelen kutuna al</span>}
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
