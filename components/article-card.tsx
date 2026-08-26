import type { CSSProperties } from "react";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCategory, getPublication } from "@/lib/data";
import type { Article } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
  variant?: "standard" | "compact" | "horizontal";
  priority?: boolean;
};

export function ArticleCard({ article, variant = "standard", priority = false }: ArticleCardProps) {
  const publication = getPublication(article.publicationSlug);
  const category = getCategory(article.categorySlug);
  if (!publication || !category) return null;

  const style = { "--article-accent": publication.color } as CSSProperties;

  return (
    <article className={`article-card article-card--${variant}`} style={style}>
      <Link className="article-card__image" href={`/icerik/${article.slug}`} tabIndex={-1} aria-hidden="true">
        <Image
          src={article.heroImage}
          alt=""
          fill
          sizes={variant === "horizontal" ? "(max-width: 760px) 100vw, 34vw" : "(max-width: 760px) 100vw, 33vw"}
          priority={priority}
        />
      </Link>
      <div className="article-card__body">
        <div className="article-card__meta">
          <Link href={`/yayinlar/${publication.slug}`}>{publication.name}</Link>
          <span>{category.shortName}</span>
          {article.premium && (
            <span className="premium-pill"><LockKeyhole size={10} /> Premium</span>
          )}
        </div>
        <h3>
          <Link href={`/icerik/${article.slug}`}>{article.title}</Link>
        </h3>
        {variant !== "compact" && <p>{article.dek}</p>}
        <div className="article-card__footer">
          <span>{article.displayDate} · {article.readTime}</span>
          <Link href={`/icerik/${article.slug}`} aria-label={`${article.title} içeriğini oku`}>
            Oku <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
