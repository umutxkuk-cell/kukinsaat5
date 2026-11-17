import { useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services, type Service } from "../services";
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

/* HİZMETLERİMİZ — Projelerimiz ile aynı koyu panel dili.
   Açılış: tipografik koyu hero (fotoğraf yok). Gövde: her hizmet yatay bir pafta
   (solda kendi konsept görseli, sağda içerik). Görseller bu sayfaya özeldir;
   sitenin başka bölümlerinde kullanılmaz. */

/* Her hizmetin kendi içerik bloklarından üç kısa kapsam başlığı çıkarır. */
function scopePoints(service: Service): string[] {
  for (const block of service.blocks) {
    if (block.kind === "list" && block.items.length >= 3) return block.items.slice(0, 3);
    if (block.kind === "table" && block.rows.length >= 3) return block.rows.slice(0, 3).map((row) => row.title);
    if (block.kind === "steps" && block.items.length >= 3) return block.items.slice(0, 3).map((step) => step.title);
  }
  return service.heroMeta.slice(0, 3);
}

const workingModels = [
  {
    n: "01",
    tag: "MÜSTAKİL UZMANLIK",
    title: "Tek bir aşamada odaklı destek",
    text: "Onaylı bir projeniz varsa yalnızca şantiye uygulamasını; karar aşamasındaysanız yalnızca mühendislik değerlendirmesini veya bağımsız teknik danışmanlığı sınırları net bir kapsamla üstleniriz.",
  },
  {
    n: "02",
    tag: "BÜTÜNCÜL YÜRÜTME",
    title: "Koordinasyondan teslime tek sorumluluk",
    text: "Mimari, statik, elektrik ve mekanik projelerin yapım öncesinde uyumlandırılmasından kaba ve ince yapı imalatlarının tamamlanmasına kadar bütün süreci tek bir iş programı altında toplarız.",
  },
  {
    n: "03",
    tag: "İŞVEREN ADINA YÖNETİM",
    title: "Mevcut yüklenici düzeniyle bağımsız takip",
    text: "Devam eden bir projede mevcut çalışma düzeninizi bozmadan; iş programını, bütçe gerçekleşmelerini ve sahadaki imalat kalitesini işveren adına denetler ve düzenli raporlarız.",
  },
];

export default function ServicesPage() {
  usePageMeta({
    title: "Hizmetlerimiz | İnşaat, Mühendislik ve Proje Yönetimi — KUK İnşaat",
    description:
      "KUK İnşaat'ın Kocaeli ve çevresindeki beş uzmanlık alanı: inşaat ve yapı uygulamaları, mühendislik hizmetleri, teknik koordinasyon, süreç yönetimi ve teknik danışmanlık.",
    path: "/hizmetlerimiz",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Hizmetlerimiz", item: `${SITE_URL}/hizmetlerimiz` },
        ],
      },
    ],
  });

  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  useSigInnerMotion(rootRef, heroRef);

  return (
    <main className="sgi-page" ref={rootRef}>
      {/* 01 — KOYU TİPOGRAFİK AÇILIŞ */}
      <section className="prj-hero prj-hero--stack sgi-theme-obsidian" ref={heroRef}>
        <div className="prj-hero__inner">
          <div className="prj-hud">
            <SigCrumbs items={[{ label: "Ana Sayfa", to: "/" }, { label: "Hizmetlerimiz" }]} />
            <span className="prj-coord">
              <i aria-hidden="true" />
              05 UZMANLIK ALANI · TEK YAPIM STANDARDI
            </span>
          </div>

          <div className="prj-hero__grid">
            <div className="prj-hero__lead">
              <SigEyebrow index="01">UZMANLIK ALANLARIMIZ</SigEyebrow>
              <h1 className="prj-hero__title" data-sgi="words">
                <SigWords text="Beş uzmanlık alanı, tek bir yapım standardı." />
              </h1>
            </div>
            <p className="prj-hero__sub" data-sgi="rise">
              İhtiyacınız tek bir aşamada da olabilir, yapının tamamında da. Kapsamı ilk günden netleştirir, tüm
              süreci <em>aynı mühendislik disipliniyle</em> yürütürüz.
            </p>
          </div>
        </div>
      </section>

      {/* 02 — BEŞ HİZMET PAFTASI (koyu zeminde yatay kartlar) */}
      <section className="prj-stack" aria-label="Uzmanlık paftaları">
        <div className="prj-stack__head" data-sgi="rise">
          <SigEyebrow index="02">UZMANLIK PAFTALARI</SigEyebrow>
          <span className="prj-coord">
            <i aria-hidden="true" />
            HER HİZMET KENDİ DETAY SAYFASINA AÇILIR
          </span>
        </div>

        <div className="prj-stack__inner">
          {services.map((service, index) => (
            <article key={service.slug} className="prj-panel prj-panel--row" id={`hizmet-${service.n}`} data-sgi="rise">
              <Link
                to={`/hizmetlerimiz/${service.slug}`}
                className="prj-panel__media"
                aria-label={`${service.title} hizmet detay sayfasına git`}
                data-cursor="view"
                data-cursor-label="DETAY ↗"
              >
                <img
                  src={assetUrl(service.image)}
                  alt={service.imageAlt}
                  width={service.imageWidth}
                  height={service.imageHeight}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span className="prj-panel__num" aria-hidden="true">
                  {service.n}
                </span>
                <span className="sgi-badge" aria-hidden="true">
                  Konsept Görseli
                </span>
              </Link>

              <div className="prj-panel__body">
                <div className="prj-panel__tab">
                  <b>{service.n}</b>
                  <span>/ 05</span>
                  <i aria-hidden="true" />
                  <span>{service.note}</span>
                </div>

                <h2 className="prj-panel__title">{service.title}</h2>
                <p className="prj-panel__text">{service.short}</p>

                <ul className="prj-panel__points">
                  {scopePoints(service).map((point, pointIndex) => (
                    <li key={point}>
                      <span>0{pointIndex + 1}</span>
                      <div>{point}</div>
                    </li>
                  ))}
                </ul>

                <div className="prj-panel__foot">
                  <p className="prj-panel__tags">{service.heroMeta.join(" · ")}</p>
                  <div className="prj-panel__links">
                    <Link className="prj-link" to={`/hizmetlerimiz/${service.slug}`}>
                      <span>Hizmet Detayı</span>
                      <ArrowRight size={14} />
                    </Link>
                    <Link className="prj-link" to="/iletisim">
                      <span>Bu Kapsam İçin Görüşün</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 03 — ÇALIŞMA MODELLERİ (açık zemin, üç sütun) */}
      <section className="sgi-section sgi-theme-limestone" id="calisma-modelleri">
        <div className="sgi-container">
          <div className="sgi-header-split">
            <div>
              <SigEyebrow index="03">ÇALIŞMA MODELLERİ</SigEyebrow>
              <h2 className="sgi-h2" data-sgi="words">
                <SigWords text="Projenin ölçeğine uyum sağlayan üç yürütme kurgusu." />
              </h2>
            </div>
            <div className="sgi-header-split__aside" data-sgi="rise">
              <p className="sgi-prose">
                Hizmetlerimizi tekil bir teknik görev olarak ya da tüm disiplinleri birleştiren bütünleşik bir
                uygulama modeliyle sunuyoruz.
              </p>
            </div>
          </div>

          <div className="sgi-columns-3" data-sgi="stagger">
            {workingModels.map((model) => (
              <article key={model.n} className="sgi-col">
                <div className="sgi-col__meta">
                  <span>{model.n}</span>
                  <span>{model.tag}</span>
                </div>
                <div>
                  <h3>{model.title}</h3>
                  <p>{model.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SigClosing
        index="04"
        title="Hangi hizmet kurgusunun projenize uygun olduğunu birlikte netleştirelim."
        secondaryTo="/kurumsal"
        secondaryLabel="KURUMSAL YAKLAŞIMIMIZ"
      />
    </main>
  );
}
