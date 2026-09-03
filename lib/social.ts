import { absoluteUrl } from "@/lib/seo";

export function socialCardUrl({
  kind,
  eyebrow,
  title,
  description,
  accent,
  background,
}: {
  kind: string;
  eyebrow: string;
  title: string;
  description: string;
  accent?: string | null;
  background?: string | null;
}) {
  const params = new URLSearchParams({ kind, eyebrow, title, description });
  if (accent) params.set("accent", accent);
  if (background) params.set("background", background);
  return absoluteUrl(`/api/og?${params.toString()}`);
}
