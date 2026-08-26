# Hiposta

Hip Medya ekosistemindeki yayınları, içerikleri ve e-posta bültenlerini tek bir deneyimde birleştiren çok sayfalı Next.js ürün prototipi.

## Neler var?

- Next.js 16 App Router ve TypeScript
- Yayın, kategori, içerik ve bültenler için gerçek slug rotaları
- Premium içeriklerde giriş paragrafından sonra paywall
- Kaynağı, segmenti ve gönderim sıklığını taşıyan merkezi mock veri katmanı
- Bülten paketleri ve tarayıcıda çalışan demo abonelik akışı
- Arama, giriş, kayıt ve premium tanıtım sayfaları
- Dinamik metadata, sitemap, robots.txt ve 404 deneyimi
- Responsive, erişilebilir ve editoryal tasarım sistemi

## Rotalar

| Rota | Amaç |
| --- | --- |
| `/` | Editoryal ana sayfa |
| `/icerik/[slug]` | Ücretsiz veya premium içerik detayı |
| `/yayinlar` | Yayın dizini |
| `/yayinlar/[slug]` | Yayın profili ve içerikleri |
| `/bultenler` | Bülten ve paket keşfi |
| `/bultenler/[slug]` | Bülten detay ve abonelik sayfası |
| `/kategori/[slug]` | Kategori akışı |
| `/arama?q=` | İçerik, yayın ve bülten araması |
| `/premium` | Premium üyelik tanıtımı |
| `/giris`, `/kayit-ol` | Demo hesap akışları |

## Yerel geliştirme

```bash
npm install
npm run dev
```

Kalite kontrolleri:

```bash
npm run lint
npm run typecheck
npm run build
```

## Veri ve entegrasyon notu

`lib/mock-data.ts` dosyası yalnızca ürün demosu içindir. Veri erişimi `lib/data.ts` arayüzünde toplandığı için gerçek CMS/API entegrasyonunda sayfa bileşenlerini değiştirmeden veri kaynağı değiştirilebilir. Abonelik formları da aynı nedenle demo durum yönetimi kullanır; üretimde consent kaydı, double opt-in, kimlik doğrulama ve ESP çağrıları sunucu tarafı action/API rotalarına bağlanmalıdır.
