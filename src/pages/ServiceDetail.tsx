import { useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { serviceBySlug, services, type Service, type ServiceBlock } from "../services";
import { COMPANY } from "../company";
import { SITE_URL, usePageMeta } from "../seo";
import { assetUrl } from "../utils/assetUrl";
import {
  SigClosing,
  SigCrumbs,
  SigEyebrow,
  SigWords,
  useSigInnerMotion,
} from "../signature/motion";
import NotFoundPage from "./NotFound";
import "../signature/signature.css";

function ServiceBlockSection({ block, index }: { block: ServiceBlock; index: number }) {
  const theme = index % 2 === 0 ? "sgi-theme-ivory" : "sgi-theme-limestone";
  const badge = String(index + 2).padStart(2, "0");

  switch (block.kind) {
    case "list":
      return (
        <section className={`sgi-section ${theme}`}>
          <div className="sgi-container sgi-sticky-chapters">
            <div className="sgi-sticky-chapters__lead">
              <SigEyebrow index={badge}>{block.eyebrow}</SigEyebrow>
              <h2 className="sgi-h2" data-sgi="words">
                <SigWords text={block.title} />
              </h2>
            </div>
            <ol className="sgi-sticky-chapters__list" data-sgi="stagger">
              {block.items.map((item, idx) => (
                <li key={item} className="sgi-chapter-item" style={{ padding: "24px 0" }}>
                  <div className="sgi-chapter-item__head">
                    <span>{String(idx + 1).padStart(2, "0")}</span>
                    <h3 style={{ fontSize: "clamp(18px, 1.6vw, 22px)", fontWeight: 500 }}>{item}</h3>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      );

    case "steps":
      return (
        <section className={`sgi-section ${theme}`}>
          <div className="sgi-container sgi-sticky-chapters">
            <div className="sgi-sticky-chapters__lead">
              <SigEyebrow index={badge}>{block.eyebrow}</SigEyebrow>
              <h2 className="sgi-h2" data-sgi="words">
                <SigWords text={block.title} />
              </h2>
            </div>
            <ol className="sgi-sticky-chapters__list" data-sgi="stagger">
              {block.items.map((item, idx) => (
                <li key={item.title} className="sgi-chapter-item">
                  <div className="sgi-chapter-item__head">
                    <span>{String(idx + 1).padStart(2, "0")}</span>
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      );

    case "table":
      return (
        <section className={`sgi-section ${theme}`}>
          <div className="sgi-container sgi-sticky-chapters">
            <div className="sgi-sticky-chapters__lead">
              <SigEyebrow index={badge}>{block.eyebrow}</SigEyebrow>
              <h2 className="sgi-h2" data-sgi="words">
                <SigWords text={block.title} />
              </h2>
            </div>
            <div style={{ gridColumn: "7 / span 6" }} data-sgi="rise">
              <dl className="sgi-dossier-dl">
                {block.rows.map((row) => (
                  <div key={row.title} style={{ padding: "24px 0" }}>
                    <dt style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", textTransform: "none", color: "inherit" }}>
                      {row.title}
                    </dt>
                    <dd style={{ color: "var(--sgi-body)" }}>{row.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      );

    case "prose":
      return (
        <section className={`sgi-section ${theme}`}>
          <div className="sgi-container sgi-sticky-chapters">
            <div className="sgi-sticky-chapters__lead">
              <SigEyebrow index={badge}>{block.eyebrow}</SigEyebrow>
              <h2 className="sgi-h2" data-sgi="words">
                <SigWords text={block.title} />
              </h2>
            </div>
            <div style={{ gridColumn: "7 / span 6", display: "grid", gap: 20 }} data-sgi="rise">
              {block.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="sgi-prose--large">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      );

    case "pair":
      return (
        <section className="sgi-section sgi-theme-obsidian">
          <div className="sgi-container">
            <div className="sgi-header-split">
              <div>
                <SigEyebrow index={badge}>{block.eyebrow}</SigEyebrow>
                <h2 className="sgi-h2" data-sgi="words">
                  <SigWords text={block.title} />
                </h2>
              </div>
            </div>
            <div className="sgi-columns-3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }} data-sgi="stagger">
              <article className="sgi-col">
                <div className="sgi-col__meta">
                  <span>01</span>
                  <span>KAPSAM</span>
                </div>
                <div>
                  <h3>{block.left.title}</h3>
                  <p>{block.left.text}</p>
                </div>
              </article>
              <article className="sgi-col">
                <div className="sgi-col__meta">
                  <span>02</span>
                  <span>SINIR VE İLİŞKİ</span>
                </div>
                <div>
                  <h3>{block.right.title}</h3>
                  <p>{block.right.text}</p>
                </div>
              </article>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}

function ServiceDetail({ service }: { service: Service }) {
  const path = `/hizmetlerimiz/${service.slug}`;
  const related = service.related
    .map((slug) => services.find((item) => item.slug === slug))
    .filter((item): item is Service => Boolean(item));

  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [openFaq, setOpenFaq] = useState(0);

  useSigInnerMotion(rootRef, heroRef, [service.slug]);

  usePageMeta({
    title: service.seoTitle,
    description: service.seoDescription,
    path,
    image: service.image,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}${path}#service`,
        name: service.title,
        description: service.seoDescription,
        url: `${SITE_URL}${path}`,
        image: `${SITE_URL}/og-cover.jpg`,
        serviceType: service.title,
        provider: { "@type": "GeneralContractor", name: COMPANY.name, url: SITE_URL },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Kocaeli" },
          { "@type": "City", name: "Başiskele" },
          { "@type": "City", name: "İzmit" },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE_URL}${path}#faq`,
        inLanguage: "tr-TR",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Hizmetlerimiz", item: `${SITE_URL}/hizmetlerimiz` },
          { "@type": "ListItem", position: 3, name: service.title, item: `${SITE_URL}${path}` },
        ],
      },
    ],
  });

  return (
    <main className="sgi-page" ref={rootRef}>
      <section className="sgi-cinema-hero sgi-cinema-hero--compact" ref={heroRef}>
        <figure className="sgi-cinema-hero__bg">
          <img
            src={assetUrl(service.image)}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
            alt={service.imageAlt}
            width={service.imageWidth}
            height={service.imageHeight}
            loading="eager"
            decoding="async"
            data-sgi-parallax="0.05"
          />
          <div className="sgi-cinema-hero__shade" aria-hidden="true" />
        </figure>

        <div className="sgi-cinema-hero__inner">
          <SigCrumbs
            items={[
              { label: "Ana Sayfa", to: "/" },
              { label: "Hizmetlerimiz", to: "/hizmetlerimiz" },
              { label: service.title },
            ]}
          />

          <div className="sgi-cinema-hero__grid">
            <div className="sgi-cinema-hero__main">
              <SigEyebrow index={service.n}>{service.note}</SigEyebrow>
              <h1 className="sgi-display" data-sgi="words">
                <SigWords text={service.h1} />
              </h1>
              <p className="sgi-prose--large" data-sgi="rise">
                {service.short}
              </p>
            </div>

            <div className="sgi-cinema-hero__aside">
              <Link className="sgi-link" to="/hizmetlerimiz">
                <ArrowLeft size={14} />
                <span>Tüm Hizmetlerimiz</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sgi-section sgi-theme-limestone sgi-after-hero">
        <div className="sgi-container sgi-sticky-chapters">
          <div className="sgi-sticky-chapters__lead">
            <SigEyebrow index="01">HİZMETİN TANIMI</SigEyebrow>
            <h2 className="sgi-h2" data-sgi="words">
              <SigWords text={service.introTitle} />
            </h2>
            <ul className="sgi-typologies" data-sgi="rise">
              {service.heroMeta.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>

          <div style={{ gridColumn: "7 / span 6", display: "grid", gap: 20 }} data-sgi="rise">
            {service.intro.map((paragraph, idx) => (
              <p key={idx} className="sgi-prose--large">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {service.blocks.map((block, index) => (
        <ServiceBlockSection key={`${service.slug}-${index}`} block={block} index={index} />
      ))}

      <section className="sgi-section sgi-theme-ivory">
        <div className="sgi-container sgi-sticky-chapters">
          <div className="sgi-sticky-chapters__lead">
            <SigEyebrow>SIK SORULANLAR</SigEyebrow>
            <h2 className="sgi-h2" data-sgi="words">
              <SigWords text="Bu hizmetle ilgili temel sorular." />
            </h2>
            <p className="sgi-prose" data-sgi="rise">
              Projenize özgü teknik detaylar için doğrudan ekibimizle görüşebilirsiniz.
            </p>
          </div>

          <div style={{ gridColumn: "7 / span 6" }} data-sgi="rise">
            <ul className="sgi-faq-list">
              {service.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <li key={faq.q} className={`sgi-faq-item${isOpen ? " is-open" : ""}`}>
                    <button
                      type="button"
                      className="sgi-faq-btn"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    >
                      <span>0{idx + 1}</span>
                      <span>{faq.q}</span>
                      <i className="sgi-faq-plus" aria-hidden="true" />
                    </button>
                    <div className="sgi-faq-panel">
                      <div>
                        <p>{faq.a}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="sgi-section sgi-theme-limestone">
        <div className="sgi-container">
          <div className="sgi-header-split">
            <div>
              <SigEyebrow>İLGİLİ UZMANLIKLAR</SigEyebrow>
              <h2 className="sgi-h2" data-sgi="words">
                <SigWords text="Birlikte yürütülen diğer hizmet alanları." />
              </h2>
            </div>
          </div>

          <ol className="sgi-rows-col" data-sgi="stagger">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`/hizmetlerimiz/${item.slug}`}
                  className="sgi-row"
                  aria-label={`${item.title} hizmetini incele`}
                >
                  <span className="sgi-row__index">{item.n}</span>
                  <div className="sgi-row__content">
                    <h3>{item.title}</h3>
                    <p>{item.short}</p>
                  </div>
                  <span className="sgi-row__icon" aria-hidden="true">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SigClosing title={service.ctaTitle} secondaryTo="/hizmetlerimiz" secondaryLabel="TÜM HİZMETLERİMİZ" />
    </main>
  );
}

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = serviceBySlug(slug);
  if (!service) return <NotFoundPage />;
  return <ServiceDetail service={service} />;
}
