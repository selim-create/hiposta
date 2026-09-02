"use client";

import { Bookmark, Clock3, Compass, Mail, ShieldCheck, UserRound, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/hesabim", label: "Özet", icon: LayoutDashboard },
  { href: "/hesabim/senin-icin", label: "Senin İçin", icon: Compass },
  { href: "/hesabim/kaydettiklerim", label: "Kaydettiklerim", icon: Bookmark },
  { href: "/hesabim/okuma-gecmisi", label: "Okuma Geçmişi", icon: Clock3 },
  { href: "/hesabim/bultenler", label: "Bültenler", icon: Mail },
  { href: "/hesabim/profil", label: "Profil", icon: UserRound },
  { href: "/hesabim/guvenlik", label: "Güvenlik", icon: ShieldCheck },
];

export function AccountNavigation() {
  const pathname = usePathname();

  return (
    <nav className="account-nav" aria-label="Hesap bölümleri">
      <div className="account-nav__track">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/hesabim" ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
              <Icon size={14} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
