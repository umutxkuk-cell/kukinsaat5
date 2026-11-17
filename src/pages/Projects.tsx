import { useRef } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects, type Project } from "../data";
import { MassModel, type ModelKind } from "../projects/models";
import { SITE_URL, usePageMeta } from "../seo";
import { services } from "../services";
import {
  SigClosing,
  SigCrumbs,
  SigEyebrow,
  SigWords,
  useSigInnerMotion,
} from "../signature/motion";
import NotFoundPage from "./NotFound";
import "../signature/signature.css";
import "../projects/projects.css";

/* PROJELERİMİZ
   Yayımlanmış proje yokken yapı fotoğrafı gösterilmez. Sayfa; üç çalışma alanını tonlu,
   ölçeksiz kütle modelleriyle (fotoğraf değil, şematik model) ve referans ilkesini anlatır.
   projects dizisine kayıt eklendiğinde "Yayımlanan Projeler" listesi kendiliğinden görünür. */

const workAreas: {
  n: string;
  kind: ModelKind;
  tag: string;
  title: string;
  summary: string;
  focus: string;
  serviceSlug: string;
}[] = [
  {
    n: "01",
    kind: "konut",
    tag: "KONUT YAPILARI",
    title: "Konut Yapıları",
    summary:
      "Müstakil konutlardan çok katlı yaşam yapılarına kadar; arsanın yönelimini, mahremiyet kurgusunu ve cephe-iç mekân sürekliliğini taşıyıcı sistem kararlarıyla eşzamanlı ele alıyoruz.",
    focus: "Oran, doğal ışık ve uzun ömürlü detay bütünlüğü",
    serviceSlug: "insaat-ve-yapi-uygulamalari",
  },
  {
    n: "02",
    kind: "ticari",
    tag: "TİCARİ YAPILAR",
    title: "Ticari Yapılar",
    summary:
      "Ticari yapılarda işletme dayanımı ve açılış takvimi yatırım kararının doğrudan parçasıdır. Yoğun mekanik ve elektrik altyapısını taşıyıcı sistemle çakışmadan çözüyoruz.",
    focus: "Esnek mekân kurgusu ve öngörülebilir teslim takvimi",
    serviceSlug: "proje-ve-uygulama-sureclerinin-yonetimi",
  },
  {
    n: "03",
    kind: "karma",
    tag: "KARMA KULLANIM",
    title: "Karma Kullanımlı Yapılar",
    summary:
      "Ticari birimler ile yaşam alanlarını aynı yapıda buluşturan projelerde; giriş-dolaşım ayrımını, şaft sürekliliğini ve akustik sınırları yapım öncesinde tüm disiplinlerle netleştiriyoruz.",
    focus: "Farklı işlevlerin tek yapıda sessiz uyumu",
    serviceSlug: "proje-gelistirme-ve-teknik-koordinasyon",
  },
];

const publicationGates = [
  {
    n: "01",
    title: "Saha imalatının eksiksiz kapanması",
    text: "Devam eden, yarım kalmış veya kabul sürecini tamamlamamış hiçbir yapıyı bitmiş proje referansı gibi sunmuyoruz.",
  },
  {
    n: "02",
    title: "Gerçek konum, yıl ve kapsam bilgisi",
    text: "Yayımlanan her projede ilçe, yapı türü, tamamlanma yılı ve KUK İnşaat'ın üstlendiği gerçek hizmet sınırları açıkça belirtilir.",
  },
  {
    n: "03",
    title: "İşveren gizliliği ve yayım mutabakatı",
    text: "İşverenle yazılı yayım mutabakatı bulunmayan özel konut veya ticari yatırımlar kamuya açık portföye dahil edilmez.",
  },
];

const pad = (value: number) => String(value).padStart(2, "0");

export function ProjectsPage() {
  usePageMeta({
    title: "Projelerimiz ve Referans Yaklaşımımız | KUK İnşaat",
    description:
      "KUK İnşaat portföy ve referans ilkesi: yalnızca tamamlanmış ve bilgileri doğrulanmış projeler yayımlanır. Kocaeli konut, ticari ve karma kullanım çalışma alanlarımız.",
    path: "/projelerimiz",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Projelerimiz", item: `${SITE_URL}/projelerimiz` },
        ],
      },
    ],
  });

  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useSigInnerMotion(rootRef, heroRef);

  const hasProjects = projects.length > 0;
  /* Yayımlanmış proje varsa liste 03 numarayı alır; referans ilkesi bir kayar. */
  const shift = hasProjects ? 1 : 0;

  return (
    <main className="sgi-page prj-page" ref={rootRef}>
      {/* 01–02 — AÇILIŞ VE ÜÇ ÇALIŞMA ALANI (koyu zemin, tonlu kütle modelleri) */}
      <section className="prj-hero sgi-theme-obsidian" ref={heroRef}>
        <div className="prj-hero__inner">
          <div className="prj-hud">
            <SigCrumbs items={[{ label: "Ana Sayfa", to: "/" }, { label: "Projelerimiz" }]} />
            <span className="prj-coord">
              <i aria-hidden="true" />
              ÇALIŞMA ALANLARI · REFERANS İLKESİ
            </span>
          </div>

          <div className="prj-hero__grid">
            <div className="prj-hero__lead">
              <SigEyebrow index="01">PROJELERİMİZ</SigEyebrow>
              <h1 className="prj-hero__title" data-sgi="words">
                <SigWords text="Yalnızca tamamlanmış ve doğrulanmış yapılar." />
              </h1>
            </div>
            <p className="prj-hero__sub" data-sgi="rise">
              Tamamlanmamış ya da başka bir firmaya ait hiçbir çalışmayı referans olarak göstermiyoruz. Aşağıda{" "}
              <em>çalışma alanlarımızı</em> ve bir yapının burada yayımlanma koşullarını bulursunuz.
            </p>
          </div>

          <div className="prj-trio" id="calisma-alanlarimiz">
            {workAreas.map((area) => {
              const service = services.find((item) => item.slug === area.serviceSlug);
              return (
                <article key={area.n} className="prj-panel" id={`calisma-alani-${area.n}`} data-sgi="rise">
                  <figure className="prj-panel__model">
                    <MassModel kind={area.kind} />
                    <figcaption>
                      <span>Şematik model</span>
                      <span>Ölçeksiz</span>
                    </figcaption>
                  </figure>

                  <div className="prj-panel__body">
                    <SigEyebrow index={area.n}>{area.tag}</SigEyebrow>
                    <h2 className="prj-panel__title">{area.title}</h2>
                    <p className="prj-panel__text">{area.summary}</p>
                    <div className="prj-panel__focus">{area.focus}</div>
                    {service && (
                      <div className="prj-panel__link">
                        <Link className="sgi-link" to={`/hizmetlerimiz/${service.slug}`}>
                          <span>İlgili hizmet: {service.title}</span>
                          <ArrowUpRight size={15} />
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* YAYIMLANAN PROJELER — yalnızca kayıt varsa görünür */}
      {hasProjects && (
        <section className="sgi-section sgi-theme-limestone sgi-after-hero" id="yayimlanan-projeler">
          <div className="sgi-container">
            <div className="sgi-header-split">
              <div>
                <SigEyebrow index="03">YAYIMLANAN PROJELER</SigEyebrow>
                <h2 className="sgi-h2" data-sgi="words">
                  <SigWords text="Doğrulanmış proje kayıtları." />
                </h2>
              </div>
            </div>
            <ol className="sgi-rows-col" style={{ gridColumn: "auto" }} data-sgi="stagger">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link
                    to={`/projelerimiz/${project.slug}`}
                    className="sgi-row"
                    data-cursor="view"
                    data-cursor-label="İNCELE ↗"
                  >
                    <span className="sgi-row__index">{project.index}</span>
                    <div className="sgi-row__content">
                      <h3>{project.name}</h3>
                      <p>
                        {project.category} · {project.location} · {project.year} · {project.area}
                      </p>
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
      )}

      {/* REFERANS İLKEMİZ — BİR YAPI BURADA NE ZAMAN YAYIMLANIR */}
      <section
        className={`sgi-section ${hasProjects ? "sgi-theme-ivory" : "sgi-theme-limestone sgi-after-hero"}`}
        id="referans-ilkemiz"
      >
        <div className="sgi-container sgi-sticky-chapters">
          <div className="sgi-sticky-chapters__lead">
            <SigEyebrow index={pad(3 + shift)}>REFERANS İLKEMİZ</SigEyebrow>
            <h2 className="sgi-h2" data-sgi="words">
              <SigWords text="Bir projenin arşivimize girmesi için üç şeffaf koşul." />
            </h2>
            <p className="sgi-prose" data-sgi="rise">
              Güvenilir bir portföy, abartılı görsellerle değil; yerinde doğrulanabilir yapım kayıtlarıyla kurulur.
            </p>
          </div>

          <div className="sgi-sticky-chapters__list" style={{ borderTop: 0 }}>
            <ol style={{ borderTop: "1px solid var(--sgi-border)" }} data-sgi="stagger">
              {publicationGates.map((gate) => (
                <li key={gate.n} className="sgi-chapter-item">
                  <div className="sgi-chapter-item__head">
                    <span>{gate.n}</span>
                    <h3>{gate.title}</h3>
                  </div>
                  <p>{gate.text}</p>
                </li>
              ))}
            </ol>

            <div className="pj-note" data-sgi="rise">
              <p>Bu üç koşulu tamamlayan her yapı; gerçek konum, yıl ve kapsam bilgisiyle bu sayfada yayımlanır.</p>
              <Link className="sgi-link" to="/iletisim">
                <span>Projenizi Konuşalım</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SigClosing
        index={pad(4 + shift)}
        title="Planladığınız yapıyı mühendislik ve uygulama gözüyle değerlendirelim."
        secondaryTo="/hizmetlerimiz"
        secondaryLabel="HİZMET ALANLARIMIZ"
        visual={false}
      />
    </main>
  );
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <NotFoundPage />;
  return <ProjectDetail project={project} />;
}

function ProjectDetail({ project }: { project: Project }) {
  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useSigInnerMotion(rootRef, heroRef, [project.slug]);

  usePageMeta({
    title: `${project.name} | Projelerimiz | KUK İnşaat`,
    description: project.summary,
    path: `/projelerimiz/${project.slug}`,
  });

  return (
    <main className="sgi-page" ref={rootRef}>
      <section className="sgi-cinema-hero sgi-cinema-hero--compact" ref={heroRef}>
        <figure className="sgi-cinema-hero__bg">
          <img src={project.image} alt={`${project.name} — ${project.category}`} loading="eager" decoding="async" />
          <div className="sgi-cinema-hero__shade" aria-hidden="true" />
        </figure>
        <div className="sgi-cinema-hero__inner">
          <SigCrumbs
            items={[
              { label: "Ana Sayfa", to: "/" },
              { label: "Projelerimiz", to: "/projelerimiz" },
              { label: project.name },
            ]}
          />
          <div className="sgi-cinema-hero__grid">
            <div className="sgi-cinema-hero__main">
              <SigEyebrow index={project.index}>
                {project.category} · {project.location}
              </SigEyebrow>
              <h1 className="sgi-display">{project.name}</h1>
              <p className="sgi-prose--large">{project.summary}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sgi-section sgi-theme-limestone sgi-after-hero">
        <div className="sgi-container sgi-sticky-chapters">
          <div className="sgi-sticky-chapters__lead">
            <SigEyebrow index="01">GENEL BAKIŞ</SigEyebrow>
            <h2 className="sgi-h2">Mimari kararlar ve uygulama notları.</h2>
          </div>
          <div style={{ gridColumn: "7 / span 6" }}>
            <p className="sgi-prose--large">{project.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginTop: 36 }}>
              <Link className="sgi-link" to="/projelerimiz">
                <ArrowLeft size={14} /> <span>Tüm Projeler</span>
              </Link>
              {next && next.slug !== project.slug && (
                <Link className="sgi-link" to={`/projelerimiz/${next.slug}`}>
                  <span>Sonraki Proje: {next.name}</span> <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <SigClosing title="Benzer bir yapı için kapsamı birlikte değerlendirelim." />
    </main>
  );
}
