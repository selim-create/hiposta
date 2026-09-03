export const LEGAL_LAST_UPDATED = "3 Eylül 2026";
export const LEGAL_VERSION = "1.2";

export const companyLegal = {
  legalName: "Hip Medya Limited Şirketi",
  address: "Caferağa Mah. Şifa Sok. No:19 Kadıköy-İstanbul",
  taxOffice: "Kadıköy",
  taxNumber: "4631563968",
  registryNumber: "1146224",
  mersisNumber: "0463156396800001",
  startDate: "22.06.2026",
  contactEmail: "iletisim@hipmedya.com",
  privacyEmail: "kvkk@hipmedya.com",
  phone: "0850 450 1105",
} as const;

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
};

export type LegalPageDefinition = {
  eyebrow: string;
  title: string;
  lead: string;
  scope: string;
  showCompany?: boolean;
  sections: LegalSection[];
};

export const legalPages: Record<string, LegalPageDefinition> = {
  privacy: {
    eyebrow: "Gizlilik",
    title: "Verini neden kullandığımızı, ne kadar tuttuğumuzu ve kontrolün sende nasıl kaldığını açıkça anlatıyoruz.",
    lead: "Bu politika Hiposta’daki genel gizlilik yaklaşımını açıklar. Belirli veri toplama faaliyetlerinde KVKK Aydınlatma Metni ayrıca sunulur; bu politika onun yerine geçmez.",
    scope: "Hiposta web sitesi, hesap, bülten aboneliği, bekleme listesi, kişiselleştirme ve izin verilmiş analitik kullanımı.",
    showCompany: true,
    sections: [
      { id: "veriler", title: "İşlediğimiz veri kategorileri", paragraphs: ["Kullandığın özelliğe göre yalnızca gerekli veri kategorileri işlenir. Hiposta, hizmetle ilgisi olmayan hassas profil oluşturmayı amaçlamaz."], items: ["Hesap bilgileri: ad/soyad veya görünen ad, e-posta adresi ve doğrulama durumu", "Kimlik doğrulama ve güvenlik bilgileri: oturum kayıtları, güvenlik ve kötüye kullanım önleme sinyalleri", "Abonelik ve tercih bilgileri: seçilen yayın/bültenler, abonelik durumu ve onay/ret kayıtları", "Ürün kullanım bilgileri: kaydedilen içerikler, okuma geçmişi ve açıkça verilen kişiselleştirme tercihleri", "Analitik bilgileri: yalnızca analitik izni verilmişse anonim tarayıcı kimliği, ziyaret edilen Hiposta yolu ve ürün etkileşim eventleri", "Teknik kayıtlar: hizmet güvenliği ve hata ayıklama için gerekli sunucu/API kayıtları"] },
      { id: "amaclar", title: "Verileri hangi amaçlarla kullanıyoruz?", paragraphs: ["Veriler; talep ettiğin Hiposta işlevlerini sunmak, hesabı ve abonelikleri yönetmek, güvenliği sağlamak, tercih ettiğin kişiselleştirmeyi üretmek ve izin verdiğinde ürün performansını ölçmek için kullanılır."], items: ["Hesap oluşturma, giriş, doğrulama ve güvenlik", "Bülten seçimlerini, abonelik ve ayrılma taleplerini yönetme", "Kayıtlı içerik, okuma geçmişi ve öneri deneyimini çalıştırma", "Dolandırıcılık, kötüye kullanım ve teknik hataları önleme", "Analitik izni varsa içerik ve ürün etkileşimini toplu düzeyde ölçme", "Mevzuattan doğan talepleri ve veri sahibi başvurularını yerine getirme"] },
      { id: "hukuki", title: "İşleme şartları", paragraphs: ["Her veri işleme faaliyeti aynı hukuki sebebe dayanmaz. Hesap ve talep edilen ürün işlevleri sözleşmenin kurulması veya ifasıyla bağlantılı olarak; güvenlik gibi bazı faaliyetler temel haklara zarar vermemek kaydıyla meşru menfaat kapsamında; kanuni yükümlülükler ilgili hukuki yükümlülük kapsamında; isteğe bağlı analitik ise açık rıza ile yürütülür."], items: ["KVKK m.5/2(c): sözleşmenin kurulması veya ifasıyla doğrudan ilgili işlemler", "KVKK m.5/2(ç): veri sorumlusunun hukuki yükümlülüklerini yerine getirmesi gereken işlemler", "KVKK m.5/2(f): temel hak ve özgürlüklere zarar vermemek kaydıyla meşru menfaat için zorunlu güvenlik/işletim işlemleri", "KVKK m.5/1: zorunlu olmayan analitik gibi açık rızaya dayalı işlemler"] },
      { id: "paylasim", title: "Kimlerle paylaşılabilir?", paragraphs: ["Kişisel veriler satılmaz. Hizmetin çalışması için gerekli olduğu ölçüde barındırma ve teknik altyapı sağlayıcıları gibi veri işleyenlerden yararlanılabilir; ayrıca kanunen yetkili kamu kurumlarına hukuki yükümlülük halinde aktarım yapılabilir.", "Yurt dışına veri aktarımı doğuran bir altyapı veya hizmet kullanıldığında, KVKK’nın yurt dışı aktarım hükümleri kapsamında gerekli hukuki güvence ve bilgilendirme ayrıca uygulanır. Sağlayıcı yapısı değişirse bu metin üretim kullanımı öncesinde güncellenir."] },
      { id: "saklama", title: "Saklama ve silme yaklaşımı", paragraphs: ["Veriler amaç için gerekli olduğu süre boyunca ve uygulanabilir hukuki saklama yükümlülükleri ölçüsünde tutulur. Hesap kapatma, abonelikten ayrılma veya veri sahibi talebi sonrasında silme, yok etme ya da anonimleştirme yükümlülükleri değerlendirilir.", "Analitik tercih kaydı en fazla 12 ay için cihazda saklanır; süre dolduğunda yeniden tercih istenir. Analitik reddedildiğinde Hiposta’nın analitik amaçlı yerel kayıtları temizlenir."] },
      { id: "kontrol", title: "Kontrol ve başvuru", paragraphs: ["Çerez ve analitik tercihini footer’daki “Çerez tercihlerim” bağlantısından istediğin zaman değiştirebilirsin. KVKK kapsamındaki veri sahibi talepleri için kvkk@hipmedya.com adresini kullanabilirsin."], items: ["Aboneliklerini hesap alanından yönetme", "Bülten iletilerinden ayrılma", "Analitik iznini verme veya geri çekme", "Kişisel veriler hakkında bilgi, düzeltme, silme ve diğer KVKK m.11 hakları için başvurma"] },
    ],
  },
  kvkk: {
    eyebrow: "KVKK aydınlatma",
    title: "Hiposta internet sitesi, hesap ve abonelik süreçleri kişisel veri aydınlatma metni.",
    lead: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, Hiposta üzerinden kişisel veri elde edildiği anda uygulanacak temel bilgilendirmeyi bu metin açıklar.",
    scope: "Hesap/kayıt, bülten ve bekleme listesi seçimleri, hesap içi kişiselleştirme, güvenlik ve isteğe bağlı analitik.",
    showCompany: true,
    sections: [
      { id: "sorumlu", title: "Veri sorumlusu", paragraphs: ["Bu kapsamdaki kişisel veriler bakımından veri sorumlusu Hip Medya Limited Şirketi’dir. Veri sahibi başvuruları kvkk@hipmedya.com adresinden veya şirket adresine yazılı olarak iletilebilir."] },
      { id: "toplama", title: "Toplama yöntemleri", paragraphs: ["Kişisel veriler; Hiposta’daki hesap ve abonelik formları, hesabında yaptığın seçimler, kaydetme/okuma gibi ürün etkileşimleri, güvenlik amaçlı sunucu/API kayıtları ve yalnız izin verilmişse tarayıcıdaki analitik teknolojileri aracılığıyla elektronik ortamda elde edilir."] },
      { id: "amac-hukuk", title: "Amaçlar ve hukuki sebepler", paragraphs: ["Hesap oluşturma ve oturum yönetimi; hesap hizmetini sunmak amacıyla sözleşmenin kurulması/ifası için gerekli olma şartına dayanır. Seçtiğin bültenleri kaydetme ve abonelik talebini yönetme, talep ettiğin hizmeti yerine getirmek ve ilgili ileti onayını kaydetmek amacıyla yürütülür. Güvenlik kayıtları, temel haklarına zarar vermemek kaydıyla hizmet güvenliği için meşru menfaat kapsamında işlenebilir. Zorunlu olmayan Hiposta analitiği yalnız açık rıza verdiğinde etkinleşir."], items: ["Hesap: e-posta, görünen ad, doğrulama ve oturum bilgileri", "Bülten/duyuru: e-posta, seçilen yayın/bülten, onay/ret ve abonelik durumu", "Kişiselleştirme: hesabındaki açık tercihler, kaydetme ve okuma sinyalleri", "Güvenlik: sınırlı teknik istek ve kötüye kullanım önleme kayıtları", "Analitik: yalnız rıza sonrası anonim tarayıcı kimliği, Hiposta yolu ve event türü"] },
      { id: "aktarim", title: "Aktarım", paragraphs: ["Veriler, hizmetin sunulması için gerekli teknik barındırma/altyapı hizmetlerini sağlayan veri işleyenlere ve hukuki zorunluluk halinde yetkili kurumlara amaçla sınırlı olarak aktarılabilir. Üçüncü taraf reklam ağına kullanıcı e-posta listesi satışı veya paylaşımı Hiposta’nın veri modeli değildir.", "Yurt dışı teknik altyapı kullanılması halinde aktarım, KVKK m.9 kapsamındaki yürürlükteki şartlar ve uygun güvenceler değerlendirilerek gerçekleştirilmelidir; üretimde kullanılan sağlayıcılar değiştiğinde aydınlatma içeriği de güncellenir."] },
      { id: "haklar", title: "KVKK m.11 kapsamındaki hakların", paragraphs: ["Kanundaki şartlar çerçevesinde kişisel verinin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme, aktarılan üçüncü kişileri bilme, eksik/yanlış verinin düzeltilmesini isteme, şartları varsa silme veya yok etme talep etme, bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemler yoluyla aleyhine bir sonuca itiraz etme ve kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme haklarına sahipsin."] },
      { id: "basvuru", title: "Başvuru kanalı", paragraphs: ["Başvurunda talebini yeterince açık şekilde belirtmen ve başvurunun sana ait olduğunu doğrulamaya yarayan bilgileri sunman gerekebilir. Başvurular kvkk@hipmedya.com adresine veya Caferağa Mah. Şifa Sok. No:19 Kadıköy-İstanbul adresine iletilebilir."] },
    ],
  },
  cookies: {
    eyebrow: "Çerez ve benzer teknolojiler",
    title: "Gerekli depolama ile isteğe bağlı analitiği birbirinden ayırıyoruz.",
    lead: "Hiposta; oturum, gizlilik tercihi ve kullanıcı tarafından başlatılan ürün akışları için gerekli teknolojileri kullanır. Analitik depolama varsayılan olarak kapalıdır ve yalnız aktif tercihinle açılır.",
    scope: "Çerezler, localStorage ve sessionStorage gibi tarayıcı depolama teknolojileri.",
    showCompany: true,
    sections: [
      { id: "gerekli", title: "Gerekli teknolojiler", paragraphs: ["Bu kayıtlar talep ettiğin işlevin çalışması, güvenli oturum veya gizlilik tercihinin hatırlanması için kullanılır; pazarlama amacıyla kullanılmaz."], items: ["hiposta_session — HttpOnly oturum çerezi; giriş yapan kullanıcıda oturum güvenliği için; en fazla 30 gün", "hiposta.privacy.consent — localStorage; gizlilik/analitik tercihini ve politika sürümünü hatırlamak için; en fazla 12 ay", "hiposta-newsletter-wizard-v5 — localStorage; başlattığın bülten seçim sihirbazındaki ilerlemeyi ve seçtiğin öneri temposunu hatırlamak için; seçim tamamlandığında veya saklama süresi dolduğunda temizlenir"] },
      { id: "analytics", title: "Analitik teknolojileri", paragraphs: ["Analitik varsayılan olarak kapalıdır. “Tümünü kabul et” veya tercihler ekranında Analitik seçeneğini açman halinde Hiposta’nın birinci taraf analitik eventleri çalışır. İzni geri çektiğinde ilgili yerel analytics kayıtları temizlenir ve yeni analytics eventi gönderilmez."], items: ["hiposta.analytics.anonymous_id — localStorage; rastgele tarayıcı kimliği; e-posta içermez; analitik izni süresince ve en fazla 12 ay", "hiposta.analytics.view.* — sessionStorage; aynı içerik görünümünü kısa süre içinde tekrar saymamak için; 30 dakikalık ölçüm penceresi ve tarayıcı oturumu ile sınırlı", "Gönderilen eventler: içerik görüntüleme/kaydetme/paylaşma, bülten kayıt akışı, öneri etkileşimi, sponsor gösterim/tıklama ve premium CTA gibi ürün olayları"] },
      { id: "ucuncu", title: "Reklam ve üçüncü taraf takip", paragraphs: ["Bu sürümde üçüncü taraf reklam/pazarlama takip çerezleri kullanılmaz. Sponsor ölçümü, analitik izni varsa Hiposta’nın kendi event altyapısı üzerinden yapılır. Gelecekte üçüncü taraf bir takip teknolojisi eklenirse bu politika ve tercih paneli kullanım öncesinde güncellenir."] },
      { id: "tercih", title: "Tercihini nasıl değiştirirsin?", paragraphs: ["İlk ziyarette gerekli depolama, analitik ve tercih seçenekleri gösterilir. Analitik için önceden işaretli seçim kullanılmaz. Footer’daki “Çerez tercihlerim” bağlantısıyla paneli istediğin zaman yeniden açabilir, yalnız gerekli seçeneğine dönebilirsin."] },
    ],
  },
  terms: {
    eyebrow: "Kullanım koşulları",
    title: "Hiposta’yı kullanırken geçerli temel ürün ve içerik kuralları.",
    lead: "Bu koşullar Hiposta web sitesi, içerik, hesap ve ücretsiz ürün özelliklerinin kullanımını düzenler. Zorunlu tüketici hakları ve yürürlükteki mevzuat saklıdır.",
    scope: "Hiposta web sitesi ve mevcut ücretsiz ürün işlevleri.",
    showCompany: true,
    sections: [
      { id: "hizmet", title: "Hizmetin kapsamı", paragraphs: ["Hiposta; Hip Medya yayınlarını, içerikleri, bülten seçimlerini, hesap özelliklerini ve ilgili kişiselleştirme yüzeylerini ortak bir ürün deneyiminde sunar. Hizmetin bölümleri zaman içinde geliştirilebilir, değiştirilebilir veya teknik nedenlerle geçici olarak kullanılamayabilir."] },
      { id: "hesap", title: "Hesap ve güvenlik", paragraphs: ["Hesap oluştururken doğru ve güncel bilgi vermen, şifreni ve hesabına erişimi koruman beklenir. Hesabında gerçekleşen şüpheli bir erişimi fark edersen mümkün olan en kısa sürede şifreni değiştirmen ve Hiposta ile iletişime geçmen gerekir."] },
      { id: "icerik", title: "İçerik ve fikri haklar", paragraphs: ["Hiposta ve bağlı yayınlardaki metin, görsel, marka, tasarım ve diğer içeriklerin hakları ilgili hak sahibine aittir. Hizmet, aksi açıkça belirtilmedikçe kişisel ve hukuka uygun kullanım için sunulur; içeriklerin izinsiz ticari çoğaltılması, sistematik çekilmesi veya yeniden dağıtılması yasaktır."] },
      { id: "kullanim", title: "Kabul edilemez kullanım", paragraphs: ["Hizmetin güvenliğini veya diğer kullanıcıların erişimini bozacak, yetkisiz erişim sağlamaya çalışacak, kötüye kullanım/otomasyon yoluyla altyapıya aşırı yük bindirecek veya yürürlükteki hukuka aykırı faaliyetlere izin verilmez."] },
      { id: "baglantilar", title: "Üçüncü taraf bağlantılar", paragraphs: ["İçeriklerde veya sponsorluk alanlarında üçüncü taraf sitelere bağlantı bulunabilir. Bu sitelerin içerik, güvenlik ve gizlilik uygulamaları ilgili üçüncü tarafın sorumluluğundadır."] },
      { id: "premium", title: "Premium ve ödeme", paragraphs: ["Premium içerik yüzeyleri ürün içinde bulunabilir ancak bu sürümde ücretli ödeme/tahsilat akışı aktif değildir. Ücretli üyelik başlatılmadan önce fiyat, dönem, ön bilgilendirme, mesafeli sözleşme ve uygulanabilir iptal/iade koşulları ayrıca sunulacaktır."] },
      { id: "hukuk", title: "Uygulanacak kurallar", paragraphs: ["Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Tüketici mevzuatı ve diğer emredici hükümlerden doğan haklar sınırlandırılmaz. Hiposta’nın mevzuattan kaynaklanan sorumlulukları sözleşmeyle ortadan kaldırılamaz."] },
    ],
  },
  membership: {
    eyebrow: "Üyelik ve abonelik",
    title: "Hesap, bülten ve abonelik tercihlerini nasıl yönettiğimizi açıklayan koşullar.",
    lead: "Hiposta hesabı ve mevcut bülten abonelikleri ücretsizdir. Kullanıcı hangi bültene kaydolacağını seçer; başka bir yayına otomatik abonelik oluşturulmaz.",
    scope: "Hiposta hesabı, ücretsiz bülten abonelikleri, bekleme listeleri ve gelecekteki premium üyeliğe hazırlık.",
    showCompany: true,
    sections: [
      { id: "uyelik", title: "Hesap üyeliği", paragraphs: ["Hesap oluşturmak ücretsizdir. Hesap; bültenlerini, kayıtlı içeriklerini, okuma geçmişini ve uygun olduğu ölçüde kişiselleştirme tercihlerini tek yerde yönetmene imkân verir. E-posta doğrulaması güvenlik ve hesap sahipliği için kullanılabilir."] },
      { id: "bulten", title: "Bülten aboneliği", paragraphs: ["Hesap açmadan da uygun bültenlere e-posta adresinle abone olabilirsin. Her seçim belirli bülten veya bültenler içindir; paket seçimi paketteki bültenleri tek tek abonelik tercihine ekler."], items: ["Seçmediğin yayına otomatik abonelik yapılmaz", "Bülten tercihini daha sonra değiştirebilir veya abonelikten ayrılabilirsin", "Gönderim etkinleştiğinde gerekli doğrulama ve ayrılma mekanizmaları iletide görünür olur"] },
      { id: "ileti", title: "Elektronik iletiler", paragraphs: ["Bülten veya duyuru ileti izni, seçtiğin içerik akışı için alınır. Ticari elektronik ileti niteliğindeki gönderimler devreye alındığında yürürlükteki onay, ret ve gerekli İleti Yönetim Sistemi süreçleri ayrıca uygulanır. Güvenlik, şifre sıfırlama veya hizmetin yürütülmesi için zorunlu işlem iletileri pazarlama iletisinden ayrı değerlendirilir."] },
      { id: "ayrilma", title: "Ayrılma ve hesap kapatma", paragraphs: ["Bültenlerden hesabın üzerinden veya gönderim devreye girdiğinde iletide sunulan ayrılma mekanizmasıyla çıkabilirsin. Hesap kapatma/veri talepleri için kvkk@hipmedya.com adresine başvurabilirsin; mevzuat gereği saklanması gereken kayıtlar varsa bunlar ilgili süre boyunca sınırlı şekilde tutulabilir."] },
      { id: "ucretli", title: "Ücretli üyelik henüz aktif değil", paragraphs: ["Bu koşullar şu anda herhangi bir ücretli satış veya otomatik yenileme taahhüdü oluşturmaz. Premium ödeme açıldığında ücret, faturalandırma dönemi, otomatik yenileme varsa bunun koşulları, cayma/iptal/iade ve ön bilgilendirme satın alma işleminden önce ayrı ve görünür biçimde sunulacaktır."] },
    ],
  },
};
