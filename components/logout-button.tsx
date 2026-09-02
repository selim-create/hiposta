"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      className="button button--ghost"
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
        router.push("/");
        router.refresh();
      }}
    >
      <LogOut size={15} /> {loading ? "Çıkılıyor" : "Çıkış yap"}
    </button>
  );
}
