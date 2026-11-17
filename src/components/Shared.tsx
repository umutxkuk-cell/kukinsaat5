import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { phases, principles, projects } from "../data";
import { COMPANY } from "../company";

type Crumb = { label: string; to?: string };

export function SectionLabel({
  children,
  light = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  light?: boolean;
  as?: "div" | "h2" | "h3";
}) {
  return (
    <Tag className={`terminal-section-label ${light ? "light" : ""}`}>
      <i />
      {children}
    </Tag>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  meta,
  dark = false,
  crumbs,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  meta: string[];
  dark?: boolean;
  crumbs?: Crumb[];
}) {
  return (
    <section className={`page-hero${dark ? " page-hero--dark" : ""}`}>
      <div className="terminal-container">
        {crumbs && (
          <nav className="page-hero__crumbs" aria-label="Sayfa yolu">
            <ol>
              {crumbs.map((crumb, index) => {
                const current = index === crumbs.length - 1;
                return (
                  <li key={crumb.label}>
                    {crumb.to && !current ? (
                      <Link to={crumb.to}>{crumb.label}</Link>
                    ) : (
                      <span aria-current={current ? "page" : undefined}>{crumb.label}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        <p className="page-hero__eyebrow">
          <span /> {eyebrow}
        </p>
        <h1>{title}</h1>
        <p className="page-hero__lead">{lead}</p>
        <div className="page-hero__meta">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Approach({ id = "sistem" }: { id?: string }) {
  const [active, setActive] = useState(0);
  const select = (index: number) => setActive((index + phases.length) % phases.length);
  return (
    <section className="approach-section" id={id}>
      <div className="terminal-container">
        <div className="approach-intro" data-reveal data-motion="editorial">
          <SectionLabel as="h2">Çalışma Yöntemimiz</SectionLabel>
          <p>Keşiften teslime her projeyi aynı mühendislik disipliniyle yürüten beş aşamalı çalışma yöntemimiz:</p>
        </div>
        <ul
          className="feature-accordion"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") select(active + 1);
            if (event.key === "ArrowLeft") select(active - 1);
          }}
          aria-label="Çalışma aşamaları"
          data-reveal
          data-motion="mask"
          data-parallax="approach"
        >
          {phases.map((phase, index) => (
            <li key={phase.number} aria-label={`${index + 1} / ${phases.length}: ${phase.label}`}>
              <article
                className={active === index ? "expanded" : ""}
                aria-expanded={active === index}
                aria-label={phase.label}
                style={{ backgroundImage: `url(${phase.image})` }}
              >
                <button type="button" className="feature-hit" onClick={() => select(index)} aria-label={`${phase.label} bölümünü aç`} />
                <div className="feature-shade" />
                <div className="feature-collapsed">
                  <span>{phase.label}</span>
                  <small>0{index + 1}</small>
                </div>
                <div className="feature-expanded-content">
                  <div className="feature-title">
                    <p>
                      <span>{phase.label}</span>
                    </p>
                    <h3>{phase.title}</h3>
                  </div>
                  <p className="feature-description">{phase.text}</p>
                  <Link
                    to="/iletisim"
                    aria-label={`Projenizi anlatın: ${phase.short} aşaması için iletişim sayfasına git`}
                    data-ga-event="proje_anlat_tikla"
                    data-ga-category="iletisim"
                    data-ga-label={`Yöntem · ${phase.short}`}
                  >
                    PROJENİZİ ANLATIN <ArrowUpRight size={14} />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <div className="feature-position">
          <span>0{active + 1}</span>
          <i>
            <b style={{ width: `${((active + 1) / phases.length) * 100}%` }} />
          </i>
          <span>0{phases.length}</span>
          <div>
            <button type="button" onClick={() => select(active - 1)} aria-label="Önceki aşama">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => select(active + 1)} aria-label="Sonraki aşama">
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Philosophy({ id = "anlayis" }: { id?: string }) {
  return (
    <section className="industry-section" id={id}>
      <div className="terminal-container">
        <div data-reveal>
          <SectionLabel as="h2">Yönetim Anlayışımız</SectionLabel>
        </div>
        <div className="industry-quote" data-reveal data-motion="quote">
          <p>“İyi uygulama, sahada verilen küçük kararların toplamıdır. Önemli olan, bu kararların neden alındığını da kayda geçirmektir.”</p>
          <div>
            <span>{COMPANY.name.toLocaleUpperCase("tr-TR")}</span>
            <span>YÖNETİM İLKESİ</span>
          </div>
          <Link to="/iletisim" aria-label="Projenizi konuşalım: iletişim sayfasına git" data-ga-event="proje_konus_tikla" data-ga-category="iletisim">
            PROJENİZİ KONUŞALIM <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="principles" data-reveal data-motion="stagger">
          {principles.map((item) => (
            <div key={item.n}>
              <span>{item.n}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({
  id,
  label,
  title,
  text,
  faqs,
}: {
  id?: string;
  label?: string;
  title: string;
  text: string;
  faqs: { q: string; a: string }[];
}) {
  return (
    <section className="terminal-faq" id={id}>
      <div className="terminal-container faq-layout">
        <div className="faq-intro" data-reveal data-motion="slide-left">
          {label && <SectionLabel>{label}</SectionLabel>}
          <h2>{title}</h2>
          <p>{text}</p>
          <Link to="/iletisim" aria-label="Başka bir sorum var: iletişim sayfasına git" data-ga-event="soru_sor_tikla" data-ga-category="iletisim">
            SORUNUZU İLETİN <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="faq-items" data-reveal data-motion="faq">
          {faqs.map((faq, index) => (
            <details key={faq.q} open={index === 0}>
              <summary>
                <span>{faq.q}</span>
              </summary>
              <div>
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectShowcase() {
  return (
    <section className="showcase-section" id="projeler">
      <div className="terminal-container">
        <div className="showcase-head" data-reveal>
          <div>
            <SectionLabel>Projelerimiz</SectionLabel>
            <h2>Tamamlanmış ve doğrulanmış işler.</h2>
          </div>
          <p>Her proje; konum, yapı türü ve kapsam bilgisiyle birlikte yayımlanır.</p>
        </div>
        <div className="showcase-grid">
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              to={`/projelerimiz/${project.slug}`}
              className={`showcase-card showcase-${index % 4}`}
              data-reveal
              data-cursor="view"
              data-cursor-label="İNCELE ↗"
              aria-label={`${project.name} projesini incele`}
              data-ga-event="proje_incele_tikla"
              data-ga-category="projeler"
              data-ga-label={project.name}
            >
              <img src={project.image} alt={`${project.name} — ${project.category}, ${project.location}`} loading="lazy" />
              <div className="showcase-shade" />
              <span className="showcase-status">
                <i />
                {project.status.toLocaleUpperCase("tr-TR")}
              </span>
              <span className="showcase-open">
                <ArrowUpRight />
              </span>
              <div className="showcase-caption">
                <span className="micro-label">
                  {project.index} / {project.category.toLocaleUpperCase("tr-TR")}
                </span>
                <h3>{project.name}</h3>
                <p>
                  {project.location} · {project.year} · {project.area}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactCTA({ title = "Projenizi ilk görüşmede mühendislik gözüyle değerlendirelim." }: { title?: string }) {
  return (
    <section className="home-cta">
      <div className="terminal-container home-cta__inner" data-reveal data-motion="cta">
        <div>
          <SectionLabel light>İletişim</SectionLabel>
          <h2>{title}</h2>
        </div>
        <div className="home-cta__actions">
          <Link
            className="t-button t-primary"
            to="/iletisim"
            aria-label="İletişim sayfasına git"
            data-ga-event="gorusme_planla_tikla"
            data-ga-category="iletisim"
            data-ga-label="CTA · görüşme planla"
            data-cursor-magnetic
          >
            <span data-magnetic-inner>
              GÖRÜŞME PLANLA <ArrowUpRight size={14} />
            </span>
          </Link>
          <a
            className="home-cta__phone"
            href={`tel:${COMPANY.phoneHref}`}
            aria-label={`${COMPANY.name}'ı ara: ${COMPANY.phone}`}
            data-ga-event="telefon_tikla"
            data-ga-category="iletisim"
          >
            <Phone size={16} /> {COMPANY.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
