export type TrustSection = { id: string; title: string; kicker?: string; paragraphs: string[]; items?: string[] };
export type TrustPageDefinition = {
  eyebrow: string;
  title: string;
  lead: string;
  highlights?: { title: string; text: string }[];
  sections: TrustSection[];
  actions?: { label: string; href: string; external?: boolean }[];
  cta?: { eyebrow: string; title: string; text: string; label: string; href: string; external?: boolean };
};

export const trustPages: Record<string, TrustPageDefinition> = {
  about: {
    eyebrow: "Hip Medya yayın ekosistemi",
    title: "Yayınları tekleştirmeden, keşfi ve aboneliği tek yerde buluşturuyoruz.",
    lead: "Hiposta; farklı yayınların kimliğini koruyan, okurun seçimini merkeze alan ve içerik, bülten, üyelik ile premium deneyimi ortak bir ürün katmanında birleştiren yayın platformudur.",
    highlights: [
      { title: "Yayın bağımsızlığı", text: "Her yayın kendi editoryal sesi, görsel kimliği ve bültenleriyle yaşar." },
      { title: "Okur kontrolü", text: "Abonelik, tercih, kayıtlı içerik ve kişiselleştirme kullanıcı hesabında yönetilir." },
      { title: "Birinci taraf ilişki", text: "Keşif ve öneriler, platform içindeki açık tercihler ve etkileşim sinyalleriyle şekillenir." },
      { title: "Şeffaf dağıtım", text: "İçerik, bülten ve sponsorluk yüzeyleri kendi bağlamı ve etiketiyle sunulur." },
    ],
    sections: [
      { id: "neden-hiposta", title: "Neden Hiposta?", paragraphs: ["İçerik tüketimi birçok site, sosyal ağ ve gelen kutusu arasında parçalanıyor. Hiposta bu parçalanmayı yayınları tek bir markaya dönüştürerek değil, her yayının karakterini koruyarak çözer.", "Okur hangi yayını ve bülteni takip edeceğini seçer, içerikleri kaydeder, okuma geçmişini yönetir ve önerilerini zamanla kendi davranışlarıyla şekillendirir."] },
      { id: "urun-modeli", title: "Ürün modeli", paragraphs: ["Hiposta’nın merkezinde keşfedilebilir yayın ve içerik ağı, yönetilebilir e-posta bültenleri ve hesap tabanlı kişiselleştirme bulunur."], items: ["Yayın, kategori ve bülten bazlı keşif", "Tek hesapta abonelik ve içerik tercihleri", "Kayıtlı içerikler ve okuma geçmişi", "Davranışa dayalı deterministik öneriler", "Açıkça işaretlenmiş sponsorluk yüzeyleri"] },
      { id: "hip-medya", title: "Hip Medya ile ilişki", paragraphs: ["Hiposta, Hip Medya’nın yayınlarını ortak ürün altyapısında buluşturur. Yayınların editoryal kimliği korunurken teknoloji, üyelik, dağıtım ve ölçüm katmanları merkezileşir."] },
    ],
    cta: { eyebrow: "Okur olarak başla", title: "Kendi yayın akışını kur.", text: "İlgilendiğin yayınları ve bültenleri seç.", label: "Bültenleri keşfet", href: "/bultenler" },
  },
  advertise: {
    eyebrow: "Markalar ve iş ortakları için",
    title: "Doğru yayın bağlamında, ölçülebilir ve şeffaf sponsorluk.",
    lead: "Hiposta; markaları farklı yayınların konu, kitle ve içerik bağlamlarına yerleştiren sponsorluk ürünleri için merkezi dağıtım ve ölçüm katmanı sunar.",
    highlights: [
      { title: "İçerik içi", text: "Açık sponsor etiketiyle konumlandırılan native alanlar." },
      { title: "Bülten", text: "Bülten üstü, orta ve altı gibi tanımlı sponsorluk pozisyonları." },
      { title: "Yayın hedefleme", text: "Marka ve kampanya bağlamına göre yayın, bülten ve içerik seçimi." },
      { title: "Ölçüm", text: "Gösterim ve tıklama sinyallerini birinci taraf analytics altyapısıyla takip etme." },
    ],
    sections: [
      { id: "modeller", title: "Reklam ve sponsorluk modelleri", paragraphs: ["Hiposta’nın ticari modeli, kullanıcı deneyimini kaplayan standart display yoğunluğundan çok içerik ve bülten bağlamına uyumlu sponsorluk yüzeylerine odaklanır."], items: ["İçerik içi sponsor alanı", "İçerik sonu sponsor alanı", "Bülten üst / orta / alt sponsor alanları", "Yayın veya bülten bazlı dönemsel sponsorluk", "Özel proje ve editoryal iş birliği paketleri"] },
      { id: "hedefleme", title: "Bağlam ve hedefleme", paragraphs: ["Kampanyalar yayın, bülten ve içerik yüzeylerine göre planlanabilir. Kişisel veriye dayalı gizli profilleme yerine ürün içindeki yayın ve içerik bağlamı önceliklidir."] },
      { id: "olcum", title: "Raporlama yaklaşımı", paragraphs: ["Sponsorluk performansı için görünür gösterim ve tıklama eventleri Hiposta’nın kendi analytics katmanında tutulur. Editoryal içerik ile ticari yerleşim birbirinden ayrılır."] },
    ],
    actions: [{ label: "İletişime geç", href: "/iletisim" }],
    cta: { eyebrow: "İş birliği", title: "Hiposta ağı için bir çalışma planlayalım.", text: "Marka, hedef kitle, dönem ve içerik bağlamını paylaş.", label: "İletişim seçenekleri", href: "/iletisim" },
  },
  contact: {
    eyebrow: "İletişim",
    title: "Doğru konu için doğru kapıya gel.",
    lead: "Okur desteği, reklam ve sponsorluk, yayın iş birlikleri veya kurumsal konular için doğru yönlendirmeyi burada bulabilirsin.",
    highlights: [
      { title: "Okur desteği", text: "Hesap, abonelik ve doğrulama için Yardım Merkezi." },
      { title: "Reklam", text: "Sponsorluk ve marka iş birlikleri için Reklam Ver." },
      { title: "Yayın iş birlikleri", text: "Yayın veya içerik ortaklıkları için Hip Medya." },
      { title: "Kurumsal", text: "Şirket ve genel kurumsal iletişim için Hip Medya." },
    ],
    sections: [
      { id: "okur", title: "Okur ve hesap desteği", paragraphs: ["Hesabın, bülten tercihlerin, doğrulama, şifre, kayıtlı içerikler veya premium erişimle ilgili bir sorun yaşıyorsan önce Yardım Merkezi’ni kontrol et."] },
      { id: "ticari", title: "Reklam ve sponsorluk", paragraphs: ["Marka iş birliklerinde kampanyanın hedefini, dönemini, hedef kitle bağlamını ve tercih edilen yayınları belirlemek en hızlı başlangıç noktasıdır."] },
      { id: "kurumsal", title: "Hip Medya", paragraphs: ["Hiposta, Hip Medya yayın ekosisteminin ürün katmanıdır. Kurumsal ve yayın ortaklığı iletişimi için Hip Medya’nın resmi web sitesindeki güncel kanalları kullanabilirsin."] },
    ],
    actions: [{ label: "Yardım Merkezi", href: "/yardim" }, { label: "Hip Medya", href: "https://hipmedya.com", external: true }],
  },
  help: {
    eyebrow: "Yardım Merkezi",
    title: "Hesabını, aboneliklerini ve okuma deneyimini yönet.",
    lead: "Hiposta’daki temel işlemler için kısa ve doğrudan bir rehber.",
    sections: [
      { id: "hesap", title: "Hesap ve giriş", paragraphs: ["Giriş sorunu yaşıyorsan şifre sıfırlama akışını kullan. Profil ekranından hesap ve doğrulama durumunu kontrol edebilirsin."], items: ["/giris üzerinden giriş", "/sifremi-unuttum üzerinden şifre sıfırlama", "/hesabim/profil üzerinden doğrulama durumu", "/hesabim/guvenlik üzerinden şifre değişikliği"] },
      { id: "bultenler", title: "Bülten abonelikleri", paragraphs: ["Abone olduğun bültenleri hesabındaki Bültenler bölümünden yönetebilirsin. E-posta gönderim altyapısı tamamen etkinleşene kadar bazı seçimler kaydedilir fakat gerçek gönderim başlamayabilir."] },
      { id: "kisisellestirme", title: "Kayıtlı içerikler ve öneriler", paragraphs: ["Kaydetme ve okuma sinyalleri kişiselleştirme deneyimini geliştirmek için kullanılabilir. Tercihlerini hesap alanından yönetebilirsin."] },
      { id: "premium", title: "Premium", paragraphs: ["Premium içerik modeli ürün içinde hazırdır; ödeme ve ücretli üyelik akışı henüz aktif değildir."] },
    ],
    cta: { eyebrow: "Daha fazla destek", title: "Yanıtı bulamadın mı?", text: "Genel yönlendirme seçenekleri için iletişim sayfasını kullan.", label: "İletişim", href: "/iletisim" },
  },
  editorial: {
    eyebrow: "Editoryal güven",
    title: "Yayın kimliğini koruyan, okura karşı açık bir editoryal çerçeve.",
    lead: "Hiposta, editoryal içerik, ticari iş birliği ve teknoloji destekli üretim arasındaki sınırları görünür tutmayı hedefler.",
    sections: [
      { id: "bagimsizlik", title: "Editoryal bağımsızlık", paragraphs: ["Bir sponsorun yayın veya içerik çevresinde yer alması editoryal sonuca müdahale ettiği anlamına gelmez. Ticari iş birlikleri açıkça işaretlenir."] },
      { id: "kaynak", title: "Kaynak ve doğruluk", paragraphs: ["Haber, analiz ve rehber içeriklerinde mümkün olduğunca birincil veya güvenilir kaynaklara dayanılması; bilgi ile yorumun ayrılması esastır."], items: ["Doğrulanabilir kaynakları tercih etmek", "Yanıltıcı başlık kullanmamak", "Güncelleme ve düzeltmeleri görünür kılmak", "Sponsorlu alanları editoryal içerik gibi sunmamak"] },
      { id: "sorumluluk", title: "Yayın sonrası sorumluluk", paragraphs: ["Yeni bilgi ortaya çıktığında içerik güncellenebilir; maddi hata tespit edildiğinde düzeltme süreci işletilir."] },
    ],
    cta: { eyebrow: "Şeffaflık", title: "Bir hata mı gördün?", text: "Düzeltme yaklaşımımızı incele.", label: "Düzeltme politikası", href: "/duzeltme-politikasi" },
  },
  corrections: {
    eyebrow: "Editoryal güven",
    title: "Hataları sessizce silmek yerine, doğru bilgiyi görünür biçimde güncelleriz.",
    lead: "Maddi bir hata tespit edildiğinde amaç yalnız metni değiştirmek değil, okurun doğru bilgiye ulaşmasını sağlamaktır.",
    sections: [
      { id: "neler-duzeltilir", title: "Neler düzeltme kapsamındadır?", paragraphs: ["İsim, tarih, sayı, alıntı, bağlam, görsel açıklaması veya içeriğin sonucunu etkileyen diğer maddi hatalar düzeltme kapsamındadır."] },
      { id: "surec", title: "Düzeltme süreci", paragraphs: ["Bildirim mevcut kaynaklarla karşılaştırılır; hata doğrulanırsa içerik en kısa makul sürede güncellenir."], items: ["Hatanın niteliğini belirleme", "Kaynak ve bağlam kontrolü", "Gerekli düzeltmeyi yapma", "Önemli değişikliklerde güncelleme bilgisini görünür kılma"] },
      { id: "bildirim", title: "Düzeltme bildirimi", paragraphs: ["Bir içerikte maddi hata gördüğünde iletişim sayfası üzerinden ilgili içeriği ve hatalı olduğunu düşündüğün bölümü paylaşabilirsin."] },
    ],
    actions: [{ label: "İletişim", href: "/iletisim" }],
  },
  sponsorship: {
    eyebrow: "Ticari şeffaflık",
    title: "Sponsorluk görünür olmalı; editoryal karar ile ticari ilişki karışmamalı.",
    lead: "Hiposta’daki sponsorluk ve reklam yerleşimleri, kullanıcıya ticari niteliği anlaşılır biçimde gösterecek kurallarla yayınlanır.",
    sections: [
      { id: "etiketleme", title: "Açık etiketleme", paragraphs: ["Sponsorlu içerik, sponsor alanı veya marka iş birliği kullanıcı tarafından editoryal içerikle karıştırılmayacak biçimde etiketlenir."] },
      { id: "editoryal", title: "Editoryal sınır", paragraphs: ["Editoryal içerik ile ücretli yerleşim farklı ürün yüzeyleridir."], items: ["Sponsor ismi görünür olur", "CTA bağlantıları ticari bağlantı niteliğinde işaretlenir", "Gösterim ve tıklama ölçümü raporlamada kullanılabilir", "Sponsorluk editoryal görünümü taklit etmez"] },
      { id: "uygunluk", title: "Kampanya uygunluğu", paragraphs: ["Hiposta, kullanıcı güvenine veya yayın kimliğine açıkça aykırı kampanyaları kabul etmeme hakkını saklı tutar."] },
    ],
    cta: { eyebrow: "Markalar için", title: "Mevcut reklam ürünlerini incele.", text: "Yayın, bülten ve içerik bağlamındaki modelleri gör.", label: "Reklam Ver", href: "/reklam-ver" },
  },
  ai: {
    eyebrow: "Yapay zekâ ilkeleri",
    title: "Yapay zekâ editoryal sorumluluğun yerine değil, kontrollü üretim sürecinin içine konur.",
    lead: "Yapay zekâ araştırma, yapılandırma, özetleme, sınıflandırma veya üretim desteği sağlayabilir; nihai yayın sorumluluğu teknolojiye devredilmez.",
    sections: [
      { id: "kullanim", title: "Nerede kullanılabilir?", paragraphs: ["Yapay zekâ; metin taslağı, veri yapılandırma, konu sınıflandırma, başlık varyasyonu, özetleme veya operasyonel iş akışlarında yardımcı araç olabilir."] },
      { id: "kontrol", title: "İnsan kontrolü ve doğrulama", paragraphs: ["Özellikle kişi, kurum, sağlık, finans, hukuk ve güncel olaylar gibi hata maliyeti yüksek alanlarda AI çıktısı doğrulanmadan gerçek kabul edilmemelidir."] },
      { id: "sinirlar", title: "Sınırlar", paragraphs: ["Yapay zekâ kullanımı kaynak göstermeme, uydurma bilgiyi gerçek gibi sunma veya sponsorlu içeriği bağımsız editoryal görüş gibi gösterme gerekçesi olamaz."], items: ["Uydurma kaynak veya alıntı kullanılmaz", "Gerçek kişi beyanı AI tarafından icat edilmez", "Ticari içerik editoryal içerik gibi gizlenmez", "Maddi hata tespitinde düzeltme politikası uygulanır"] },
    ],
    cta: { eyebrow: "Editoryal çerçeve", title: "Teknoloji kadar yayın sorumluluğu da önemli.", text: "Genel editoryal yaklaşımı incele.", label: "Yayın ilkeleri", href: "/yayin-ilkeleri" },
  },
};
