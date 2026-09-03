const baseUrl = (process.env.HIPOSTA_SMOKE_BASE_URL || "https://hiposta.com").replace(/\/$/, "");

const checks = [
  { path: "/", type: "text/html", canonical: `${baseUrl}/` },
  { path: "/yayinlar", type: "text/html", canonical: `${baseUrl}/yayinlar` },
  { path: "/bultenler", type: "text/html", canonical: `${baseUrl}/bultenler` },
  { path: "/premium", type: "text/html", canonical: `${baseUrl}/premium` },
  { path: "/hakkimizda", type: "text/html", canonical: `${baseUrl}/hakkimizda` },
  { path: "/robots.txt", type: "text/plain" },
  { path: "/sitemap.xml", type: "application/xml" },
  { path: "/opengraph-image", type: "image/" },
];

let failed = false;

function fail(message) {
  failed = true;
  console.error(`✗ ${message}`);
}

function pass(message) {
  console.log(`✓ ${message}`);
}

function normalizeUrl(value) {
  try {
    const url = new URL(value, `${baseUrl}/`);
    url.hash = "";
    return url.toString();
  } catch {
    return value;
  }
}

function extractCanonical(html) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const relMatch = tag.match(/\brel\s*=\s*["']([^"']+)["']/i);
    if (!relMatch || !relMatch[1].split(/\s+/).some((value) => value.toLowerCase() === "canonical")) continue;
    const hrefMatch = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    if (hrefMatch) return hrefMatch[1];
  }
  return null;
}

for (const check of checks) {
  const url = `${baseUrl}${check.path}`;
  try {
    const response = await fetch(url, { redirect: "manual", headers: { "user-agent": "hiposta-production-smoke/1.0" } });
    const contentType = response.headers.get("content-type") || "";

    if (response.status !== 200) {
      fail(`${check.path} HTTP ${response.status}`);
      continue;
    }
    pass(`${check.path} HTTP 200`);

    if (!contentType.toLowerCase().includes(check.type.toLowerCase())) {
      fail(`${check.path} content-type beklenenden farklı: ${contentType}`);
    } else {
      pass(`${check.path} content-type ${contentType.split(";")[0]}`);
    }

    if (check.canonical) {
      const html = await response.text();
      const foundCanonical = extractCanonical(html);
      const expectedCanonical = normalizeUrl(check.canonical);
      const normalizedFound = foundCanonical ? normalizeUrl(foundCanonical) : null;
      if (!normalizedFound || normalizedFound !== expectedCanonical) {
        fail(`${check.path} canonical eksik veya yanlış (beklenen: ${expectedCanonical}, bulunan: ${normalizedFound || "yok"})`);
      } else {
        pass(`${check.path} canonical doğru (${normalizedFound})`);
      }
    }
  } catch (error) {
    fail(`${check.path} istek hatası: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  const response = await fetch(`https://www.hiposta.com/`, { redirect: "manual" });
  const location = response.headers.get("location");
  if (![301, 308].includes(response.status) || normalizeUrl(location || "") !== normalizeUrl(`${baseUrl}/`)) {
    fail(`www yönlendirmesi beklenenden farklı: HTTP ${response.status} → ${location || "(location yok)"}`);
  } else {
    pass(`www → ${baseUrl}/ (${response.status})`);
  }
} catch (error) {
  fail(`www yönlendirme testi başarısız: ${error instanceof Error ? error.message : String(error)}`);
}

if (failed) process.exit(1);
console.log("\nHiposta production smoke testi başarılı.");
