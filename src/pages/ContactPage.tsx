import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Copy } from "lucide-react";
import Contact from "../components/Contact";
import { HD_ALTS, HD_PAGES } from "../assets/plates";
import { COMPANY } from "../company";
import { SITE_URL, usePageMeta } from "../seo";
import {
  SigCrumbs,
  SigEyebrow,
  SigWords,
  useSigInnerMotion,
} from "../signature/motion";
import "../signature/signature.css";
import "../lux/lux.css";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${COMPANY.address[0]}, ${COMPANY.address[1]}`,
)}`;

export default function ContactPage() {
  usePageMeta({
    title: "İletişim | KUK İnşaat — Başiskele, Kocaeli",
    description:
      "Projenizi değerlendirmek için KUK İnşaat ile iletişime geçin. Ovacık Mah. Çuhane Cad. No:176, Başiskele, Kocaeli. Telefon ve e-posta ile doğrudan ulaşım.",
    path: "/iletisim",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "İletişim", item: `${SITE_URL}/iletisim` },
        ],
      },
    ],
  });

  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useSigInnerMotion(rootRef, heroRef);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(COMPANY.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${COMPANY.email}`;
    }
  };

  const scrollToForm = () => {
    document.getElementById("iletisim-formu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="sgi-page lux-page" ref={rootRef}>
      {/* BÖLÜM 01 — DİNGİN KOLONAD AÇILIŞI & 3 SÜTUNLU DOĞRUDAN ERİŞİM ŞERİDİ */}
      <section className="lux-contact-hero" ref={heroRef}>
        <figure className="lux-contact-hero__bg" aria-hidden="true">
          <img
            src={HD_PAGES.contactColonnade}
            alt={HD_ALTS.contactColonnade}
            loading="eager"
            decoding="async"
            data-sgi-parallax="0.04"
          />
          <div className="lux-contact-hero__shade" />
        </figure>

        <div className="lux-contact-hero__inner">
          <div className="lux-hero__hud">
            <SigCrumbs items={[{ label: "Ana Sayfa", to: "/" }, { label: "İletişim" }]} />
            <span className="lux-hero__coord">
              <i aria-hidden="true" />
              BAŞİSKELE · KOCAELİ
            </span>
          </div>

          <div className="lux-contact-hero__lead">
            <SigEyebrow index="01">İLETİŞİM VE ÖN GÖRÜŞME</SigEyebrow>
            <h1 className="lux-contact-hero__title" data-sgi="words">
              <SigWords text="Yeni bir yapıyı birlikte değerlendirelim." />
            </h1>
            <p className="lux-contact-hero__sub" data-sgi="rise">
              Arsanız, hazırlık aşamasındaki projeniz ya da devam eden uygulamanız için bize{" "}
              <em className="lux-serif">doğrudan ulaşabilir</em> veya aşağıdaki ön görüşme formunu iletebilirsiniz.
            </p>
            <span className="sgi-badge lux-concept-note">Mimari Konsept Görseli</span>
          </div>

          <div className="lux-direct-strip" data-sgi="stagger">
            {/* 01 · TELEFON */}
            <div className="lux-direct-item">
              <div>
                <span className="lux-direct-item__label">01 · TELEFON</span>
                <strong className="lux-direct-item__value">{COMPANY.phone}</strong>
                <p className="lux-direct-item__note">
                  {COMPANY.hours}.
                </p>
              </div>
              <div className="lux-direct-item__actions">
                <a
                  href={`tel:${COMPANY.phoneHref}`}
                  className="sgi-link"
                  aria-label={`${COMPANY.name}'ı telefonla ara`}
                  data-ga-event="telefon_tikla"
                  data-ga-category="iletisim"
                  data-ga-label="İletişim sayfası · telefon"
                >
                  <span>Hemen Arayın</span>
                  <ArrowUpRight size={14} />
                </a>
                <button type="button" className="sgi-link" onClick={scrollToForm}>
                  <span>Formu Aç</span>
                  <ArrowDown size={14} />
                </button>
              </div>
            </div>

            {/* 02 · E-POSTA */}
            <div className="lux-direct-item">
              <div>
                <span className="lux-direct-item__label">02 · E-POSTA</span>
                <strong className="lux-direct-item__value">{COMPANY.email}</strong>
                <p className="lux-direct-item__note">
                  Pafta, imar durumu ve keşif notları için.
                </p>
              </div>
              <div className="lux-direct-item__actions">
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="sgi-link"
                  aria-label={`${COMPANY.name}'a e-posta gönder`}
                  data-ga-event="eposta_tikla"
                  data-ga-category="iletisim"
                  data-ga-label="İletişim sayfası · e-posta"
                >
                  <span>E-posta Yazın</span>
                  <ArrowUpRight size={14} />
                </a>
                <button type="button" className="sgi-link" onClick={copyEmail}>
                  {copied ? (
                    <>
                      <span>Kopyalandı</span>
                      <Check size={13} />
                    </>
                  ) : (
                    <>
                      <span>Kopyala</span>
                      <Copy size={12} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 03 · MERKEZ OFİS */}
            <div className="lux-direct-item">
              <div>
                <span className="lux-direct-item__label">03 · MERKEZ OFİS</span>
                <strong className="lux-direct-item__value">Başiskele, Kocaeli</strong>
                <p className="lux-direct-item__note">
                  {COMPANY.address[0]}, {COMPANY.address[1]}
                </p>
              </div>
              <div className="lux-direct-item__actions">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sgi-link"
                  aria-label="Başiskele merkez adresini haritada görüntüleyin"
                >
                  <span>Haritada Açın</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BÖLÜM 02 — YALIN VE ESTETİK ÖN GÖRÜŞME ATÖLYESİ */}
      <Contact />

      {/* BÖLÜM 03 — MERKEZ OFİS HARİTASI (Google Maps gömülü iframe, sitenin kart diliyle çerçeveli) */}
      <section className="sgi-section sgi-theme-ivory" id="harita">
        <div className="sgi-container">
          <div className="sgi-header-split">
            <div>
              <SigEyebrow index="03">MERKEZ OFİS · CANLI HARİTA</SigEyebrow>
              <h2 className="sgi-h2" data-sgi="words">
                <SigWords text="Ovacık'ta, Çuhane Caddesi üzerinde." />
              </h2>
            </div>
            <div className="sgi-header-split__aside" data-sgi="rise">
              <p className="sgi-prose">
                Görüşme ve keşif randevularını merkez ofisimizde planlıyoruz. Haritadan konumu büyütüp yol
                tarifi alabilirsiniz.
              </p>
            </div>
          </div>

          <div className="lux-map-card" data-sgi="rise">
            <div className="lux-map-card__side">
              <span className="lux-map-card__k">Adres</span>
              <p className="lux-map-card__v">
                {COMPANY.address[0]}
                <br />
                {COMPANY.address[1]}
              </p>
              <dl className="lux-map-card__facts">
                <div>
                  <dt>Saatler</dt>
                  <dd className="ft-nowrap">{COMPANY.hours}</dd>
                </div>
                <div>
                  <dt>Telefon</dt>
                  <dd>
                    <a href={`tel:${COMPANY.phoneHref}`}>{COMPANY.phone}</a>
                  </dd>
                </div>
              </dl>
              <a
                className="sgi-link"
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ga-event="harita_ac_tikla"
                data-ga-category="iletisim"
                data-ga-label="İletişim sayfası · haritada aç"
              >
                <span>Google Haritalar'da Açın</span>
                <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="lux-map-card__frame">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.6581221358415!2d29.999925500000003!3d40.725542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cb5b2a9a21b58b%3A0xc44a81415cfe884c!2zS3VrIMSwbsWfYWF0!5e0!3m2!1str!2str!4v1794935553248!5m2!1str!2str"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="KUK İnşaat merkez ofis konumu — Ovacık Mah. Çuhane Cad. No:176, Başiskele, Kocaeli (Google Haritalar)"
              />
              <span className="sgi-badge lux-map-card__badge" aria-hidden="true">
                Google Haritalar
              </span>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
