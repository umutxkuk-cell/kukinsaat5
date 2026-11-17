/* KUK İnşaat hizmet içerikleri.
   Beş hizmet başlığı, şirketin hizmet sayfalarındaki kapsama dayanır (bkz. data.ts).
   Her hizmetin blokları, hizmetin doğasına göre farklı bir sırada ve farklı biçimlerde kurgulanmıştır.
   Doğrulanmamış kapasite, referans, sertifika veya rakam bilgisi bu dosyaya eklenmez.
   Hizmet görselleri (public/images/services) her hizmetin konusunu anlatan konsept görselleridir;
   sitenin başka bölümlerinde kullanılmaz ve gerçek bir şantiyeyi/projeyi temsil etmez. */

export type ServiceItem = { title: string; text: string };

export type ServiceBlock =
  | { kind: "list"; eyebrow: string; title: string; items: string[] }
  | { kind: "steps"; eyebrow: string; title: string; items: ServiceItem[] }
  | { kind: "table"; eyebrow: string; title: string; rows: ServiceItem[] }
  | { kind: "prose"; eyebrow: string; title: string; paragraphs: string[] }
  | { kind: "pair"; eyebrow: string; title: string; left: ServiceItem; right: ServiceItem };

export type ServiceFaq = { q: string; a: string };

export type Service = {
  n: string;
  slug: string;
  title: string;
  note: string;
  short: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  h1: string;
  heroMeta: string[];
  introTitle: string;
  intro: string[];
  blocks: ServiceBlock[];
  faqs: ServiceFaq[];
  related: string[];
  ctaTitle: string;
};

export const services: Service[] = [
  {
    n: "01",
    slug: "insaat-ve-yapi-uygulamalari",
    title: "İnşaat ve Yapı Uygulamaları",
    note: "Konut, ticari ve karma kullanımlı yapılar",
    short: "Kaba yapıdan ince işe kadar imalat kalemlerini saha düzeni ve iş programıyla birlikte yürütüyoruz.",
    seoTitle: "İnşaat ve Yapı Uygulamaları | Başiskele ve İzmit, Kocaeli — KUK İnşaat",
    seoDescription: "Başiskele, İzmit ve Kocaeli genelinde konut, ticari ve karma kullanımlı yapılar için saha organizasyonu, kaba-ince yapı uygulaması ve iş programı takibi.",
    image: "/images/services/01-uygulama.jpg",
    imageAlt: "Altın saat ışığında kolonları ve döşemeleri dökülmüş, kalıp ve dikmeleri yerinde betonarme karkas yapı — konsept görseli",
    imageWidth: 1248,
    imageHeight: 832,
    h1: "Projeyi sahada doğru sırayla uygulamak",
    heroMeta: ["Konut", "Ticari", "Karma kullanım"],
    introTitle: "Her imalat, bir sonrakinin koşuludur.",
    intro: [
      "Bir binanın sahadaki karşılığı, proje kararlarının ne kadar uygulanabilir olduğuna bağlıdır. Uygulamayı yalnızca imalat sırası olarak görmüyoruz. Saha düzeni, malzeme akışı, detay kontrolleri ve iş programı aynı planın parçalarıdır ve birinde yapılan bir değişiklik öbürünü etkiler.",
      "Konut, ticari ve karma kullanımlı yapılarda kaba yapıdan ince işlere kadar uygulama kalemlerini bu planla yürütürüz. Kapsam sözleşme öncesinde kalem kalem belirlenir; sahada hangi işin kimin sorumluluğunda olduğu baştan bellidir.",
    ],
    blocks: [
      {
        kind: "list",
        eyebrow: "Hizmetin kapsamı",
        title: "Bu hizmet neleri kapsar?",
        items: [
          "Saha organizasyonu ve uygulama planlaması",
          "Kaba yapı ve ince iş kalemlerinin yürütülmesi",
          "Yapı elemanlarının imalat ve montaj koordinasyonu",
          "Malzeme, detay ve işçilik kontrolleri",
          "İş programı ve süreç takibi",
        ],
      },
      {
        kind: "steps",
        eyebrow: "Uygulama akışı",
        title: "Başlamadan önce, kapanmadan önce kontrol",
        items: [
          { title: "Hazırlık", text: "Proje, keşif ve saha koşulları birlikte değerlendirilir. İmalat sırası ve kritik kalemler iş programına bağlanır." },
          { title: "Sıralı imalat", text: "Beton, donatı, duvar, tesisat geçişi ve ince iş detayları birbirinden bağımsız ele alınmaz. Her kalem, bir öncekinin kabulüyle başlar." },
          { title: "Kapanmadan kontrol", text: "Sonradan görünmeyecek imalatlar kapanmadan ölçülür, kontrol edilir ve kayda geçirilir." },
          { title: "Teslim öncesi liste", text: "Eksik ve kusurlu işler listelenir. Düzeltmeleri tamamlanmadan süreç kapanmış sayılmaz." },
        ],
      },
      {
        kind: "table",
        eyebrow: "Sahada sık görülenler",
        title: "Uygulama sürecinde en çok karşılaşılan sorunlar",
        rows: [
          { title: "Kot ve ölçü farkı", text: "Kalıp, donatı ya da duvar hattında kotların projeden sapması. Kapı, pencere ve tesisat geçişlerini doğrudan etkiler; erken ölçümle düzeltilmesi çok daha kolaydır." },
          { title: "Malzeme uyumsuzluğu", text: "Projede belirtilen ürünle sahaya gelen ürünün farklı olması. Malzeme kabulünde kullanım yeri ve şartname kontrol edilerek önlenir." },
          { title: "Sıra hatası", text: "Bir kalemin hazırlığı tamamlanmadan kapanması. Sonradan açılan kanal ve delikler hem maliyet hem de yapının performansı açısından sorun yaratır." },
          { title: "Plansız değişiklik", text: "Sahada kendiliğinden yapılan değişiklikler, süre ve bütçe etkisi görülmeden kapsamı büyütür. Her değişiklik karar, iş programı güncellemesi ve bütçe etkisiyle birlikte ilerler." },
        ],
      },
      {
        kind: "pair",
        eyebrow: "Kime uygun?",
        title: "Bu hizmet hangi işler için doğru?",
        left: { title: "Uygun olduğu durum", text: "Onaylı uygulama projesi olan ve kaba yapı ile ince işin aynı iş programında yönetilmesini isteyen işverenler." },
        right: { title: "Önce başka bir hizmet", text: "Proje henüz kesinleşmediyse, uygulamadan önce proje geliştirme ve teknik koordinasyon hizmetiyle başlamak daha doğru olur." },
      },
    ],
    faqs: [
      { q: "Projesi hazır olmayan bir işe başlayabilir miyiz?", a: "Keşif ve ön değerlendirmeyle başlayabiliriz. Ancak onaylı uygulama projesi olmadan imalata geçilmez. Eksik proje kalemlerinin hazırlatılması ise işin kapsamında ayrıca belirlenir." },
      { q: "Kaba yapı ve ince işleri aynı kapsamda mı yürütüyorsunuz?", a: "İki aşama da aynı iş programı içinde ele alınabilir. Hangi kalemlerin kapsama gireceği sözleşme öncesinde tek tek belirlenir; kapsam dışında kalan işler de açıkça yazılır." },
      { q: "İş programı sahada nasıl izlenir?", a: "Her imalat kalemi, planlanan tarihi ve bağlı olduğu öncül işle birlikte programa işlenir. Bir gecikme olduğunda nedeni ve etkilediği kalemler iş sahibiyle birlikte görüşülür." },
    ],
    related: ["muhendislik-hizmetleri", "proje-ve-uygulama-sureclerinin-yonetimi"],
    ctaTitle: "Uygulamaya başlamadan önce kapsamı birlikte netleştirelim.",
  },
  {
    n: "02",
    slug: "muhendislik-hizmetleri",
    title: "Mühendislik Hizmetleri",
    note: "Taşıyıcı sistem ve yapı mühendisliği",
    short: "Taşıyıcı sistem ve detay kararlarını hesap varsayımları, yönetmelik gereklilikleri ve sahadaki uygulanabilirlik açısından değerlendiriyoruz.",
    seoTitle: "Mühendislik Hizmetleri ve Yapısal Değerlendirme | Kocaeli — KUK İnşaat",
    seoDescription: "Kocaeli ve çevresinde taşıyıcı sistem yaklaşımı, uygulama detaylarının kontrolü ve yönetmelik uyumu için mühendislik değerlendirmesi.",
    image: "/images/services/02-muhendislik.jpg",
    imageAlt: "Beton dökümü öncesinde kolon–kiriş birleşiminde sık etriyeli donatı kafesi ve paspayı takozları — konsept görseli",
    imageWidth: 1248,
    imageHeight: 832,
    h1: "Taşıyıcı sistem kararlarını sahada doğru okumak",
    heroMeta: ["Taşıyıcı sistem", "Detay kontrolü", "Yönetmelik uyumu"],
    introTitle: "En önemli kararların çoğu görünmez.",
    intro: [
      "Bir yapının güvenliği, çoğu zaman görünmeyen kararlarla belirlenir: taşıyıcı sistemin nasıl kurulduğu, yüklerin nasıl aktarıldığı ve birleşim detaylarının sahada nasıl yapılacağı. Mühendislik hizmetimizde bu kararları yalnızca hesap çıktısı olarak değil, imalat koşulları ve yapının kullanım amacıyla birlikte değerlendiriyoruz.",
      "Amacımız, kâğıt üzerinde doğru görünen bir çözümün sahada da aynı doğrulukla karşılık bulmasını sağlamaktır. Değerlendirmenin sonunda hangi kararın neden önerildiği ve sahada neyin dikkat edilmesi gerektiği iş sahibine açıkça aktarılır.",
    ],
    blocks: [
      {
        kind: "prose",
        eyebrow: "Değerlendirme yöntemi",
        title: "Önce mevcut projeyi okuruz, sonra sahayı",
        paragraphs: [
          "Önce mevcut proje ve hesaplar, yapının kullanım amacı ve taşıyıcı sistem kurgusuyla birlikte okunur. Hesap varsayımlarıyla proje detayları birbirine uyuyor mu, bu ilk adımda kontrol edilir.",
          "Ardından detayların sahada nasıl imal edileceği değerlendirilir. Uygulanması güç ya da belirsiz kalan noktalar imalat öncesinde işaretlenir ve ilgili disiplinle birlikte ele alınır.",
        ],
      },
      {
        kind: "table",
        eyebrow: "Değerlendirme alanları",
        title: "Neye bakıyoruz?",
        rows: [
          { title: "Yük aktarımı", text: "Taşıyıcı elemanlar arasında yük yolunun kesintisiz olması ve birleşim noktalarının bu yükü taşıyacak biçimde tanımlanması." },
          { title: "Hesap ve detay uyumu", text: "Hesapta kabul edilen varsayımların proje detaylarına ve sahadaki malzemeye yansıyıp yansımadığı." },
          { title: "Yönetmelik karşılığı", text: "Yürürlükteki yönetmelik gerekliliklerinin proje kararlarına doğru biçimde yansıtılması." },
          { title: "Uygulama toleransı", text: "Sahada ölçü ve tolerans açısından kritik olan imalatların belirlenmesi ve bu imalatlar için kontrol sırasının tanımlanması." },
        ],
      },
      {
        kind: "list",
        eyebrow: "Ne zaman ihtiyaç duyulur?",
        title: "Mühendislik değerlendirmesi şu durumlarda işe yarar",
        items: [
          "Taşıyıcı sistem yaklaşımının teknik olarak değerlendirilmesi gerektiğinde",
          "Statik hesaplarla ilişkili bir kararın sahada uygulanabilirliği sorulduğunda",
          "Uygulama detaylarının imalat öncesinde gözden geçirilmesi istendiğinde",
          "Performans ve güvenlik açısından riskli görünen noktaların erken görülmek istendiğinde",
        ],
      },
      {
        kind: "pair",
        eyebrow: "Kapsam sınırı",
        title: "Hizmetin ne olduğu ve ne olmadığı",
        left: { title: "Kapsamımızda olanlar", text: "Mevcut proje ve hesapların teknik değerlendirmesi, uygulama detaylarının mühendislik kontrolü ve bu konularda görüş bildirilmesi." },
        right: { title: "Ayrıca belirlenenler", text: "Proje müellifliği hizmeti. Kapsamı, işin niteliğine göre ilk görüşmede ayrıca netleştirilir." },
      },
    ],
    faqs: [
      { q: "Statik projeyi siz mi hazırlıyorsunuz?", a: "Bu hizmet, taşıyıcı sistem ve uygulama detaylarının teknik değerlendirilmesine odaklanır. Proje müellifliği kapsamı, işin niteliğine göre ilk görüşmede ayrıca netleştirilir." },
      { q: "Mevcut statik projemizi inceleyebilir misiniz?", a: "Evet. Mevcut proje ve hesaplar; taşıyıcı sistem yaklaşımı, detay uygulanabilirliği ve diğer disiplinlerle uyum açısından değerlendirilebilir." },
      { q: "Değerlendirmenin sonucunda ne alırız?", a: "Sonuçlar; hangi kararın neden önerildiğini, sahada neyin değişeceğini ve hangi noktanın imalat öncesinde yeniden ele alınması gerektiğini açıklayan bir özet olarak iş sahibine sunulur." },
    ],
    related: ["proje-gelistirme-ve-teknik-koordinasyon", "teknik-danismanlik"],
    ctaTitle: "Taşıyıcı sisteme ilişkin sorunuzu bize anlatın.",
  },
  {
    n: "03",
    slug: "proje-gelistirme-ve-teknik-koordinasyon",
    title: "Proje Geliştirme ve Teknik Koordinasyon",
    note: "Disiplinler arası uyum",
    short: "Mimari, statik, elektrik ve mekanik projeleri uygulama öncesinde karşılaştırıyor, uyumsuzlukları sahaya çıkmadan kapatıyoruz.",
    seoTitle: "Proje Geliştirme ve Teknik Koordinasyon | Kocaeli — KUK İnşaat",
    seoDescription: "Mimari, statik, elektrik ve mekanik projelerin yapım öncesinde karşılaştırılması, çakışmaların giderilmesi ve revizyon takibi. KUK İnşaat, Kocaeli.",
    image: "/images/services/03-koordinasyon.jpg",
    imageAlt: "Koyu taş masa üzerinde üst üste konmuş mimari plan, taşıyıcı aks ve tesisat güzergâhı eskiz kâğıtları; yanında pirinç cetvel ve gönye — konsept görseli",
    imageWidth: 1248,
    imageHeight: 832,
    h1: "Projeleri sahaya çıkmadan tek bir bütün hâline getirmek",
    heroMeta: ["Mimari", "Statik", "Elektrik", "Mekanik"],
    introTitle: "Sorun çoğu zaman sahada değil, projede başlar.",
    intro: [
      "Birçok uygulama sorunu, projelerin birbirini tam tutmadığı noktada başlar. Mimari, statik, elektrik ve mekanik projeler ayrı ekiplerce hazırlandığında kotlar, geçişler ve birleşim noktalarında farklar oluşabilir. Bu fark imalat başlamadan görülürse bir revizyonla çözülür; sahada fark edilirse zaman ve maliyet kaybına dönüşür.",
      "Teknik koordinasyon hizmetimiz, bu projeleri aynı yapının parçaları hâline getirmek için vardır. Projeleri disiplin bazında değil, aynı yapı elemanı üzerinden okuruz: bir kolon, bir şaft ya da bir asma tavan bütün disipliniyle birlikte değerlendirilir.",
    ],
    blocks: [
      {
        kind: "steps",
        eyebrow: "Koordinasyon akışı",
        title: "Her çakışma, sorumlusu ve kapanış koşuluyla kayda geçer",
        items: [
          { title: "Eleman bazında okuma", text: "Projeler, aynı yapı elemanı üzerinden disiplinleriyle birlikte karşılaştırılır." },
          { title: "Uyumsuzluk listesi", text: "Bulunan her çakışma için sorumlu disiplin, çözüm önerisi ve kapanış koşulu belirlenir." },
          { title: "Revizyon takibi", text: "Çözülen her madde ilgili paftaya işlenir. Sahada kullanılan proje sürümünün güncel olup olmadığı kontrol edilir." },
          { title: "Onaydan sonra imalat", text: "Şaft, geçiş ve birleşim gibi kritik detaylar teknik olarak onaylanmadan imalata başlanmaz." },
        ],
      },
      {
        kind: "prose",
        eyebrow: "Kavram netliği",
        title: "Koordinasyon ile proje hazırlamak aynı iş değildir",
        paragraphs: [
          "Koordinasyon, hazırlanan projelerin birbiriyle ve sahayla uyumunu sağlar. Projelerin hazırlanması ya da hazırlatılması ise ayrı bir kapsamdır ve işin durumuna göre ayrıca belirlenir.",
          "Koordinasyonun merkezinde tek bir disiplin yoktur. Mimari kararın statik karşılığı, mekanik güzergâhın mimari etkisi ve elektrik altyapısının uygulama sırası birlikte değerlendirilir.",
        ],
      },
      {
        kind: "pair",
        eyebrow: "Gerekli mi?",
        title: "Koordinasyon hizmeti ne zaman öne çıkar?",
        left: { title: "Gerektiği durumlar", text: "Farklı ekiplerin hazırladığı projeler birleştirildiğinde çakışmalar görülüyorsa, revizyon sayısı artıyorsa ya da sahada “projede yoktu” denilen sorunlar tekrarlanıyorsa." },
        right: { title: "Ayrıca değerlendirilen durumlar", text: "Tek disiplinli ve küçük ölçekli bir yapı ya da projenin tamamının tek bir ekip tarafından hazırlandığı işlerde kapsam ayrıca değerlendirilir." },
      },
      {
        kind: "list",
        eyebrow: "Kapsam",
        title: "Koordinasyonun dokunduğu konular",
        items: [
          "Şaft, geçiş ve tesisat güzergâhlarının taşıyıcı elemanlarla ilişkisi",
          "Kot ve ölçü farklarının birleşim detaylarına etkisi",
          "Cephe, doğrama ve iç mekân detaylarının proje bütünlüğü",
          "Revizyon paftalarının güncelliği ve sürüm takibi",
        ],
      },
    ],
    faqs: [
      { q: "Koordinasyon ile proje hazırlamak aynı şey mi?", a: "Hayır. Koordinasyon, hazırlanan projelerin birbiriyle ve sahayla uyumunu sağlar. Projelerin hazırlanması veya hazırlatılması kapsamı ayrıca belirlenir." },
      { q: "Uygulama başladıktan sonra koordinasyon yapılabilir mi?", a: "Yapılabilir; ancak en verimli zaman imalattan önceki dönemdir. Uygulama başladıysa önce kritik imalatlar ve yaklaşan iş kalemleri üzerinden ilerlenir." },
      { q: "Hangi projelerde koordinasyon hizmeti değer katar?", a: "Birden fazla proje disiplininin birlikte çalıştığı yapılarda; özellikle kat planları sık değişen, tesisat güzergâhı yoğun ya da karma kullanımlı projelerde. Tek disiplinli ve basit bir yapıda kapsamı ayrıca değerlendirmek gerekir." },
    ],
    related: ["muhendislik-hizmetleri", "insaat-ve-yapi-uygulamalari"],
    ctaTitle: "Projelerinizi sahaya çıkmadan birlikte karşılaştıralım.",
  },
  {
    n: "04",
    slug: "proje-ve-uygulama-sureclerinin-yonetimi",
    title: "Proje ve Uygulama Süreçlerinin Yönetimi",
    note: "Süre, bütçe ve kalite takibi",
    short: "İş programı, bütçe ve kalite kontrol noktalarını tek bir takip düzeninde yönetiyor, ilerlemeyi iş sahibiyle düzenli paylaşıyoruz.",
    seoTitle: "Proje ve Uygulama Süreçlerinin Yönetimi | İzmit ve Başiskele — KUK İnşaat",
    seoDescription: "İzmit, Başiskele ve Kocaeli genelinde iş programı, bütçe takibi, kalite kontrol noktaları ve değişiklik yönetimi hizmetleri.",
    image: "/images/services/04-surec.jpg",
    imageAlt: "Kuş bakışı düzenli bir şantiye: kolon aksları ve donatı hasırları serilmiş döşeme, bölgelere ayrılmış malzeme istifleri ve kule vinç — konsept görseli",
    imageWidth: 1248,
    imageHeight: 832,
    h1: "İş programını, bütçeyi ve kaliteyi tek bir düzende izlemek",
    heroMeta: ["İş programı", "Bütçe takibi", "Kalite kontrolü"],
    introTitle: "Küçük gecikmeler birikmeden görünür olmalı.",
    intro: [
      "Bir inşaat işinde sorunların çoğu tek bir büyük hatadan değil, küçük gecikmelerin ve belirsiz kararların birikmesinden doğar. Süreç yönetiminde iş programını, bütçe takibini ve kalite kontrol noktalarını ayrı ayrı değil, birbirini etkileyen tek bir düzen içinde izleriz.",
      "Böylece bir gecikmenin maliyete, bir değişikliğin teslim tarihine etkisi oluştuğu anda görülür. Bu hizmet, işi kimin yürüttüğünden bağımsız olarak iş sahibinin işin nerede olduğunu bilmesini sağlar.",
    ],
    blocks: [
      {
        kind: "list",
        eyebrow: "Bu hizmet kimin işine yarar?",
        title: "Hangi ihtiyaçlara cevap verir?",
        items: [
          "Süresi kesinleşmiş ama ilerlemesi belirsiz bir iş",
          "Bütçe sapmalarının erken görülmesini isteyen iş sahipleri",
          "Birden fazla yüklenicinin çalıştığı ve arayüzlerinin yönetilmesi gereken işler",
          "Değişiklik taleplerinin kontrollü ilerlemesini isteyen projeler",
        ],
      },
      {
        kind: "table",
        eyebrow: "Takip başlıkları",
        title: "Düzenli olarak neyi izliyoruz?",
        rows: [
          { title: "İş programı", text: "Kritik yol üzerindeki imalatlar, aralarındaki bağımlılıklar ve bir gecikmenin teslim tarihine etkisi." },
          { title: "Bütçe", text: "Hakediş ile gerçekleşen imalat arasındaki ilişki ve bütçe kalemlerinin ne kadarının tamamlandığı." },
          { title: "Kalite", text: "Kalite kontrol noktalarının kapanış kriterleri ve hâlâ açık kalan kayıtlar." },
          { title: "Değişiklik", text: "Her değişiklik talebinin teknik gerekçesi, süre ve bütçe etkisi ile onay durumu." },
        ],
      },
      {
        kind: "steps",
        eyebrow: "Yönetim döngüsü",
        title: "Başlangıçtan bilgilendirmeye",
        items: [
          { title: "Başlangıç", text: "İş programı, bütçe planı ve kalite kontrol noktaları birlikte tanımlanır. Takip bu üçlü üzerinden yürür." },
          { title: "Ölçüm", text: "Planlanan iş ile gerçekleşen iş karşılaştırılarak ilerleme izlenir." },
          { title: "Sapma yönetimi", text: "Sapmanın nedeni ve telafi yolu ayrıca ele alınır. Gerekirse iş programı güncellenir." },
          { title: "Bilgilendirme", text: "İlerleme, gecikme ve değişiklikler nedenleriyle birlikte iş sahibine düzenli aralıklarla aktarılır. Aralık, işin ölçeğine göre başta belirlenir." },
        ],
      },
      {
        kind: "pair",
        eyebrow: "Karar ve bağımsızlık",
        title: "Kimin kararı, kimin sorumluluğu?",
        left: { title: "Karar", text: "Değişiklik kararları iş sahibiyle birlikte verilir. Biz, kararın teknik gerekçesini ile süre ve bütçe etkisini hazırlarız." },
        right: { title: "Bağımsız takip", text: "Süreç yönetimi, işi hangi yüklenicinin yürüttüğünden bağımsız biçimde iş sahibi adına izlenebilir." },
      },
    ],
    faqs: [
      { q: "Bütçe takibi hangi aralıklarla paylaşılır?", a: "Aralık, işin ölçeğine göre başlangıçta belirlenir. Esas olan, gerçekleşen imalat ile bütçe arasındaki farkın dönem sonunda değil, oluştuğu sırada görülmesidir." },
      { q: "Kendi yüklenicimiz çalışırken süreç yönetimi alabilir miyiz?", a: "Evet. Bu hizmet iş sahibi adına yürütülür. Mevcut yüklenicinin iş programı, ilerleme ve kalite kontrolleri bağımsız bir düzen içinde izlenebilir." },
      { q: "Bu hizmet hangi işlerde gerekir?", a: "Süresi ve bütçesi sıkı olan, birden fazla yüklenicinin aynı sahada çalıştığı ya da değişiklik talebinin sık geldiği işlerde en çok değer katar." },
    ],
    related: ["insaat-ve-yapi-uygulamalari", "teknik-danismanlik"],
    ctaTitle: "Devam eden ya da planlanan işinizin takvimini konuşalım.",
  },
  {
    n: "05",
    slug: "teknik-danismanlik",
    title: "Teknik Danışmanlık",
    note: "Bağımsız teknik değerlendirme",
    short: "Yatırım kararı öncesinde ya da devam eden bir işte proje ve uygulama kararlarını bağımsız bir gözle değerlendiriyoruz.",
    seoTitle: "İnşaat ve Proje Teknik Danışmanlık Hizmeti | Kocaeli — KUK İnşaat",
    seoDescription: "Yatırım öncesi teknik yapılabilirlik, mevcut proje incelemesi ve devam eden yapı işlerinde bağımsız teknik risk değerlendirmesi. KUK İnşaat, Kocaeli.",
    image: "/images/services/05-danismanlik.jpg",
    imageAlt: "Kaba yapısı tamamlanmış betonarme katta sehpa üzerinde ölçüm cihazı, kolona yaslanmış su terazisi ve pafta rulosu — konsept görseli",
    imageWidth: 1248,
    imageHeight: 832,
    h1: "Büyük kararlardan önce bağımsız teknik değerlendirme",
    heroMeta: ["Yatırım öncesi", "Devam eden iş", "Alternatif analizi"],
    introTitle: "Karar vermeden önce neyin bilinmesi gerektiği netleşir.",
    intro: [
      "Bazen ihtiyaç yeni bir uygulama başlatmak değil, elindeki projeyi doğru okumaktır. Teknik danışmanlık; yatırım kararı öncesinde, proje aşamasında ya da devam eden bir uygulamada kararların teknik karşılığını netleştirmek için kullanılır.",
      "Kapsam işin aşamasına göre belirlenir. Kimi zaman tek bir proje incelemesi yeterli olur, kimi zaman bir uygulama yönteminin alternatifleriyle karşılaştırılması gerekir. Danışmanlık, karar vermek için değil, kararın dayanağını görünür kılmak için yapılır.",
    ],
    blocks: [
      {
        kind: "prose",
        eyebrow: "Ne zaman?",
        title: "Danışmanlık hangi anlarda işe yarar?",
        paragraphs: [
          "Bir arsa ya da proje için yatırım kararı vermeden önce teknik yapılabilirliğin bilinmesi gerektiğinde danışmanlık yararlıdır. Devam eden bir işte ise bir sorunun süresini, maliyetini ve riskini öngörmek istediğinizde.",
          "Danışman olarak kararı biz vermeyiz. Bulgularımızı seçeneklerin teknik ve uygulama sonuçlarıyla birlikte sunarız; karar sizde kalır.",
        ],
      },
      {
        kind: "list",
        eyebrow: "Tipik başlıklar",
        title: "Sık karşılaşılan danışmanlık ihtiyaçları",
        items: [
          "Yatırım öncesinde teknik yapılabilirliğin görülmesi",
          "Mevcut projenin uygulanabilirliği hakkında bağımsız bir değerlendirme",
          "Devam eden işte teknik risklerin erken belirlenmesi",
          "Alternatif uygulama yöntemleri arasında süre ve maliyet karşılaştırması",
        ],
      },
      {
        kind: "steps",
        eyebrow: "Çalışma akışı",
        title: "Üç adımda, karara dayanak",
        items: [
          { title: "Soruyu netleştirmek", text: "Karar verilmek istenen konu belirlenir. Kapsam bu soruya göre sınırlanır." },
          { title: "İncelemek", text: "Mevcut proje, hesap ve saha bilgileri incelenir. Varsayımlar ile doğrulanmış bilgiler birbirinden ayrılır." },
          { title: "Sunmak", text: "Bulgular, seçeneklerin teknik ve uygulama sonuçlarıyla birlikte iş sahibine sunulur." },
        ],
      },
      {
        kind: "pair",
        eyebrow: "Tarafsızlık",
        title: "Danışmanın sınırı nerede başlar?",
        left: { title: "Bağımsız görüş", text: "Değerlendirme iş sahibi adına yapılır; uygulama yüklenicisinin ya da proje ekibinin görüşüne bağlı kalmaz." },
        right: { title: "Uygulama ayrımı", text: "Danışmanlık uygulamanın yerine geçmez. Bulgular, uygulamayı kimin yaptığından bağımsız olarak iş sahibine sunulur." },
      },
    ],
    faqs: [
      { q: "Danışmanlık tek seferlik olabilir mi?", a: "Olabilir. Kapsam tek bir teknik soruya göre tanımlanabilir. Devam eden işlerde ise periyodik değerlendirme olarak yürütülebilir." },
      { q: "Devam eden işimizde başka bir yüklenici çalışırken danışmanlık alabilir miyiz?", a: "Evet. Değerlendirme iş sahibi adına yapılır; mevcut uygulama ve proje kararları bağımsız biçimde incelenir." },
      { q: "Danışmanlıktan sonra uygulamayı da siz mi yapıyorsunuz?", a: "Danışmanlık ve uygulama ayrı hizmetlerdir. Bulgular, uygulamayı kimin yaptığından bağımsız olarak iş sahibine sunulur. Aynı işte iki hizmetin birlikte alınıp alınmayacağı ilk görüşmede değerlendirilir." },
    ],
    related: ["muhendislik-hizmetleri", "proje-ve-uygulama-sureclerinin-yonetimi"],
    ctaTitle: "Karar vermeden önce doğru soruları birlikte belirleyelim.",
  },
];

export const serviceBySlug = (slug?: string) => services.find((item) => item.slug === slug);
