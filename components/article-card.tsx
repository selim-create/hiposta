import { ArrowUpRight, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
  variant?: "standard" | "compact" | "horizontal";
  priority?: boolean;
};

export function ArticleCard({ article, variant = "standard", priority = false }: ArticleCardProps) {
  const publicationName = article.publicationName || article.publicationSlug;
  const categoryName = article.categoryShortName || article.categoryName || article.categorySlug;

  return (
    <article className={`article-card article-card--${variant}`}>
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
          <Link href={`/yayinlar/${article.publicationSlug}`}>{publicationName}</Link>
          <span>{categoryName}</span>
          {article.premium && (
            <span className="premium-pill"><LockKeyhole size={10} /> Premium</span>
          )}
        </div>
        <h3><Link href={`/icerik/${article.slug}`}>{article.title}</Link></h3>
        {variant !== "compact" && <p>{article.dek}</p>}
        <div className="article-card__footer">
          <span>{article.displayDate}{article.readTime ? ` · ${article.readTime}` : ""}</span>
          <Link href={`/icerik/${article.slug}`} aria-label={`${article.title} içeriğini oku`}>
            Oku <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
