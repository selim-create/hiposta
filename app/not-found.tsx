import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return <section className="not-found page-shell"><span>404</span><p className="eyebrow">Posta bu adrese ulaşamadı</p><h1>Aradığın sayfa<br />burada değil.</h1><p>Bağlantı değişmiş olabilir. Gündeme dönüp yeni bir okuma seçebilirsin.</p><Link className="button button--primary" href="/"><ArrowLeft size={16} /> Ana sayfaya dön</Link></section>;
}
