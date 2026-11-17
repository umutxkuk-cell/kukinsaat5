import { useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { HD_ALTS, HD_PAGES } from "../assets/plates";
import { COMPANY } from "../company";
import { phases } from "../data";
import { SITE_URL, usePageMeta } from "../seo";
import { assetUrl } from "../utils/assetUrl";
import {
  SigClosing,
  SigCrumbs,
  SigEyebrow,
  SigWords,
  useSigInnerMotion,
} from "../signature/motion";
import "../signature/signature.css";
import "../projects/projects.css";

/* KURUMSAL — Projelerimiz ve Hizmetlerimiz ile aynı koyu panel dili.
   Açılış: tipografik koyu hero + üç yönetim ilkesi kartı.
   Ardından açık zeminde: 4 disiplin komuta sahnesi, 5 aşamalı yöntem ve resmî künye.
   Üst menüdeki #yonetim-anlayisi ve #calisma-yontemi çapa bağlantıları korunur. */

const managementChapters = [
  {
    n: "01",
    tag: "DETAY & TOLERANS",
    title: "Proje ile saha arasındaki mesafeyi kapatmak",
    text: "Uygulama sorunlarının çoğu, detayların sahada nasıl imal edileceği erken düşünülmediğinde ortaya çıkar. Çizimleri yalnızca kâğıt üzerinde değil; imalat sırası, birleşim koşulu ve malzeme toleransıyla birlikte değerlendiririz.",
  },
  {
    n: "02",
    tag: "4 DİSİPLİN TEK YAPI",
    title: "Dört disiplini tek yapı üzerinden okumak",
    text: "Mimari, statik, elektrik ve mekanik kararlar birbirinden kopuk ele alınmaz. Bir açıklık, şaft veya cephe detayı değiştiğinde tüm disiplinlerdeki karşılığı yapım öncesinde netleştirilir.",
  },
  {
    n: "03",
    tag: "AÇIK BİLGİLENDİRME",
    title: "Ölçülü taahhüt ve açık bilgilendirme",
    text: "Çalışma kalitemizi üstlendiğimiz iş sayısıyla değil, kapsamı baştan doğru tanımlanmış yapılar tamamlamakla ölçeriz. Ortaya çıkan her değişiklik teknik gerekçesi, süre ve bütçe etkisiyle birlikte paylaşılır.",
  },
];

/* Dört projenin yapım öncesinde birlikte okunan başlıkları. Test, belge ya da
   garanti iddiası içermez; karşılaştırılan konuları anlatır. */
const disciplineMatrix = [
  {
    n: "01",
    code: "MİMARİ",
    title: "Mimari Proje",
    tag: "KOT · CEPHE · DETAY",
    image: HD_PAGES.servicesPavilion,
    alt: HD_ALTS.servicesPavilion,
    heading: "Mimari kararın sahadaki karşılığını diğer projelerle birlikte okuruz.",
    summary:
      "Kat yükseklikleri, cephe ve iç mekân detayları; taşıyıcı sistem ve tesisat geçişleriyle aynı yapı elemanı üzerinden karşılaştırılır. Fark görülürse konu imalat başlamadan revizyona döner.",
    checks: [
      { label: "KOTLAR", value: "Kiriş, döşeme ve asma tavan paylarının mimari kotlarla karşılaştırılması" },
      { label: "CEPHE", value: "Doğrama, kaplama ve yalıtım birleşimlerinin kesit üzerinden okunması" },
      { label: "ISLAK HACİMLER", value: "Eğim, süzgeç ve tesisat şaftı konumlarının planla eşleşmesi" },
      { label: "AÇIKLIKLAR", value: "Kapı, pencere ve boşlukların taşıyıcı elemanlarla ilişkisi" },
    ],
  },
  {
    n: "02",
    code: "STATİK",
    title: "Statik Proje",
    tag: "AKS · AÇIKLIK · REZERVASYON",
    image: HD_PAGES.engineeringStructure,
    alt: HD_ALTS.engineeringStructure,
    heading: "Taşıyıcı sistem kararlarını mimari ve tesisatla aynı kesitte değerlendiririz.",
    summary:
      "Kolon, perde ve kiriş yerleşimi; mimari açıklıklar ve tesisat geçişleriyle birlikte ele alınır. Geçiş boşlukları beton dökümünden önce netleştirilir.",
    checks: [
      { label: "AKS UYUMU", value: "Kolon ve perde akslarının mimari planla örtüşmesi" },
      { label: "KİRİŞ VE DÖŞEME", value: "Kiriş derinliklerinin tavan kotu ve tesisat güzergâhıyla ilişkisi" },
      { label: "REZERVASYONLAR", value: "Kiriş, perde ve döşeme geçişlerinin döküm öncesi belirlenmesi" },
      { label: "TEMEL", value: "Temel, drenaj ve yalıtım detaylarının birlikte okunması" },
    ],
  },
  {
    n: "03",
    code: "MEKANİK",
    title: "Mekanik Proje",
    tag: "ŞAFT · GÜZERGÂH · KOT",
    image: HD_PAGES.typologyMixed,
    alt: HD_ALTS.typologyMixed,
    heading: "Tesisat güzergâhlarını kaba yapı başlamadan diğer projelerle karşılaştırırız.",
    summary:
      "Şaftlar, yatay dağılım hatları ve cihaz yerleri; taşıyıcı sistem ve mimari tavan kotlarıyla çakışma açısından kontrol edilir.",
    checks: [
      { label: "ŞAFTLAR", value: "Düşey şaftların döşeme boşluklarıyla katlar boyunca sürekliliği" },
      { label: "YATAY HATLAR", value: "Kanal ve boru güzergâhlarının kiriş ve tavan kotlarıyla ilişkisi" },
      { label: "CİHAZ YERLERİ", value: "Cihaz ve kolektör konumlarının mimari planla uyumu" },
      { label: "ISLAK HACİM BAĞLANTILARI", value: "Temiz ve pis su bağlantılarının mimari detayla eşleşmesi" },
    ],
  },
  {
    n: "04",
    code: "ELEKTRİK",
    title: "Elektrik Projesi",
    tag: "PANO · GÜZERGÂH · EKSEN",
    image: HD_PAGES.typologyCommercial,
    alt: HD_ALTS.typologyCommercial,
    heading: "Elektrik altyapısını mimari ve mekanik kararlarla aynı planda okuruz.",
    summary:
      "Pano yerleri, kablo güzergâhları ve aydınlatma eksenleri; mimari tavan planı ve mekanik hatlarla birlikte değerlendirilir.",
    checks: [
      { label: "PANO VE ŞAFT", value: "Pano ve elektrik şaftı konumlarının planla uyumu" },
      { label: "GÜZERGÂHLAR", value: "Tava ve boru güzergâhlarının mekanik hatlarla çakışma kontrolü" },
      { label: "AYDINLATMA EKSENLERİ", value: "Armatür eksenlerinin tavan planı ve cepheyle ilişkisi" },
      { label: "REZERVASYONLAR", value: "Döşeme ve duvar geçişlerinin imalat öncesi belirlenmesi" },
    ],
  },
];

const phaseVisuals = [
  { image: HD_PAGES.servicesPavilion, alt: HD_ALTS.servicesPavilion, output: "Saha analizi ve kapsam çerçevesi" },
  {
    image: HD_PAGES.corporateStudio,
    alt: HD_ALTS.corporateStudio,
    output: "Yapılabilirlik, bütçe aralığı ve teknik risk tablosu",
  },
  {
    image: HD_PAGES.typologyMixed,
    alt: HD_ALTS.typologyMixed,
    output: "Uyumlandırılmış uygulama projeleri ve detay kararları",
  },
  {
    image: HD_PAGES.typologyCommercial,
    alt: HD_ALTS.typologyCommercial,
    output: "İş programına bağlı kontrollü saha imalatı",
  },
  {
    image: HD_PAGES.contactColonnade,
    alt: HD_ALTS.contactColonnade,
    output: "Eksiksiz teslim kaydı ve teslim sonrası muhataplık",
  },
];

export default function CorporatePage() {
  usePageMeta({
    title: "Kurumsal | KUK İnşaat — Başiskele, Kocaeli",
    description:
      "KUK İnşaat'ın çalışma anlayışı, mühendislik yaklaşımı ve şirket bilgileri. Başiskele merkezli; İzmit ve Kocaeli genelinde çalışan inşaat ve mühendislik firması.",
    path: "/kurumsal",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Kurumsal", item: `${SITE_URL}/kurumsal` },
        ],
      },
    ],
  });

  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [activeDiscipline, setActiveDiscipline] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [copied, setCopied] = useState(false);

  useSigInnerMotion(rootRef, heroRef);

  const currentDiscipline = disciplineMatrix[activeDiscipline] ?? disciplineMatrix[0];
  const currentPhase = phases[activePhase] ?? phases[0];
  const currentVisual = phaseVisuals[activePhase] ?? phaseVisuals[0];

  const copyOfficial = async () => {
    try {
      await navigator.clipboard.writeText(
        `${COMPANY.legalName} — ${COMPANY.address[0]}, ${COMPANY.address[1]}`,
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  };

  return (
    <main className="sgi-page" ref={rootRef}>
      {/* 01–02 — KOYU AÇILIŞ + ÜÇ YÖNETİM İLKESİ KARTI */}
      <section className="prj-hero sgi-theme-obsidian" ref={heroRef}>
        <div className="prj-hero__inner">
          <div className="prj-hud">
            <SigCrumbs items={[{ label: "Ana Sayfa", to: "/" }, { label: "Kurumsal" }]} />
            <span className="prj-coord">
              <i aria-hidden="true" />
              40°42&apos;N · 29°56&apos;E — BAŞİSKELE, KOCAELİ
            </span>
          </div>

          <div className="prj-hero__grid">
            <div className="prj-hero__lead">
              <SigEyebrow index="01">KURUMSAL</SigEyebrow>
              <h1 className="prj-hero__title" data-sgi="words">
                <SigWords text="Mimarinin dinginliğini, mühendisliğin kesinliğiyle kuruyoruz." />
              </h1>
            </div>
            <p className="prj-hero__sub" data-sgi="rise">
              KUK İnşaat; Başiskele, İzmit ve Kocaeli çevresinde konut, ticari ve karma kullanımlı yapılar için proje
              koordinasyonunu, mühendislik değerlendirmesini ve saha uygulamasını{" "}
              <em>tek bir standart altında</em> buluşturan bir yapım firmasıdır.
            </p>
          </div>

          <div className="prj-trio-head" id="yonetim-anlayisi">
            <SigEyebrow index="02">YÖNETİM ANLAYIŞIMIZ</SigEyebrow>
          </div>

          <div className="prj-trio">
            {managementChapters.map((chapter) => (
              <article key={chapter.n} className="prj-panel prj-panel--text" data-sgi="rise">
                <div className="prj-panel--text__top">
                  <span className="prj-panel--text__n" aria-hidden="true">
                    {chapter.n}
                  </span>
                  <span className="prj-panel--text__tag">{chapter.tag}</span>
                </div>
                <h2 className="prj-panel__title">{chapter.title}</h2>
                <p className="prj-panel__text">{chapter.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — DÖRT DİSİPLİN · TEK YAPI (açık zeminde etkileşimli sahne) */}
      <section className="sgi-section sgi-theme-limestone" id="disiplin-matrisi">
        <div className="sgi-container">
          <div className="sgi-header-split">
            <div>
              <SigEyebrow index="03">DÖRT DİSİPLİN · TEK YAPI</SigEyebrow>
              <h2 className="sgi-h2" data-sgi="words">
                <SigWords text="Mimari, statik, mekanik ve elektrik kararları yapım öncesinde tek yapıda buluşur." />
              </h2>
            </div>
            <div className="sgi-header-split__aside" data-sgi="rise">
              <p className="sgi-prose">
                Birçok uygulama sorunu, projelerin birbirini tam tutmadığı noktada başlar. Dört projeyi imalat
                başlamadan aynı yapı elemanı üzerinden karşılaştırıyoruz.
              </p>
            </div>
          </div>

          <div className="cmd" data-sgi="rise">
            <div className="cmd__nav" role="tablist" aria-label="Mühendislik ve tasarım disiplinleri">
              {disciplineMatrix.map((disc, idx) => (
                <button
                  key={disc.code}
                  type="button"
                  role="tab"
                  aria-selected={activeDiscipline === idx}
                  className={`cmd__btn${activeDiscipline === idx ? " is-active" : ""}`}
                  onMouseEnter={() => setActiveDiscipline(idx)}
                  onFocus={() => setActiveDiscipline(idx)}
                  onClick={() => setActiveDiscipline(idx)}
                >
                  <span className="cmd__btn__n">{disc.n}</span>
                  <span className="cmd__btn__t">{disc.title}</span>
                  <span className="cmd__btn__tag">{disc.code}</span>
                </button>
              ))}
            </div>

            <div className="cmd__stage" role="tabpanel" aria-live="polite">
              <div className="cmd__media">
                <img src={currentDiscipline.image} alt={currentDiscipline.alt} loading="lazy" decoding="async" />
                <span className="prj-badge">
                  DİSİPLİN {currentDiscipline.n} / 04 · {currentDiscipline.code}
                </span>
                <span className="sgi-badge" aria-hidden="true">
                  Mimari Konsept Görseli
                </span>
              </div>

              <div className="cmd__content">
                <h3>{currentDiscipline.heading}</h3>
                <p>{currentDiscipline.summary}</p>
                <div className="cmd__grid">
                  {currentDiscipline.checks.map((chk) => (
                    <div key={chk.label} className="cmd__cell">
                      <small>{chk.label}</small>
                      <strong>{chk.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — ÇALIŞMA YÖNTEMİMİZ (5 aşamalı ray + sahne) */}
      <section className="sgi-section sgi-theme-ivory" id="calisma-yontemi">
        <div className="sgi-container">
          <div className="sgi-header-split">
            <div>
              <SigEyebrow index="04">ÇALIŞMA YÖNTEMİMİZ</SigEyebrow>
              <h2 className="sgi-h2" data-sgi="words">
                <SigWords text="Keşiften teslime, beş aşamalı berrak bir düzen." />
              </h2>
            </div>
            <div className="sgi-header-split__aside" data-sgi="rise">
              <p className="sgi-prose">
                Her aşama bir öncekinin doğrulanmış çıktısıyla başlar; belirsizlikler varsayımla bir sonraki adıma
                taşınmaz.
              </p>
            </div>
          </div>

          <div className="sgi-phase-bar" role="tablist" aria-label="Çalışma yöntemi aşamaları" data-sgi="rise">
            {phases.map((phase, index) => (
              <button
                key={phase.number}
                type="button"
                role="tab"
                aria-selected={activePhase === index}
                className={`sgi-phase-pill${activePhase === index ? " is-active" : ""}`}
                onClick={() => setActivePhase(index)}
              >
                <b>{phase.number}</b>
                <span>{phase.short}</span>
              </button>
            ))}
          </div>

          <div className="sgi-interactive-grid">
            <div className="sgi-stage-col">
              <div className="sgi-stage-frame" data-sgi="curtain">
                {phaseVisuals.map((vis, index) => (
                  <figure
                    key={phases[index].number}
                    className={`sgi-stage-slide${activePhase === index ? " is-active" : ""}`}
                    aria-hidden={activePhase !== index}
                  >
                    <img
                      src={assetUrl(vis.image)}
                      alt={vis.alt}
                      width={1200}
                      height={900}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                ))}
                <div className="sgi-stage-shade" aria-hidden="true" />
                <div className="sgi-stage-caption" aria-live="polite">
                  <span>
                    AŞAMA {currentPhase.number} / 05 · MİMARİ KONSEPT
                  </span>
                  <strong>{currentVisual.output}</strong>
                </div>
              </div>
            </div>

            <ol className="sgi-rows-col" data-sgi="stagger">
              {phases.map((phase, index) => {
                const isCurrent = activePhase === index;
                return (
                  <li key={phase.number}>
                    <button
                      type="button"
                      className={`sgi-row sgi-row--no-icon${isCurrent ? " is-active" : ""}`}
                      onMouseEnter={() => setActivePhase(index)}
                      onFocus={() => setActivePhase(index)}
                      onClick={() => setActivePhase(index)}
                    >
                      <span className="sgi-row__index">{phase.number}</span>
                      <div className="sgi-row__content">
                        <h3>{phase.title}</h3>
                        <p>{phase.text}</p>
                        <span className="sgi-row__subnote">
                          ÇIKTI · {phaseVisuals[index]?.output ?? currentVisual.output}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* 05 — RESMÎ KÜNYE */}
      <section className="sgi-section sgi-theme-limestone" id="kurumsal-kunye">
        <div className="sgi-container sgi-sticky-chapters">
          <div className="sgi-sticky-chapters__lead">
            <SigEyebrow index="05">ŞİRKET BİLGİLERİ</SigEyebrow>
            <h2 className="sgi-h2" style={{ fontSize: "clamp(26px, 2.9vw, 40px)" }} data-sgi="words">
              <SigWords text={COMPANY.legalName} />
            </h2>
            <p className="sgi-prose" data-sgi="rise">
              Başiskele merkez ofisimiz üzerinden Kocaeli genelindeki konut, ticari ve karma kullanım yatırımları
              için doğrudan muhataplık sunuyoruz.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 28px", marginTop: 28 }} data-sgi="rise">
              <Link className="sgi-link" to="/hizmetlerimiz">
                <span>Tüm Hizmetlerimiz</span>
                <ArrowUpRight size={15} />
              </Link>
              <button type="button" className="sgi-link" onClick={copyOfficial}>
                {copied ? (
                  <>
                    <span>Künye Kopyalandı</span>
                    <Check size={14} />
                  </>
                ) : (
                  <>
                    <span>Resmi Künyeyi Kopyala</span>
                    <Copy size={13} />
                  </>
                )}
              </button>
            </div>
          </div>

          <div style={{ gridColumn: "7 / span 6" }} data-sgi="rise">
            <dl className="sgi-dossier-dl">
              <div>
                <dt>Resmî Unvan</dt>
                <dd>{COMPANY.legalName}</dd>
              </div>
              <div>
                <dt>Merkez Adresi</dt>
                <dd>
                  {COMPANY.address[0]}, {COMPANY.address[1]}
                </dd>
              </div>
              <div>
                <dt>Hizmet Bölgesi</dt>
                <dd>Başiskele, İzmit ve Kocaeli çevresi</dd>
              </div>
              <div>
                <dt>Faaliyet Kapsamı</dt>
                <dd>
                  İnşaat Uygulamaları · Mühendislik · Teknik Koordinasyon · Süreç Yönetimi · Danışmanlık
                </dd>
              </div>
              <div>
                <dt>Çalışma Saatleri</dt>
                <dd>{COMPANY.hours}</dd>
              </div>
              <div>
                <dt>Doğrudan Erişim</dt>
                <dd>
                  <a href={`tel:${COMPANY.phoneHref}`} style={{ fontWeight: 600 }}>
                    {COMPANY.phone}
                  </a>
                  {" · "}
                  <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <SigClosing
        index="06"
        title="Yapınızın kapsamını ilk görüşmede birlikte netleştirelim."
        secondaryTo="/hizmetlerimiz"
        secondaryLabel="HİZMETLERİMİZ"
      />
    </main>
  );
}
