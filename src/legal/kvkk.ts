/* Gizlilik Politikası & KVKK Aydınlatma Metni.
   Metin, şirket tarafından sağlanan hukuki içeriktir; ifadeler değiştirilmeden
   yalnızca yapılandırılmıştır. Güncelleme yapılırken hukuk danışmanı onayı alınmalıdır. */

export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "dl"; items: { k: string; v: string }[] }
  | { kind: "lead"; items: { k: string; v: string }[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "purposes"; items: { text: string; basis: string }[] };

export type LegalSection = { n: string; title: string; blocks: LegalBlock[] };

export const KVKK_META = {
  kicker: "YASAL / KVKK",
  title: "Gizlilik Politikası & KVKK Aydınlatma Metni",
  lead: "KUK PROJE MÜHENDİSLİK İNŞAAT TİCARET LİMİTED ŞİRKETİ olarak kişisel verilerinizin 6698 sayılı KVKK ve ikincil mevzuata uygun işlenmesi, korunması ve haklarınızın güvence altına alınması için hazırlanan metindir.",
  updated: "28.10.2026",
  preamble:
    "KUK PROJE MÜHENDİSLİK İNŞAAT TİCARET LİMİTED ŞİRKETİ (“Kuk İnşaat”, “Şirket” veya “Veri Sorumlusu”) olarak; web sitemizi ziyaret eden, iletişim formumuzu dolduran, teklif ve keşif talebinde bulunan, e-posta, telefon, KEP ve sosyal medya kanallarıyla bizimle irtibat kuran gerçek kişilere ait kişisel verilerin güvenliği ve hukuka uygun işlenmesi, KVKK başta olmak üzere tüm ilgili mevzuat kapsamında öncelikli politikamızdır.",
} as const;

export const KVKK_SECTIONS: LegalSection[] = [
  {
    n: "01",
    title: "Aydınlatma Metninin Konusu ve Kapsamı",
    blocks: [
      {
        kind: "p",
        text: "İşbu Gizlilik Politikası ve Kişisel Verilerin İşlenmesine İlişkin Aydınlatma Metni (“Metin”); 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”), 7499 sayılı Kanun ile 9. maddede yapılan değişiklikler, 10.07.2024 tarihli ve 32598 sayılı Resmî Gazete’de yayımlanan yurt dışına aktarım Yönetmeliği, Kişisel Verileri Koruma Kurulu’nun (“Kurul”) ikincil düzenlemeleri ile Aydınlatma Yükümlülüğü Hakkında Tebliğ (RG 10.03.2018/30364), 18.02.2026 tarihli 2026/347 sayılı Kurul İlke Kararı ve ilgili sair mevzuat (5651 sayılı Kanun, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun, 6502 sayılı TKHK) uyarınca; KUK PROJE MÜHENDİSLİK İNŞAAT TİCARET LİMİTED ŞİRKETİ (“Şirket”, “KUK İnşaat” veya “Veri Sorumlusu”) tarafından işletilmekte olan kukinsaat.com alan adlı internet sitesi (“Site”), Site üzerinden sunulan hizmetler ve iletişim kanalları aracılığıyla işlenen kişisel veriler bakımından veri sahiplerinin KVKK’nın 10. ve 11. maddeleri kapsamında aydınlatılması amacıyla hazırlanmıştır.",
      },
      {
        kind: "p",
        text: "İşbu Metin; Site’de yer alan harici bağlantılara ve üçüncü taraf platformlarına (Instagram, LinkedIn, Facebook/X, Google Maps, görsel CDN hizmetleri dâhil ancak bunlarla sınırlı olmamak üzere) ilişkin hüküm içermez. Anılan platformlar kendi gizlilik politikalarına tâbi olup; üçüncü taraf içeriklerinden ve uygulamalarından Şirketimiz sorumlu tutulamaz.",
      },
      {
        kind: "p",
        text: "Bu metin bir aydınlatma bildirimidir; okunması, Site’nin kullanılması veya iletişim formunun açılması, kişisel veri işleme ya da yurt dışına aktarım için açık rıza verildiği anlamına gelmez. Açık rıza gereken bir işlem bulunması hâlinde rıza, ilgili amaç ve veri aktarımı açıkça belirtilerek ayrı ve olumlu bir seçimle alınır. Tüzel kişi yetkilileri ve çalışanları bakımından haklar yalnızca gerçek kişiye ait veriler için geçerli olup; tüzel kişiye ilişkin bilgiler KVKK kapsamı dışındadır.",
      },
    ],
  },
  {
    n: "02",
    title: "Veri Sorumlusunun ve Temsilcisinin Kimliği",
    blocks: [
      {
        kind: "p",
        text: "KVKK’nın 3/1-(ı) maddesi uyarınca kişisel verileriniz bakımından veri sorumlusu sıfatıyla:",
      },
      {
        kind: "dl",
        items: [
          { k: "Unvan", v: "KUK PROJE MÜHENDİSLİK İNŞAAT TİCARET LİMİTED ŞİRKETİ" },
          { k: "Adres", v: "Ovacık Mah. Çuhane Cad. No:176 Başiskele, Kocaeli" },
          { k: "Telefon", v: "+90 543 741 05 41" },
          { k: "E-posta", v: "umut@kukinsaat.com" },
          {
            k: "Kayıtlı Elektronik Posta (KEP)",
            v: "kukprojemuhendislik@hs01.kep.tr — hukuki bildirim, ihtar ve başvurular için öncelikli resmî kanal",
          },
          { k: "Vergi Dairesi / Vergi No", v: "Tepecik Vergi Dairesi — 5901396595" },
          { k: "MERSİS No", v: "0590139659500001" },
          {
            k: "Ticaret Sicili",
            v: "Kocaeli Ticaret Sicili Müdürlüğü nezdinde tescil edilmiştir; sicil bilgileri 0590139659500001 MERSİS numarası üzerinden doğrulanabilir.",
          },
          {
            k: "Yazılı bildirim",
            v: "Başvuru ve ihtar niteliğindeki bildirimler için yukarıdaki KEP adresi, noter ve iadeli taahhütlü posta kanalları geçerlidir.",
          },
        ],
      },
      {
        kind: "p",
        text: "Şirketimizin Türkiye’de yerleşik olması nedeniyle ayrı bir “Veri Sorumlusu Temsilcisi” atanması zorunlu değildir. Yurt dışında ikamet eden veri sahipleri, işbu Metin’in 11. bölümünde yer alan iletişim kanallarını kullanarak doğrudan Şirketimize başvurabilir.",
      },
    ],
  },
  {
    n: "03",
    title: "İşlenen Kişisel Veri Kategorileri ve Türleri",
    blocks: [
      {
        kind: "p",
        text: "Şirketimizce Site üzerinden ve iletişim kanalları aracılığıyla işlenen kişisel veriler, elde edilme biçimine göre aşağıda sınıflandırılmıştır. Şirketimiz, Site üzerinden özel nitelikli kişisel veri (KVKK md.6 — ırk, etnik köken, siyasi düşünce, felsefi inanç, din, mezhep, kılık/kıyafet, dernek/vakıf/sendika üyeliği, sağlık, cinsel hayat, ceza mahkûmiyeti ve güvenlik tedbirleri ile biyometrik ve genetik veriler) toplamayı amaçlamaz ve talep etmez. Bu mahiyette verilerin tarafımızca paylaşılması hâlinde, söz konusu veriler ancak KVKK md.6/2 ve md.6/3’te sayılan istisnaların varlığı hâlinde işlenebilir; aksi hâlde en kısa sürede imha edilir. Özel nitelikli kişisel verilerinizi paylaşmamanız önemle rica olunur.",
      },
      {
        kind: "table",
        head: ["Kategori", "Veri türleri", "Toplanma biçimi"],
        rows: [
          ["Kimlik", "Ad, soyad", "İletişim formu, e-posta, telefon ve KEP ile iletilenler"],
          [
            "İletişim",
            "E-posta adresi, telefon numarası, tercihe bağlı açık adres, iletişim konusu ve mesaj içeriği",
            "İletişim formu, e-posta yazışmaları, teklif/başvuru iletileri",
          ],
          [
            "Müşteri / Sözleşme",
            "Proje, keşif ve teklif değerlendirmesi için paylaşılan arsa, yapı, konum ve bütçe bilgileri",
            "Tarafınızca iletilen mesaj ve dokümanlar",
          ],
          [
            "İşlem güvenliği",
            "IP adresi, tarayıcı türü/sürümü, işletim sistemi, cihaz türü, ziyaret saati ve süresi, yönlendiren sayfa, görüntülenen sayfalar, ekran çözünürlüğü, HTTP istek/yanıt kodları",
            "Sunucu erişim kayıtları, çerezler, üçüncü taraf analiz ve harita hizmetleri",
          ],
          [
            "Hukuki işlem / uyum",
            "Başvuru, şikâyet ve yazışma kayıtları; kimlik tespitine ilişkin bilgiler",
            "KVKK md.11 başvuruları, şikâyetler, adli/idari mercilerden gelen talepler",
          ],
          [
            "Pazarlama / tercih",
            "Bülten ve kampanya tercihleri; ticari elektronik ileti onay/ret kaydı (İYS)",
            "Yalnızca açık rıza beyanı hâlinde",
          ],
        ],
      },
    ],
  },
  {
    n: "04",
    title: "Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepleri",
    blocks: [
      {
        kind: "p",
        text: "Kişisel verileriniz; KVKK’nın 5. maddesindeki genel şartlar ve 6. maddesindeki özel nitelikli kişisel veri işleme şartları çerçevesinde, aşağıdaki amaçlarla bağlantılı, sınırlı ve ölçülü olarak işlenir:",
      },
      {
        kind: "purposes",
        items: [
          {
            text: "Tarafınızca iletilen talep, teklif, şikâyet ve başvuruların değerlendirilmesi, yanıtlanması ve sonuçlandırılması; bu kapsamda sizinle iletişime geçilmesi.",
            basis: "KVKK md.5/2-(e) bir hakkın tesisi, kullanılması veya korunması; md.5/2-(f) ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati.",
          },
          {
            text: "İnşaat, mühendislik, proje yönetimi, danışmanlık ve uygulama hizmetlerinin kapsamının belirlenmesi; teklif, keşif ve ön değerlendirme süreçlerinin yürütülmesi; ileride akdedilmesi muhtemel sözleşmelerin kurulması ve ifası.",
            basis: "KVKK md.5/2-(c) sözleşmenin kurulması ve ifası; md.5/2-(ç) veri sorumlusunun hukuki yükümlülüğü.",
          },
          {
            text: "Site’nin işletilmesi, bilgi ve işlem güvenliğinin sağlanması; siber tehditlerin, yetkisiz erişimlerin ve kötü niyetli trafiğin tespiti; 5651 sayılı Kanun ve ilgili mevzuattan doğan erişim kayıtlarını tutma yükümlülüğü.",
            basis: "KVKK md.5/2-(ç) hukuki yükümlülük; md.5/2-(a) kanunlarda öngörülmesi.",
          },
          {
            text: "Kullanım deneyiminin iyileştirilmesi, ziyaret istatistiklerinin anonim/toplu hâle getirilerek raporlanması; Site performansının ölçülmesi.",
            basis: "KVKK md.5/2-(f) meşru menfaat; açık rıza gerektiren çerezler bakımından md.5/1 açık rıza.",
          },
          {
            text: "Mevzuattan kaynaklanan saklama, bildirim, denetim, vergi ve beyanname yükümlülüklerinin (TTK/VUK/5651/KVKK) yerine getirilmesi; adli ve idari mercilerin hukuka uygun taleplerine cevap verilmesi.",
            basis: "KVKK md.5/2-(a) kanunlarda öngörülmesi; md.5/2-(ç) hukuki yükümlülük.",
          },
          {
            text: "Şirketimizin hukuki uyuşmazlıklarda haklarını kullanması, savunma yapması ve delil olarak sunması; müşteri ilişkileri, kurumsal iletişim ve itibar yönetimi.",
            basis: "KVKK md.5/2-(e) hakkın tesisi ve korunması; md.5/2-(f) meşru menfaat.",
          },
          {
            text: "Açık rıza vermeniz hâlinde tarafınıza ticari elektronik ileti gönderilmesi; kampanya ve bülten iletilmesi.",
            basis: "KVKK md.5/1 açık rıza; 6563 sayılı Kanun’un ticari elektronik ileti hükümleri ve İYS mevzuatı (onayı dilediğiniz zaman ve hiçbir gerekçe göstermeksizin geri alabilirsiniz).",
          },
        ],
      },
    ],
  },
  {
    n: "05",
    title: "Toplanma Yöntemi ve Otomatik Yollarla İşleme",
    blocks: [
      {
        kind: "p",
        text: "Verileriniz; Site üzerindeki iletişim formu, e-posta adreslerimiz, KEP, telefon, sosyal medya doğrudan mesajları ve yazılı/sözlü diğer iletişim kanalları aracılığıyla tamamen veya kısmen otomatik yollarla ya da veri kayıt sistemimizin parçası olmak kaydıyla otomatik olmayan yollarla elde edilir. İşlem güvenliği verileri sunucu günlükleri ve çerezler vasıtasıyla otomatik olarak toplanır.",
      },
      {
        kind: "p",
        text: "Kişisel verileriniz, münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkarılması amacıyla kullanılmaz; profil oluşturma, otomatik karar verme veya puanlama yapılmamaktadır. Böyle bir sonuca karşı KVKK md.11/1-(g) kapsamında itiraz etme hakkınız saklıdır.",
      },
    ],
  },
  {
    n: "06",
    title: "Yurt İçinde ve Yurt Dışında Aktarım",
    blocks: [
      {
        kind: "p",
        text: "Kişisel verileriniz; KVKK’nın 8. ve 9. maddeleri ile Veri Sorumluları Tarafından Kişisel Verilerin Aktarılmasına İlişkin Usul ve Esaslar Hakkında Yönetmelik (RG 10.03.2024/32486) çerçevesinde, yukarıda belirtilen amaçlar ve hukuki sebeplerle sınırlı olarak aşağıdaki alıcı gruplarına aktarılabilir:",
      },
      {
        kind: "lead",
        items: [
          {
            k: "Yurt içi alıcı grupları",
            v: "Şirketimizin avukatları, mali müşavirleri, vergi ve denetim danışmanları, bilgi teknolojileri hizmet sağlayıcıları (e-posta, barındırma, sunucu hizmetleri), bankalar ve finans kuruluşları, KEP/kargo/posta hizmet sağlayıcıları; hukuki yükümlülük kapsamında yetkili kamu kurum ve kuruluşları (mahkemeler, icra daireleri, KVKK Kurulu, kolluk, vergi daireleri ve benzerleri).",
          },
          {
            k: "Yurt dışı alıcılar",
            v: "Site’nin çalışması için kullanılan ve sunucuları Türkiye dışında bulunan veya veri akışı Türkiye dışına gerçekleşebilecek hizmet sağlayıcılar (Google LLC — Analytics/Maps, ABD; Meta/Instagram, ABD/AB; Pexels — görsel CDN, AB/ABD; LinkedIn/Microsoft, ABD/AB; e-posta hizmet sağlayıcısı). Bu aktarım; (i) açık rızanıza, (ii) md.9/2-(a) yeterli koruma bulunan ülke, (iii) md.9/2-(b) Kurul’un onayladığı Standart Sözleşme’nin imzalanması ve Kurul’a bildirilmesi, (iv) md.9/2-(ç) şirket grubu/belirlenen şahıs grubu için yazılı taahhütname, (v) md.9/2-(d) bağlayıcı kurumsal kurallar veya (vi) md.9/2-(e) yazılı sözleşme ile Türkiye’de yetkili temsilci ataması suretiyle gerçekleştirilir. Anılan aktarımlarda KVKK md.9/3 uyarınca asgari teknik ve idari tedbirler ayrıca alınır; yurt dışından Türkiye’ye aktarımlarda md.9/4 ve md.9/5 hükümleri uygulanır. Site’yi kullanmakla ve/veya iletişim formu göndermekle bu aktarımlara açıkça rıza göstermiş olursunuz; rızanızı dilediğiniz zaman geri alabilirsiniz.",
          },
        ],
      },
      {
        kind: "p",
        text: "Verileriniz hiçbir koşulda ticari amaçla veri simsarlarına, veri aracı platformlarına veya Şirketimizin faaliyet konusuyla doğrudan ilgisi bulunmayan üçüncü kişilere satılmaz, kiralanmaz ve kâr paylaşımı karşılığı paylaşılmaz.",
      },
    ],
  },
  {
    n: "07",
    title: "Çerezler (Cookies) ve Benzeri Teknolojiler",
    blocks: [
      {
        kind: "p",
        text: "Site’de zorunlu çerezler (oturum ve güvenlik), işlevsel/tercih çerezleri, performans/analiz çerezleri ve üçüncü taraf içerik çerezleri (Google Maps, görsel CDN, sosyal medya bileşenleri) kullanılabilir. Zorunlu çerezler KVKK md.5/2-(a) ve (ç) uyarınca rızanıza bakılmaksızın kullanılır; performans, pazarlama ve üçüncü taraf çerezleri yalnızca açık rızanız hâlinde etkinleştirilir. Çerez tercihinizi Site alt bandındaki bildirimden veya alt bilgi bölümündeki “Çerez Tercihleri” bağlantısından her zaman değiştirebilirsiniz.",
      },
      {
        kind: "p",
        text: "Tarayıcı ayarlarınızdan çerezleri silebilir, engelleyebilir veya uyarı alabilirsiniz; ancak bu durum Site’nin bazı işlevlerinin (harita gömülüsü, form oturumu vb.) çalışmamasına yol açabilir. Bu durumdan doğacak aksaklıklar Şirketimizin sorumluluğunda değildir.",
      },
    ],
  },
  {
    n: "08",
    title: "Saklama Süresi, Silinmesi, Yok Edilmesi ve Anonimleştirilmesi",
    blocks: [
      {
        kind: "p",
        text: "Kişisel verileriniz; işleme amaçlarının gerektirdiği süre kadar ve her hâlükârda mevzuattan doğan saklama ve zamanaşımı yükümlülükleri süresince saklanır:",
      },
      {
        kind: "ul",
        items: [
          "İletişim, talep ve teklif kayıtları: talebin sonuçlandırılmasını izleyen 2 yıl; sözleşme kurulması hâlinde genel zamanaşımı süresi olan 10 yıl (TBK md.146) sonuna kadar.",
          "Ticari elektronik ileti onay/ret kayıtları (İYS kayıtları dâhil): 6563 sayılı Kanun ve Yönetmeliği uyarınca mevzuatta öngörülen süre boyunca (en az 3 yıl).",
          "Ticari defter ve belgeler: 10 yıl (TTK md.82); vergi mevzuatı kapsamındaki belgeler en az 5 yıl (VUK md.253).",
          "Site erişim ve işlem güvenliği kayıtları: 12 ay; yer sağlayıcı sıfatının bulunması hâlinde 5651 sayılı Kanun md.5 uyarınca 1 yıl (kullanıcıya ilişkin bilgiler için 2 yıl).",
          "KVKK md.11 başvuruları ve yanıt kayıtları: 3 yıl; uyuşmazlık hâlinde zamanaşımı süresince.",
          "Hukuki uyuşmazlıklarda delil niteliği taşıyan kayıtlar: kesinleşmiş yargı kararının icrasına kadar.",
        ],
      },
      {
        kind: "p",
        text: "Saklama sürelerinin sonunda veya işleme amaçlarının ortadan kalkması hâlinde kişisel verileriniz, resen veya talebiniz üzerine KVKK md.7 ve Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonimleştirilmesi Politikaları Hakkında Yönetmelik (RG 28.10.2017/30206) uyarınca silinir, yok edilir veya anonim hâle getirilir. Anonimleştirilmiş veriler istatistik ve güvenlik amaçlarıyla saklanmaya devam edebilir; bu veriler KVKK kapsamında değerlendirilmez.",
      },
    ],
  },
  {
    n: "09",
    title: "Veri Güvenliği ve Alınan Teknik/İdari Tedbirler",
    blocks: [
      {
        kind: "p",
        text: "Şirketimiz, kişisel verilerin hukuka aykırı işlenmesini, erişilmesini ve muhafaza edilmesini önlemek amacıyla KVKK md.12 ve Kurul’un veri güvenliği rehberleri çerçevesinde uygun teknik ve idari tedbirleri alır:",
      },
      {
        kind: "ul",
        items: [
          "Görev bazlı erişim yetkilendirmesi ve en az yetki ilkesi",
          "Sunucularda TLS 1.2+ / HTTPS, güncel şifreleme ve anahtar yönetimi",
          "Periyodik risk değerlendirmesi, sızma testi ve log denetimi",
          "Çalışanlara KVKK ve bilgi güvenliği eğitimi, gizlilik taahhütnamesi",
          "Kişisel veri içeren kayıtların şifreli saklanması ve erişim logları",
          "Üçüncü taraf hizmet sağlayıcılarla sözleşmesel gizlilik/KVKK hükümleri",
          "Kurul’un öngördüğü asgari idari ve teknik tedbirlerin uygulanması",
          "Veri güvenliği ihlali hâlinde KVKK md.12/5 uyarınca en kısa sürede Kurul’a ve ilgili kişiye bildirim prosedürü",
        ],
      },
      {
        kind: "p",
        text: "İnternet ortamının mutlak güvenli bir ortam olmaması nedeniyle Site üzerinden iletilen verilerin güvenliği; kullandığınız cihaz, şebeke ve e-posta sağlayıcının güvenlik düzeyine de bağlıdır. Cihaz, ağ ve hesap güvenliğiniz (parola, iki aşamalı doğrulama vb.) bakımından tarafınız sorumludur.",
      },
    ],
  },
  {
    n: "10",
    title: "Veri Sahibinin Hakları (KVKK md.11)",
    blocks: [
      { kind: "p", text: "KVKK’nın 11. maddesi uyarınca veri sahipleri;" },
      {
        kind: "ul",
        items: [
          "Kişisel verilerinin işlenip işlenmediğini öğrenme.",
          "İşlenmişse buna ilişkin bilgi talep etme.",
          "İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme.",
          "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme.",
          "Eksik veya yanlış işlenmişse düzeltilmesini isteme.",
          "KVKK md.7 çerçevesinde silinmesini veya yok edilmesini isteme.",
          "Bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme.",
          "Münhasıran otomatik sistemlerle analiz sonucu aleyhe sonuca itiraz etme.",
          "Hukuka aykırı işleme bağlı zararın giderilmesini talep etme.",
        ],
      },
      {
        kind: "p",
        text: "Bu haklar yalnızca tarafınıza ait veriler için ve kimliğiniz doğrulanmak suretiyle kullanılabilir. Üçüncü kişilere ait veriler bakımından başvuru yapılamaz; tüzel kişi adına yapılan başvurularda yetki belgesi sunulması zorunludur.",
      },
    ],
  },
  {
    n: "11",
    title: "Başvuru Usulü, Süre ve Ücret",
    blocks: [
      {
        kind: "p",
        text: "KVKK md.11 kapsamındaki taleplerinizi; (i) kimlik doğrulamaya elverişli belge ve tebligata elverişli adres bilgisiyle birlikte yazılı olarak Şirketimizin adresine ulaştırarak, (ii) kukprojemuhendislik@hs01.kep.tr KEP adresine veya (iii) umut@kukinsaat.com adresine kayıtlı elektronik imza, mobil imza ya da Kurul tarafından belirlenen diğer usullerle gönderebilirsiniz. Başvuruda talebin konusu, ad soyad, T.C. kimlik numarası (yabancılar için uyruk/pasaport no), iletişim adresi ve konuya ilişkin bilgi/belge yer almalıdır.",
      },
      {
        kind: "p",
        text: "Başvurular talebin niteliğine göre en kısa sürede ve en geç 30 gün içinde ücretsiz olarak sonuçlandırılır. İşlemin ayrıca bir maliyet gerektirmesi hâlinde Kurul’un belirlediği tarifedeki ücret talep edilebilir. Cevap yazılı veya elektronik ortamda bildirilir; reddedilmesi hâlinde gerekçe belirtilir ve karara karşı 30 gün içinde Kurul’a şikâyet hakkınız bulunur.",
      },
      {
        kind: "p",
        text: "Tekrarlayan, orantısız, dayanaktan yoksun, kimliği doğrulanamayan veya kötü niyetli başvurular; KVKK md.13/3 uyarınca işleme alınmayabilir ya da Kurul’un belirlediği tarifeye göre ücretlendirilebilir. Başvurunuz yalnızca tarafınıza ait veriler ve talep edilen kapsamla sınırlı olarak değerlendirilir; üçüncü kişilerin verileri ile ticari sır kapsamındaki bilgi ve belgeler talep kapsamı dışında kalır.",
      },
    ],
  },
  {
    n: "12",
    title: "Üçüncü Taraf İçerikleri ve Dış Bağlantılar",
    blocks: [
      {
        kind: "p",
        text: "Site’de yer verilen Google harita gömülüleri, görsel CDN hizmetleri, sosyal medya bağlantıları ve diğer harici bağlantılar; ilgili üçüncü tarafın kendi gizlilik politikalarına ve hizmet şartlarına tâbidir. Şirketimiz, anılan üçüncü tarafların uygulamalarından, içeriklerinden veya güvenliklerinden sorumlu değildir. Dış bağlantılara tıklayarak ulaşacağınız sayfalara ilişkin sorumluluk size aittir.",
      },
    ],
  },
  {
    n: "13",
    title: "Ticari Elektronik İletiler ve Pazarlama",
    blocks: [
      {
        kind: "p",
        text: "Şirketimizden ticari elektronik ileti (e-posta, SMS, arama vb.) almak istemeniz hâlinde; 6563 sayılı Kanun ve Elektronik Ticari İleti İzni İçin Onayın Alınmasına Dair Yönetmelik çerçevesinde, elektronik ortamda ve İleti Yönetim Sistemi (İYS) nezdinde doğrulanabilir biçimde açık rızanız alınır. Onay vermemeniz hâlinde tarafınıza hiçbir pazarlama iletisi gönderilmez ve bu durumda hiçbir hakkınız kısıtlanmaz. Vermiş olduğunuz onayı, iletilerde yer alan “abonelikten çık” bağlantısı veya umut@kukinsaat.com adresine ret bildirimi göndermek suretiyle her zaman ve gerekçe göstermeksizin geri alabilirsiniz; ret bildiriminin ulaşmasını takiben en geç 3 iş günü içinde iletişim durdurulur. Hizmet ifasına ilişkin bildirimler (teklif yanıtları, randevu ve keşif teyidi vb.) ticari elektronik ileti kapsamında değildir.",
      },
    ],
  },
  {
    n: "14",
    title: "Çocukların Verileri",
    blocks: [
      {
        kind: "p",
        text: "Site genel kullanıma açık olmakla birlikte 18 yaşın altındaki kişilere yönelik değildir ve bilerek çocuklardan kişisel veri toplanmaz. 18 yaşın altındaki kişilere ait veriler ancak yasal temsilcilerinin açık rızası ve yönlendirmesiyle işlenir; aksinin tespiti hâlinde söz konusu veriler derhal silinir.",
      },
    ],
  },
  {
    n: "15",
    title: "Sorumluluk Reddi ve Beyanlar",
    blocks: [
      {
        kind: "p",
        text: "Site’deki içerikler, Şirketimizin faaliyet konusu hakkında genel bilgilendirme amacıyla sunulur; belirli bir projeye yönelik teklif, sözleşme öncesi beyan, taahhüt, garanti veya satış teklifi niteliği taşımaz. Teklifler; keşif, zemin/etüt ve ön değerlendirme neticesinde yazılı olarak ve yalnızca yetkili kişilerce verilebilir. Site’de yer alabilecek maddi veya yazım hataları ile teknik aksaklıklardan Şirketimiz sorumlu tutulamaz. Şirketimiz, Site içeriğini ve hizmetlerini önceden bildirimde bulunmaksızın değiştirme, durdurma veya yayından kaldırma hakkını saklı tutar.",
      },
      {
        kind: "p",
        text: "Site üzerinden ilettiğiniz mesaj ve dokümanlarda üçüncü kişilere ait kişisel veri bulunması hâlinde, ilgili kişilerden gerekli açık rızaların alınmış olması ve KVKK’ya uygun paylaşım yapılması tamamen sizin sorumluluğunuzdadır; bu nedenle doğabilecek idari para cezaları ve tazminat talepleri tarafınıza aittir. Özel nitelikli kişisel verilerinizi Şirketimizle paylaşmamanız tavsiye olunur.",
      },
    ],
  },
  {
    n: "16",
    title: "Değişiklikler ve Yürürlük",
    blocks: [
      {
        kind: "p",
        text: "Şirketimiz işbu Metin’i; mevzuat değişiklikleri, Kurul kararları veya hizmetlerindeki değişiklikler doğrultusunda tek taraflı olarak güncelleyebilir. Güncellenen Metin, Site’de yayımlandığı tarihte yürürlüğe girer ve yürürlükteki son sürüm her zaman bu sayfada yayımlanır. İşbu Metnin 28.10.2026 tarihli sürümü yürürlüktedir.",
      },
    ],
  },
  {
    n: "17",
    title: "Uyuşmazlıkların Çözümü ve Uygulanacak Hukuk",
    blocks: [
      {
        kind: "p",
        text: "İşbu Metin Türkiye Cumhuriyeti hukukuna tâbidir. Bu Metin’den kaynaklanabilecek uyuşmazlıkların çözümünde Kocaeli Mahkemeleri ve İcra Daireleri münhasıran yetkilidir. Tüketici sıfatı taşıyan kişilere ilişkin uyuşmazlıklarda, 6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca kanunen yetkili Tüketici Hakem Heyetleri ve Tüketici Mahkemelerinin yasal yetkisi saklıdır.",
      },
      {
        kind: "p",
        text: "Veri sahipleri KVKK kapsamında her zaman Kurul’a şikâyet hakkına sahiptir. Anılan şikâyet yollarının tüketilmesi, KVKK md.14 uyarınca kişisel verilerin işlenmesi hukuka aykırılığından doğan zararlar için maddi ve manevi tazminat davası açılmasının ön şartıdır; bu nedenle mahkemeye başvurmadan önce Kurul nezdinde idari başvurunun sonuçlandırılması zorunludur. Şikâyet ve soruşturma süreci tamamlanmadan tazminat talebi yöneltilemez.",
      },
    ],
  },
];

export const KVKK_REGISTRY = {
  heading: "Veri sorumlusu kayıt ve iletişim bilgileri",
  name: "KUK PROJE MÜHENDİSLİK İNŞAAT TİCARET LİMİTED ŞİRKETİ",
  address: "Ovacık Mah. Çuhane Cad. No:176 Başiskele, Kocaeli",
  facts: [
    { k: "MERSİS No", v: "0590139659500001" },
    { k: "Vergi Dairesi / No", v: "Tepecik Vergi Dairesi / 5901396595" },
    { k: "Ticaret Sicili", v: "Kocaeli Ticaret Sicili Müdürlüğü" },
    { k: "Yürürlük", v: "28.10.2026" },
  ],
  phone: "+90 543 741 05 41",
  phoneHref: "+905437410541",
  email: "umut@kukinsaat.com",
  kep: "kukprojemuhendislik@hs01.kep.tr",
  hours: "Pazartesi–Cumartesi, 09:00–18:00",
  note: "İşbu metnin 28.10.2026 tarihli sürümü yürürlüktedir; 6698 sayılı Kanun, ikincil düzenlemeler ve Kurul kararları doğrultusunda güncellenir.",
} as const;
