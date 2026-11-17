# KUK İnşaat — Cloudflare Pages yayını

Vite + React tek sayfa uygulaması. Pages Functions veya Worker gerekmez.

## Pages ayarları

- Framework preset: Vite (veya aşağıdaki ayarlarla "None").
- Root directory: depo kökü (`.`).
- Kurulum: `npm ci`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 20.19+ veya 22 (Vite 7 gereği). Denetim Node 20.20.2 ile yapıldı.
- Production branch: bu dosyaları içeren dal.

`dist/index.html` istemci kodunu, stilleri ve görselleri içerir (vite-plugin-singlefile).
`dist/favicon.svg`, `dist/og-cover.jpg`, `dist/robots.txt` ve `dist/sitemap.xml` yanında yayımlanır.

## Yönlendirme

Depoda bilerek üst düzey `404.html` veya joker `_redirects` yoktur: Cloudflare Pages bu durumda
derin bağlantılar için uygulama kabuğunu sunar; React Router doğru sayfayı ya da uygulama içi
"bulunamadı" ekranını (noindex) çizer. `/* /index.html 200` yönlendirmesi Pages'te geçersizdir.
Bilinen sınır: var olmayan adresler HTTP 200 döner (SPA); gerçek 404 durum kodu için Functions gerekir.

Yerel doğrulama: `npx wrangler pages dev dist` — tüm rotalar doğrudan ve yenilemede açılır.

## Ortam değişkenleri (isteğe bağlı, derleme zamanı)

| Değişken | Varsayılan | Açıklama |
| --- | --- | --- |
| `VITE_SITE_URL` | `https://kukinsaat.com` | Canonical / Open Graph kök adresi |
| `VITE_EMAILJS_SERVICE_ID` | `service_vbcjk3d` | EmailJS servis kimliği |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_hitg8vm` | EmailJS şablon kimliği |
| `VITE_EMAILJS_PUBLIC_KEY` | koddaki açık anahtar | EmailJS public key (gizli anahtar frontend'e konmaz) |
| `VITE_CONTACT_TO_EMAIL` | `umut@kukinsaat.com` | Form alıcısı |
| `VITE_PAGE_IMAGES` | (boş = gömülü) | `local` yapılırsa iç sayfa görselleri dosyadan okunur (aşağıya bakın) |

## İç sayfa görselleri: iki mod

Kurumsal, Hizmetlerimiz, hizmet detayları ve İletişim sayfalarındaki yedi özgün konsept görseli:

1. **Varsayılan — gömülü (1280px WebP).** Görseller `index.html` içindedir; eksik dosya, tek dosya
   önizleme ya da dış CDN kaynaklı kırılma olmaz. Bedeli: `index.html` ≈ 1,86 MB (sıkıştırılmış ≈ 1,08 MB).
2. **`VITE_PAGE_IMAGES=local` — dosyadan.** `public/images/pages/` altında şu yedi dosya bulunmalıdır
   (özgün depoda mevcut): `contact-colonnade.jpg`, `corporate-studio-clean.jpg`,
   `engineering-structure.jpg`, `projects-courtyard.jpg`, `services-pavilion.jpg`,
   `typology-commercial.jpg`, `typology-mixed.jpg`. `index.html` ≈ 0,96 MB (sıkıştırılmış ≈ 0,41 MB) olur.
   Dosyalar depoda yoksa bu modu açmayın; görseller kırılır.

Lighthouse mobil (laboratuvar, yavaş 4G benzetimi) — Hizmetlerimiz: gömülü Performans 50 / FCP 8,8 sn,
yerel dosya Performans 60 / FCP 5,8 sn. Masaüstü (gömülü): Performans 83 / LCP 1,8 sn.

## Hizmet görselleri

Hizmetlerimiz sayfası ve beş hizmet detay sayfası, `public/images/services/` altındaki beş konsept
görselini kullanır (`01-uygulama.jpg` … `05-danismanlik.jpg`). Bu dosyalar gömülü değildir; derlemede
`dist/images/services/` altına kopyalanır ve siteyle birlikte yayımlanmalıdır. Dosya eksikse sayfa
bozulmaz: görsel alanı koyu zemin olarak kalır.

## Open Graph görseli

`index.html` ve `src/seo.ts` `https://kukinsaat.com/og-cover.jpg` adresini kullanır (1200×630).
Dosya `public/og-cover.jpg` olarak depoda bulunmalıdır; `public/og-cover.svg` aynı kapağın vektör kaynağıdır.

## Çerez rızası ve Google Analytics

GA4 (`G-EFGSKFKXBM`) yalnızca ziyaretçi "performans / analiz" çerezlerine onay verdiğinde yüklenir
(`src/consent.ts`). Onay verilmeden gtag.js istenmez; ziyaret sayıları yalnızca onay verenleri kapsar.

## EmailJS

Form, `src/config/emailjs.ts` içindeki kimliklerle doğrudan EmailJS REST uç noktasına gönderir.
Yayından sonra EmailJS panelinde üretim alan adının (kukinsaat.com) izinli olduğunu doğrulayın ve
bir kez gerçek test mesajı gönderin.

## Doğru sürümü yayımlamak

Yerelde derlemek canlı siteyi güncellemez. Dosyaları Pages projesine bağlı depoya gönderin ya da:

```sh
npm ci
npm run build
npx wrangler pages deploy dist --project-name <MEVCUT_PAGES_PROJE_ADI>
```
