import { Bookmark, Clock3 } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import type { PersonalisedContentItem } from "@/lib/personalisation";

type Props = {
  title: string;
  eyebrow: string;
  description: string;
  items: PersonalisedContentItem[];
  mode: "saved" | "history";
};

function formatStateDate(value: string | null) {
  if (!value) return "";
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }).format(date);
}

export function AccountContentCollection({ title, eyebrow, description, items, mode }: Props) {
  const Icon = mode === "saved" ? Bookmark : Clock3;
  return (
    <section className="account-section account-section--personalisation">
      <div className="section-heading section-heading--rule">
        <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
        <p>{description}</p>
      </div>
      {items.length ? (
        <div className="account-content-grid">
          {items.map(({ article, state }) => (
            <div className="account-content-item" key={`${mode}-${article.slug}`}>
              <div className="account-content-item__state">
                <Icon size={13} />
                <span>{mode === "saved" ? "Kaydedildi" : "Son okuma"}</span>
                <strong>{formatStateDate(mode === "saved" ? state.saved_at : state.last_viewed_at)}</strong>
                {mode === "history" && state.view_count > 1 ? <small>{state.view_count} kez açıldı</small> : null}
              </div>
              <ArticleCard article={article} variant="compact" />
            </div>
          ))}
        </div>
      ) : (
        <div className="account-empty">
          <h3>{mode === "saved" ? "Henüz kaydettiğin içerik yok." : "Okuma geçmişin henüz oluşmadı."}</h3>
          <p>{mode === "saved" ? "İçerik sayfalarındaki Kaydet butonunu kullanarak daha sonra dönmek istediğin yazıları burada toplayabilirsin." : "Giriş yapmışken okuduğun Hiposta içerikleri burada, en son okuduğundan başlayarak görünecek."}</p>
        </div>
      )}
    </section>
  );
}
