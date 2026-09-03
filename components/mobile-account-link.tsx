"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getClientAuthSession } from "@/lib/client-session";

export function MobileAccountLink() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void getClientAuthSession().then((session) => {
      if (active) setAuthenticated(Boolean(session));
    });
    return () => { active = false; };
  }, []);

  if (authenticated === null) return null;
  return <Link href={authenticated ? "/hesabim" : "/giris"}>{authenticated ? "Hesabım" : "Giriş yap"}</Link>;
}
