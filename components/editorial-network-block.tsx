import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { NewsletterCard } from "@/components/newsletter-card";
import { PublicationMark } from "@/components/publication-mark";
import type { EditorialNetwork } from "@/lib/editorial-network";
import type { Publication } from "@/lib/types";

type Props = {
  network: EditorialNetwork;
  publications: Publication[];
};

export function EditorialNetworkBlock({ network, publications }: Props) {
  const hasAnything = network.sameTopic.length || network.samePublication.length || network.relatedPublications.length || network.relatedNewsletters.length;
  if (!hasAnything) return null;

  return (
    <section className="editorial-network page-shell" aria-labelledby="editorial-network-heading">
      <div className="section-heading section-heading--rule">
        <div><p className="eyebrow">Hiposta editoryal ağı</p><h2 id="editorial-network-heading">Okumayı burada bırakma.</h2></div>
        <Link href="/yayinlar">Tüm yayınları keşfet <ArrowUpRight size={15} /></Link>
      </div>

      {network.sameTopic.length > 0 && <div className="editorial-network__group"><div className="editorial-network__intro"><p className="eyebrow">Aynı konu, başka sesler</p><h3>Bu başlığı farklı yayınlardan sürdür</h3></div><div className="article-grid article-grid--three">{network.sameTopic.map((item) => <ArticleCard key={item.slug} article={item} />)}</div></div>}

      {network.relatedPublications.length > 0 && <div className="editorial-network__publications"><div><p className="eyebrow">İlgili yayınlar</p><h3>Editoryal çevreni genişlet</h3></div><div>{network.relatedPublications.map((publication) => <Link key={publication.slug} href={`/yayinlar/${publication.slug}`}><PublicationMark publication={publication} linked={false} /><span>{publication.description}</span><ArrowRight size={15} /></Link>)}</div></div>}

      {network.relatedNewsletters.length > 0 && <div className="editorial-network__group"><div className="editorial-network__intro"><p className="eyebrow">Gelen kutuna taşı</p><h3>Bu konuyu bültenlerle takip et</h3></div><div className="newsletter-grid">{network.relatedNewsletters.map((newsletter) => <NewsletterCard key={newsletter.slug} newsletter={newsletter} publication={publications.find((item) => item.slug === newsletter.publicationSlug)} showSubscriptionAction source="editorial_network" />)}</div></div>}
    </section>
  );
}
