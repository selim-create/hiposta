# Hiposta

Hiposta, Hip Medya ekosistemindeki yayınları, içerikleri ve e-posta bültenlerini tek bir hesap ve discovery deneyiminde birleştiren production Next.js uygulamasıdır.

- Production: `https://hiposta.com`
- Core API: `https://api.hiposta.com/wp-json/hiposta/v1`
- Frontend: Next.js 16 App Router, React 19, TypeScript
- Runtime: Node.js 22.x

## Ürün durumu

Temel launch tamamlanmıştır. Production bugün gerçek Core verisini kullanır; Core erişilemezse production ortamında mock veri gösterilmez. Premium ödeme/tahsilat ve gerçek e-posta delivery sistemi henüz aktif değildir ve ürün içinde bu durum açıkça belirtilir.

Aktif temel yüzeyler:

- yayın, kategori, içerik, bülten ve sayı slug rotaları
- hesap oluşturma, doğrulama, giriş ve session yönetimi
- bülten keşfi, Guest Wizard V4 ve hesap içi bülten tercihleri
- kişiselleştirme, kaydetme ve okuma geçmişi altyapısı
- consent-aware birinci taraf ürün analitiği
- sponsorluk placement gösterimi ve ölçüm altyapısı
- metadata, canonical, Open Graph, robots.txt ve sitemap
- responsive ve erişilebilir editoryal tasarım sistemi

## Temel rotalar

| Rota | Amaç |
| --- | --- |
| `/` | Editoryal ana sayfa |
| `/icerik/[slug]` | İçerik detayı ve erişim kontrolü |
| `/yayinlar` | Yayın dizini |
| `/yayinlar/[slug]` | Yayın profili ve içerikleri |
| `/bultenler` | Bülten keşfi ve seçim deneyimi |
| `/bultenler/[slug]` | Bülten detay ve abonelik yüzeyi |
| `/sayi/[slug]` | Bülten web arşivi |
| `/kategori/[slug]` | Kategori akışı |
| `/arama?q=` | İçerik, yayın ve bülten araması |
| `/premium` | Premium tanıtımı; ödeme henüz aktif değil |
| `/giris`, `/kayit-ol`, `/dogrula` | Hesap akışları |
| `/hesabim/*` | Private hesap alanı |

## Environment

Yerelde `.env.local` kullan:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
HIPOSTA_CORE_URL=https://api.hiposta.com/wp-json/hiposta/v1
```

Production Vercel ortamı:

```bash
NEXT_PUBLIC_SITE_URL=https://hiposta.com
HIPOSTA_CORE_URL=https://api.hiposta.com/wp-json/hiposta/v1
```

`HIPOSTA_ENABLE_MOCK_FALLBACK` production ortamında tanımlanmamalıdır. Mock fallback yalnız development sırasında ve açıkça etkinleştirilirse kullanılabilir.

## Yerel geliştirme

Node 22 kullan:

```bash
nvm use
npm ci
npm run dev
```

Kalite kontrolleri:

```bash
npm run lint
npm run typecheck
npm run build
```

## Production smoke testi

Canlı deploy sonrası kritik public yüzeyleri, content-type, canonical ve `www` yönlendirmesini tek komutla doğrula:

```bash
npm run smoke:production
```

Başka bir hedefi test etmek için:

```bash
HIPOSTA_SMOKE_BASE_URL=https://example.com npm run smoke:production
```

Smoke testi şu yüzeyleri kontrol eder: `/`, `/yayinlar`, `/bultenler`, `/premium`, `/hakkimizda`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image` ve `www.hiposta.com → hiposta.com` yönlendirmesi.

## Veri ve güvenlik ilkeleri

- Core API production verisinin source of truth katmanıdır.
- Ulaşılamayan veri `0` veya mock kayıt olarak gösterilmez.
- Coming-soon yayınlar aktif publishing/newsletter akışına dahil edilmez.
- Session cookie HttpOnly olarak tutulur; private hesap rotaları server-side korunur.
- Public discovery rotalarında kullanıcı state'i client-side hydrate edilerek CDN/prerender cache korunur.
- Premium erişim kararı frontend tarafından uydurulmaz; gerçek entitlement Core tarafından belirlenir.
- Analitik eventleri yalnız kullanıcının analitik izni varsa gönderilir.

## Henüz aktif olmayan gelir/delivery katmanları

Launch sonrası roadmap kapsamında ayrı fazlarda etkinleştirilecektir:

1. gerçek Premium plan, payment, subscription ve entitlement sistemi
2. transactional ve newsletter delivery için SES/queue altyapısı
3. gelişmiş sponsorluk campaign/inventory/reporting sistemi

Bu katmanlar aktif edilene kadar sahte fiyat, ödeme başarılı durumu veya e-posta gönderimi üretilmez.
