import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Hiposta", short_name: "Hiposta", description: "İlgi alanın kadar posta.", start_url: "/", display: "standalone", background_color: "#f2f1ed", theme_color: "#2444e8", icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }] };
}
