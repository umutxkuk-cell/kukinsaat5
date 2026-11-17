import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Mail, Phone } from "lucide-react";
import { COMPANY } from "../company";
import { MassModel, type ModelKind } from "../projects/models";
import { SitePlan } from "../projects/drawings";
import { Eyebrow, HOME_IMAGES, MaskedWords } from "./parts";
import "./home.css";
import "../signature/signature.css";
import "../projects/projects.css";

/* ANA SAYFA — iç sayfalarla (Kurumsal · Hizmetlerimiz · Projelerimiz) aynı panel dili:
   koyu obsidyen açılış bölümü + kartlar, açık zeminde sgi düzenleri, koyu kapanış.
   Hero ve Header bileşenlerine dokunulmaz; tüm data-sig animasyon kancaları (words/rise/
   stagger/curtain) ve etkileşimler (hizmet sahnesi geçişleri) aynen korunur. */

type CapabilityEntry = {
  n: string;
  slug: string;
  title: string;
  summary: string;
  caption: string;
  image: string;
  alt: string;
};

const capabilities: CapabilityEntry[] = [
  {
    n: "01",
    slug: "insaat-ve-yapi-uygulamalari",
    title: "İnşaat ve Yapı Uygulamaları",
    summary: "Onaylı projeleri, kaba yapıdan ince işçiliğe kadar planlı bir şantiye düzeniyle hayata geçiriyoruz.",
    caption: "Konut, ticari ve karma kullanımlı yapılar",
    image: HOME_IMAGES.capability01,
    alt: "Sıcak kireçtaşı geçitten sakin bir iç avluya ve koyu bronz doğramalı cam galeriye bakış — mimari konsept görseli",
  },
  {
    n: "02",
    slug: "muhendislik-hizmetleri",
    title: "Mühendislik Hizmetleri",
    summary: "Taşıyıcı sistem ve uygulama kararlarını, yapı güvenliği ile sahadaki uygulanabilirlik dengesinde değerlendiriyoruz.",
    caption: "Yapısal değerlendirme ve detay bütünlüğü",
    image: HOME_IMAGES.capability02,
    alt: "Brüt beton yüzeyde akşamüstü yan ışığıyla belirginleşen kalıp dokusu ve derz ritmi — mimari konsept görseli",
  },
  {
    n: "03",
    slug: "proje-gelistirme-ve-teknik-koordinasyon",
    title: "Proje Geliştirme ve Teknik Koordinasyon",
    summary: "Mimari ve mühendislik disiplinlerini uygulama başlamadan ortak bir dilde buluşturuyoruz.",
    caption: "Disiplinler arası tam uyum",
    image: HOME_IMAGES.capability03,
    alt: "Doğal tepe ışığı alan çift kat yüksekliğinde kireçtaşı ve meşe detaylı iç mekân — mimari konsept görseli",
  },
  {
    n: "04",
    slug: "proje-ve-uygulama-sureclerinin-yonetimi",
    title: "Proje ve Uygulama Süreçlerinin Yönetimi",
    summary: "Takvim, bütçe ve kalite adımlarını işveren adına şeffaf bir düzende izliyor ve yönetiyoruz.",
    caption: "Süre, bütçe ve nitelik takibi",
    image: HOME_IMAGES.capability04,
    alt: "Altın saat ışığında traverten dikey cephe kayıtları ve koyu bronz doğramalar — mimari konsept görseli",
  },
  {
    n: "05",
    slug: "teknik-danismanlik",
    title: "Teknik Danışmanlık",
    summary: "Yatırım veya uygulama kararları öncesinde bağımsız ve net teknik değerlendirme sunuyoruz.",
    caption: "Karar öncesi bağımsız bakış",
    image: HOME_IMAGES.capability05,
    alt: "Kireçtaşı yüzey üzerinde doğal ışıkla aydınlanan beton, çelik, meşe ve cam malzeme etüdü — mimari konsept görseli",
  },
];

const approachChapters = [
  {
    n: "01",
    title: "İhtiyacı Doğru Anlamak",
    text: "Arsanın koşullarını, beklentiyi ve bütçe çerçevesini işe başlamadan yerinde değerlendiririz. Belirsizlikleri varsayımla geçiştirmek yerine ilk günden netleştiririz.",
  },
  {
    n: "02",
    title: "Tasarım ve Uygulamayı Uyumlamak",
    text: "Mimari kararların sahada değer kaybetmemesi için tüm disiplinleri yapım öncesinde ortak bir zeminde buluştururuz. Doğru hazırlık, uygulama sürecini sakin ve öngörülebilir kılar.",
  },
  {
    n: "03",
    title: "Koordineli Yürütmek ve Teslim Etmek",
    text: "Takvimi, bütçeyi ve işçilik kalitesini aynı düzende takip eder; işvereni her aşamada açık biçimde bilgilendiririz. Süreci her detayı kontrol edilmiş bir teslimle tamamlarız.",
  },
];

const workAreas: { n: string; kind: ModelKind; tag: string; title: string; summary: string }[] = [
  {
    n: "01",
    kind: "konut",
    tag: "KONUT YAPILARI",
    title: "Konut Yapıları",
    summary: "Müstakil konutlardan çok katlı yapılara kadar; mahremiyet ve cephe-iç mekân sürekliliği taşıyıcı sistemle birlikte ele alınır.",
  },
  {
    n: "02",
    kind: "ticari",
    tag: "TİCARİ YAPILAR",
    title: "Ticari Yapılar",
    summary: "İşletme dayanımı ve açılış takvimi yatırımın parçasıdır; mekanik ve elektrik altyapısı taşıyıcı sistemle çakışmadan çözülür.",
  },
  {
    n: "03",
    kind: "karma",
    tag: "KARMA KULLANIM",
    title: "Karma Kullanımlı Yapılar",
    summary: "Ticari ve yaşam alanlarını aynı yapıda buluşturan projelerde giriş, şaft ve akustik sınırları yapım öncesinde netleştiririz.",
  },
];

/* BÖLÜM 01 — MARKA AÇILIŞI (koyu, iç sayfa kahramanlarıyla aynı grid) */
export function BrandStatement() {
  return (
    <section className="prj-hero sgi-theme-obsidian hm-statement">
      <div className="prj-hero__inner">
        <div className="prj-hud" data-sig="rise">
          <Eyebrow index="01">KUK İNŞAAT</Eyebrow>
          <span className="prj-coord">
            <i aria-hidden="true" />
            BAŞİSKELE · KOCAELİ
          </span>
        </div>

        <div className="prj-hero__grid">
          <div className="prj-hero__lead">
            <h2 className="prj-hero__title" data-sig="words">
              <MaskedWords text="İyi bir yapı, doğru kararların sessizce bir araya gelmesiyle kurulur." />
            </h2>
          </div>
          <div className="prj-hero__sub" data-sig="rise">
            <p>
              KUK İnşaat; Kocaeli ve çevresinde mimari duyarlılığı mühendislik disipliniyle bir araya getiren bir
              uygulama ve proje firmasıdır. İlk değerlendirmeden anahtar teslime kadar her süreci tek bir standart
              ve açık sorumlulukla yürütürüz.
            </p>
            <Link className="prj-link" to="/kurumsal">
              <span>Kurumsal Yaklaşımımız</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* BÖLÜM 02 — HİZMET ALANLARI (açık zeminde: yapışkan sahne + satırlar, Kurumsal düzeniyle aynı) */
export function CapabilitiesSection() {
  const [active, setActive] = useState(0);
  const current = capabilities[active];

  return (
    <section className="sgi-section sgi-theme-limestone" id="hizmetler">
      <div className="sgi-container">
        <div className="sgi-header-split">
          <div>
            <Eyebrow index="02">HİZMET ALANLARI</Eyebrow>
            <h2 className="sgi-h2" data-sig="words">
              <MaskedWords text="Beş uzmanlık, tek bir bütün." />
            </h2>
          </div>
          <div className="sgi-header-split__aside" data-sig="rise">
            <p className="sgi-prose">
              İhtiyacınız projenin tek bir aşamasında da olabilir, tamamında da. Kapsamı baştan netleştirir, süreci
              aynı özenle yönetiriz.
            </p>
            <Link className="sgi-link" to="/hizmetlerimiz">
              <span>Tüm Hizmetlerimiz</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        <div className="sgi-interactive-grid">
          <div className="sgi-stage-col">
            <div className="sgi-stage-frame" data-sig="curtain">
              {capabilities.map((item, index) => (
                <figure
                  key={item.slug}
                  className={`sgi-stage-slide${active === index ? " is-active" : ""}`}
                  aria-hidden={active !== index}
                >
                  <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                </figure>
              ))}
              <div className="sgi-stage-shade" aria-hidden="true" />
              <div className="sgi-stage-caption" aria-live="polite">
                <span>
                  {current.n} / 05 · MİMARİ KONSEPT
                </span>
                <strong>{current.caption}</strong>
              </div>
            </div>
          </div>

          <ol className="sgi-rows-col" data-sig="stagger">
            {capabilities.map((item, index) => {
              const isCurrent = active === index;
              return (
                <li key={item.slug}>
                  <Link
                    to={`/hizmetlerimiz/${item.slug}`}
                    className={`sgi-row${isCurrent ? " is-active" : ""}`}
                    aria-label={`${item.title} hizmet sayfasını incele`}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                  >
                    <span className="sgi-row__index">{item.n}</span>
                    <div className="sgi-row__content">
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </div>
                    <span className="sgi-row__icon" aria-hidden="true">
                      <ArrowUpRight size={16} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* BÖLÜM 03 — ÇALIŞMA ALANLARI (koyu zeminde üçlü kütle modeli panosu, Projelerimiz'le aynı) */
export function ArchitecturalExperience() {
  return (
    <section className="prj-hero sgi-theme-obsidian hm-areas">
      <div className="prj-hero__inner">
        <div className="sgi-header-split" style={{ marginTop: 10 }}>
          <div>
            <Eyebrow index="03">ÇALIŞMA ALANLARIMIZ</Eyebrow>
            <h2 className="sgi-h2" data-sig="words">
              <MaskedWords text="Üç yapı ölçeğinde uygulama odağımız." />
            </h2>
          </div>
          <div className="sgi-header-split__aside" data-sig="rise">
            <p className="sgi-prose">
              Başiskele, İzmit ve Kocaeli genelinde üstlendiğimiz her yapı türü, kendine özgü bir koordinasyon ve
              detay disipliniyle yürütülür.
            </p>
            <Link className="prj-link" to="/projelerimiz">
              <span>Projelerimiz Sayfası</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="prj-trio">
          {workAreas.map((area) => (
            <Link key={area.n} to="/projelerimiz" className="prj-panel hm-area" data-sig="rise">
              <figure className="prj-panel__model">
                <MassModel kind={area.kind} />
                <figcaption>
                  <span>Şematik model</span>
                  <span>Ölçeksiz</span>
                </figcaption>
              </figure>
              <div className="prj-panel__body">
                <Eyebrow index={area.n}>{area.tag}</Eyebrow>
                <h2 className="prj-panel__title">{area.title}</h2>
                <p className="prj-panel__text">{area.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* BÖLÜM 04 — ÇALIŞMA YAKLAŞIMI (açık zemin, Kurumsal bölümleriyle aynı liste düzeni) */
export function ApproachSection() {
  return (
    <section className="sgi-section sgi-theme-ivory" id="yaklasim">
      <div className="sgi-container sgi-sticky-chapters">
        <div className="sgi-sticky-chapters__lead">
          <Eyebrow index="04">ÇALIŞMA YAKLAŞIMIMIZ</Eyebrow>
          <h2 className="sgi-h2" data-sig="words">
            <MaskedWords text="Karmaşıklığı sadeleştiren bir düzen." />
          </h2>
          <p className="sgi-prose" data-sig="rise">
            Her iş, kapsamın açıkça konuşulmasıyla başlar ve teslim sonrasına kadar aynı özenle ilerler.
          </p>
        </div>

        <ol className="sgi-sticky-chapters__list" data-sig="stagger">
          {approachChapters.map((chapter) => (
            <li key={chapter.n} className="sgi-chapter-item">
              <div className="sgi-chapter-item__head">
                <span>{chapter.n}</span>
                <h3>{chapter.title}</h3>
              </div>
              <p>{chapter.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* BÖLÜM 05 — SEÇİLİ İŞLER / PORTFÖY (vaziyet planı + anlatı, iç sayfa monografisiyle aynı) */
export function SelectedWorks() {
  return (
    <section className="sgi-section sgi-theme-limestone">
      <div className="sgi-container">
        <div className="sgi-monograph">
          <Link
            to="/projelerimiz"
            className="sgi-monograph__visual"
            aria-label="Projelerimiz ve portföy yaklaşımımız sayfasına git"
            data-sig="curtain"
            data-cursor="view"
            data-cursor-label="PORTFÖY ↗"
          >
            {/* Yayımlanmış proje yokken yapı fotoğrafı gösterilmez; şematik vaziyet planı kullanılır. */}
            <figure className="sgi-monograph__figure hm-plan">
              <SitePlan dark />
              <figcaption className="pj-sheet__cap">
                <span>Şematik vaziyet planı · Ölçeksiz</span>
                <span>Konut · Ticari · Karma</span>
              </figcaption>
            </figure>
          </Link>

          <div className="sgi-monograph__narrative">
            <Eyebrow index="05">SEÇİLİ İŞLER VE PORTFÖY</Eyebrow>
            <h2 className="sgi-h2" data-sig="words">
              <MaskedWords text="Yalnızca doğrulanmış yapılar." />
            </h2>
            <p className="sgi-prose" data-sig="rise">
              Tamamlanmamış ya da bilgileri teyit edilmemiş hiçbir çalışmayı referans olarak göstermiyoruz.
              Yayımlanan her proje kaydı, gerçek konum ve kapsam bilgisiyle portföy sayfamızda yer alır.
            </p>
            <ul className="sgi-typologies" data-sig="rise" aria-label="Çalışma alanlarımız">
              {workAreas.map((item) => (
                <li key={item.n}>{item.title}</li>
              ))}
            </ul>
            <div data-sig="rise">
              <Link className="sgi-link" to="/projelerimiz">
                <span>Projelerimiz Sayfası</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* BÖLÜM 06 — KAPANIŞ (korunur: görseli ve animasyonuyla olduğu gibi kalır) */
export function ClosingExperience() {
  return (
    <section className="sig-section sig-theme-obsidian sig-closing">
      <div className="sig-container">
        <figure className="sig-closing__visual" data-sig="curtain">
          <img
            src={HOME_IMAGES.closingHorizon}
            alt="Alacakaranlıkta sıcak aydınlatmalı kireçtaşı kolonaddan sakin ufuk çizgisine bakış — mimari konsept görseli"
            width={1672}
            height={941}
            loading="lazy"
            decoding="async"
            data-sig-parallax="0.05"
          />
          <div className="sig-closing__fade" aria-hidden="true" />
        </figure>

        <div className="sig-closing__body">
          <Eyebrow index="06">İLETİŞİM</Eyebrow>
          <h2 className="sig-display sig-closing__title" data-sig="words">
            <MaskedWords text="Yeni bir yapıyı birlikte değerlendirelim." />
          </h2>

          <div className="sig-closing__footer" data-sig="rise">
            <p className="sig-prose">
              Arsanız, projeniz veya devam eden işiniz için Başiskele merkezimizde ya da sahada bir araya
              gelebiliriz.
            </p>
            <div className="sig-closing__actions">
              <div className="sig-closing__buttons">
                <Link
                  className="t-button t-primary sig-cta-btn"
                  to="/iletisim"
                  aria-label="Görüşme planla: iletişim sayfasına git"
                  data-ga-event="gorusme_planla_tikla"
                  data-ga-category="iletisim"
                  data-cursor-magnetic
                >
                  <span data-magnetic-inner>
                    GÖRÜŞME PLANLA <ArrowUpRight size={14} />
                  </span>
                </Link>
                <Link className="sig-ghost-btn" to="/hizmetlerimiz">
                  HİZMETLERİMİZ
                </Link>
              </div>
              <div className="sig-closing__direct">
                <a
                  href={`tel:${COMPANY.phoneHref}`}
                  aria-label={`${COMPANY.name} telefon: ${COMPANY.phone}`}
                  data-ga-event="telefon_tikla"
                  data-ga-category="iletisim"
                >
                  <Phone size={15} /> {COMPANY.phone}
                </a>
                <a
                  href={`mailto:${COMPANY.email}`}
                  aria-label={`${COMPANY.name} e-posta: ${COMPANY.email}`}
                  data-ga-event="eposta_tikla"
                  data-ga-category="iletisim"
                >
                  <Mail size={15} /> {COMPANY.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
