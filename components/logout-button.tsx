"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  return (
    <button
      className="button button--ghost"
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
        window.location.assign("/");
      }}
    >
      <LogOut size={15} /> {loading ? "Çıkılıyor" : "Çıkış yap"}
    </button>
  );
}
