/* KUK İnşaat genel içerik modeli. Hizmet içerikleri services.ts dosyasındadır.
   Doğrulanmamış hizmet, referans, rakam ve proje bilgisi bu dosyaya eklenmez.
   Portföy kayıtları yayımlanmaya hazır olduğunda projects dizisine eklenir. */

export type Project = {
  slug: string;
  index: string;
  name: string;
  shortName: string;
  category: string;
  location: string;
  year: string;
  status: string;
  area: string;
  duration: string;
  scope: string;
  image: string;
  gallery: string[];
  summary: string;
  description: string;
  challenge: string;
  solution: string;
  stats: { value: string; label: string }[];
  services: string[];
};

export const projects: Project[] = [];

export const projectTypes = ["Konut Yapıları", "Ticari Yapılar", "Karma Kullanım", "Diğer"] as const;

export const serviceTags = ["İnşaat & Uygulama", "Mühendislik", "Teknik Koordinasyon", "Süreç Yönetimi", "Danışmanlık"];

import { PLATES } from "./assets/plates";

export const phases = [
  {
    number: "01",
    label: "GÖRÜŞME + KEŞİF",
    short: "Görüşme ve Keşif",
    title: "Önce işi ve sahayı anlamak",
    text: "İhtiyacı dinler, arsayı, mevcut yapıyı ve proje koşullarını yerinde inceleriz. Bu aşamanın çıktısı, işin hangi kapsamda ele alınabileceğine dair açık bir çerçevedir.",
    image: PLATES.courtyard,
  },
  {
    number: "02",
    label: "DEĞERLENDİRME",
    short: "Değerlendirme",
    title: "Yapılabilirlik, bütçe ve risk aynı masada",
    text: "İşin yapılabilirliğini, yaklaşık bütçe aralığını ve teknik riskleri birlikte ele alırız. Belirsiz kalan konular varsayımla kapatılmaz; neyin, ne zaman netleşeceği baştan bellidir.",
    image: PLATES.materials,
  },
  {
    number: "03",
    label: "PROJELENDİRME",
    short: "Projelendirme",
    title: "Disiplinler sahaya çıkmadan uyumlanır",
    text: "Mimari, statik, elektrik ve mekanik projelerin hazırlanmasını koordine eder, birbirleriyle uyumunu kontrol ederiz. Amaç, sahada revizyonla zaman kaybetmemektir.",
    image: PLATES.atrium,
  },
  {
    number: "04",
    label: "UYGULAMA",
    short: "Uygulama",
    title: "İş programına bağlı, kontrollü imalat",
    text: "İnşaatı iş programına göre yürütür; her imalatı proje ve şartnameye uygunluk açısından aşama aşama kontrol ederiz. İlerleme ve değişiklikler iş sahibiyle düzenli olarak paylaşılır.",
    image: PLATES.facade,
  },
  {
    number: "05",
    label: "TESLİM",
    short: "Teslim",
    title: "Teslim, ilişkinin bittiği nokta değildir",
    text: "Eksik ve kusurlu işler kapatılarak yapı teslim edilir. Teslim sonrasında garanti ve bakım konularında muhatap aynı ekiptir.",
    image: PLATES.horizon,
  },
];

export const principles = [
  { n: "01", title: "Teknik Değerlendirme", text: "Her karar; hesap, proje ve saha koşulu birlikte okunarak alınır." },
  { n: "02", title: "Disiplin Uyumu", text: "Mimari, statik, elektrik ve mekanik kararlar birbirinden bağımsız değerlendirilmez." },
  { n: "03", title: "Uygulama Kontrolü", text: "Kapanacak her imalat, kapanmadan önce kontrol edilir ve kayda geçirilir." },
  { n: "04", title: "Açık Süreç Bilgisi", text: "İlerleme, gecikme ve değişiklikler nedenleriyle birlikte iş sahibine iletilir." },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Hangi tür yapılarla çalışıyorsunuz?",
    a: "Konut, ticari ve karma kullanımlı yapıların projelendirme ve inşaat süreçlerini yürütüyoruz. İşin ölçeği kadar proje olgunluğu ve uygulama koşulları da kapsamı belirler; bu yüzden her iş önce keşif ve değerlendirmeyle başlar.",
  },
  {
    q: "Projenin hangi aşamasında devreye girebilirsiniz?",
    a: "Fikir aşamasından teslim sonrasına kadar her aşamada. Erken katılım, proje kararlarının sahada karşılık bulmasını kolaylaştırır. Devam eden bir işte ise önce mevcut durumun teknik değerlendirmesi yapılır.",
  },
  {
    q: "Mevcut mimari ve statik projelerimizi inceleyebilir misiniz?",
    a: "Evet. Projeleri taşıyıcı sistem yaklaşımı, detay uygulanabilirliği ve diğer disiplinlerle uyum açısından gözden geçiriyoruz. Bulunan uyumsuzluklar imalat öncesinde ilgili disiplinlerle ele alınır.",
  },
  {
    q: "İnşaat uygulamasının kapsamı nasıl belirleniyor?",
    a: "Kapsam sözleşme öncesinde kalem kalem belirlenir. Saha organizasyonu, kaba yapı ve ince işler, imalat ve montaj koordinasyonu ile malzeme ve detay kontrolleri bu kapsamın parçalarıdır.",
  },
  {
    q: "Teknik koordinasyonu nasıl sağlıyorsunuz?",
    a: "Mimari, statik, elektrik ve mekanik projeleri aynı yapı elemanı üzerinden karşılaştırıyoruz. Uyumsuzluklar listelenir; her biri için çözüm ve kapanış koşulu belirlenmeden ilgili imalata başlanmaz.",
  },
  {
    q: "Bütçe ve iş programı nasıl takip ediliyor?",
    a: "Başlangıçta iş programı ve bütçe planı birlikte tanımlanır. İlerleme, planlanan ile gerçekleşen karşılaştırılarak izlenir. Değişiklik gerektiğinde süre ve maliyet etkisi iş sahibiyle birlikte değerlendirilir.",
  },
  {
    q: "Hangi bölgelerde çalışıyorsunuz?",
    a: "Merkezimiz Başiskele'de. Kocaeli genelinde ve çevresinde çalışıyoruz. İlçe ve iş kapsamına göre değerlendirme ilk görüşmede netleşir.",
  },
  {
    q: "İlk görüşmede hangi bilgiler gerekiyor?",
    a: "Arsanın ya da mevcut yapının konumu, düşünülen yapı türü ve yaklaşık büyüklük başlangıç için yeterlidir. Varsa mevcut proje, imar durumu ve hedef tarih değerlendirmeyi hızlandırır.",
  },
  {
    q: "Mimari ve statik projeleri siz mi hazırlıyorsunuz?",
    a: "Projelerin hazırlanmasını koordine eder, teknik açıdan gözden geçiririz. Doğrudan proje müellifliği hizmeti, işin kapsamına göre ilk görüşmede ayrıca netleştirilir.",
  },
  {
    q: "Uygulama sırasında değişiklik gerekirse ne olur?",
    a: "Önce değişikliğin teknik gerekliliği, ardından süre ve bütçeye etkisi değerlendirilir. Karar iş sahibiyle birlikte verilir ve iş programına işlenir. Sahada kendiliğinden büyüyen bir kapsam oluşmaz.",
  },
];
