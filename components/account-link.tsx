"use client";

import { Bookmark, ChevronDown, Clock3, Compass, LayoutDashboard, Mail, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const accountItems = [
  { href: "/hesabim", label: "Hesap özeti", icon: LayoutDashboard },
  { href: "/hesabim/senin-icin", label: "Senin İçin", icon: Compass },
  { href: "/hesabim/kaydettiklerim", label: "Kaydettiklerim", icon: Bookmark },
  { href: "/hesabim/okuma-gecmisi", label: "Okuma Geçmişi", icon: Clock3 },
  { href: "/hesabim/bultenler", label: "Bültenler", icon: Mail },
  { href: "/hesabim/profil", label: "Profil", icon: UserRound },
  { href: "/hesabim/guvenlik", label: "Güvenlik", icon: ShieldCheck },
];

export function AccountLink() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => { if (active) setAuthenticated(response.ok); })
      .catch(() => { if (active) setAuthenticated(false); });
    return () => { active = false; };
  }, []);

  if (!authenticated) return <Link className="text-link" href="/giris"><UserRound size={15} /> Giriş</Link>;

  return (
    <details className="account-menu">
      <summary className="text-link"><UserRound size={15} /> Hesabım <ChevronDown size={12} /></summary>
      <div className="account-menu__panel">
        <div className="account-menu__head"><span>Hiposta hesabı</span><strong>Kişisel alanın</strong></div>
        <nav aria-label="Profil menüsü">
          {accountItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href}><Icon size={14} /><span>{label}</span></Link>)}
        </nav>
      </div>
    </details>
  );
}
