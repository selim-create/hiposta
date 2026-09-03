"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function MobileAccountLink() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => {
        if (active) setAuthenticated(response.ok);
      })
      .catch(() => {
        if (active) setAuthenticated(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (authenticated === null) return null;

  return <Link href={authenticated ? "/hesabim" : "/giris"}>{authenticated ? "Hesabım" : "Giriş yap"}</Link>;
}
