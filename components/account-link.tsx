"use client";

import { UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AccountLink() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => { if (active) setAuthenticated(response.ok); })
      .catch(() => { if (active) setAuthenticated(false); });
    return () => { active = false; };
  }, []);

  return <Link className="text-link" href={authenticated ? "/hesabim" : "/giris"}><UserRound size={15} /> {authenticated ? "Hesabım" : "Giriş"}</Link>;
}
