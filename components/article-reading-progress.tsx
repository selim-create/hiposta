"use client";

import { useEffect, useState } from "react";

export function ArticleReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const article = document.querySelector<HTMLElement>(".article-body");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = window.scrollY + rect.top;
      const articleHeight = article.offsetHeight;
      const viewport = window.innerHeight;
      const start = articleTop - Math.min(120, viewport * 0.15);
      const end = articleTop + articleHeight - viewport * 0.7;
      const distance = Math.max(1, end - start);
      const value = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
      setProgress(value * 100);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="article-reading-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}
