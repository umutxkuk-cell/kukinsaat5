import { useEffect, useRef, useState } from "react";
import { openCookiePreferences } from "../consent";
import { KVKK_META, KVKK_REGISTRY, KVKK_SECTIONS } from "../legal/kvkk";
import { KvkkRegistry, KvkkSections } from "../legal/KvkkDocument";
import { SITE_URL, usePageMeta } from "../seo";
import { SigCrumbs, SigEyebrow } from "../signature/motion";
import "../signature/signature.css";
import "../legal/legal.css";

export default function KvkkPage() {
  usePageMeta({
    title: "Gizlilik Politikası & KVKK Aydınlatma Metni | KUK İnşaat",
    description:
      "KUK İnşaat Gizlilik Politikası ve KVKK Aydınlatma Metni: işlenen kişisel veriler, işleme amaçları, aktarım, çerezler, saklama süreleri ve veri sahibinin hakları.",
    path: "/kvkk",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Gizlilik Politikası & KVKK", item: `${SITE_URL}/kvkk` },
        ],
      },
    ],
  });

  const docRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string>(KVKK_SECTIONS[0].n);

  /* İçindekiler: okunan bölümü işaretler. */
  useEffect(() => {
    const root = docRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-lg-section]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current = nodes[0]?.getAttribute("data-lg-section") ?? "01";
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= line) current = node.getAttribute("data-lg-section") ?? current;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* Düğme + scrollIntoView: adres çubuğundaki hash'e dokunmaz, her yönlendirici modunda çalışır. */
  const jump = (n: string) => {
    document.getElementById(`kvkk-${n}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="sgi-page sgi-theme-limestone lg-page">
      <header className="lg-hero">
        <div className="sgi-container">
          <SigCrumbs items={[{ label: "Ana Sayfa", to: "/" }, { label: "Gizlilik Politikası & KVKK" }]} />

          <div className="lg-hero__grid">
            <div className="lg-hero__main">
              <SigEyebrow>{KVKK_META.kicker}</SigEyebrow>
              <h1 className="lg-hero__title">
                Gizlilik Politikası <span className="lg-amp">&amp;</span> KVKK Aydınlatma Metni
              </h1>
              <p className="lg-hero__lead">{KVKK_META.lead}</p>
            </div>

            <div className="lg-hero__side">
              <dl className="lg-hero__meta">
                <div>
                  <dt>Son güncelleme</dt>
                  <dd>{KVKK_META.updated}</dd>
                </div>
                <div>
                  <dt>Başvuru (KEP)</dt>
                  <dd>{KVKK_REGISTRY.kep}</dd>
                </div>
              </dl>
              <button type="button" className="lg-hero__cookie" onClick={openCookiePreferences}>
                Çerez tercihlerini aç
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="sgi-container lg-layout">
        <nav className="lg-toc" aria-label="İçindekiler">
          <span className="lg-toc__title">İçindekiler</span>
          <ol>
            {KVKK_SECTIONS.map((section) => (
              <li key={section.n}>
                <button
                  type="button"
                  className={`lg-toc__btn${active === section.n ? " is-active" : ""}`}
                  aria-current={active === section.n ? "true" : undefined}
                  onClick={() => jump(section.n)}
                >
                  <span>{section.n}</span>
                  <span>{section.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <article className="lg-doc" ref={docRef}>
          <p className="lg-preamble">{KVKK_META.preamble}</p>
          <KvkkSections />
          <KvkkRegistry />
        </article>
      </div>
    </main>
  );
}
