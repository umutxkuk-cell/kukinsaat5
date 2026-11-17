import {
  Fragment,
  useEffect,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { HD_PAGES } from "../assets/plates";
import { COMPANY } from "../company";
import { assetUrl } from "../utils/assetUrl";

export const sgVars = (vars: Record<string, string | number>) => vars as unknown as CSSProperties;

export function SigWords({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          <span className="sgi-word">
            <span style={sgVars({ "--wi": index })}>{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export function SigEyebrow({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <div className="sgi-eyebrow">
      {index ? <span className="sgi-eyebrow__index">{index}</span> : null}
      <i aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function SigCrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="sgi-crumbs" aria-label="Sayfa yolu">
      <ol>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.label}>
              {item.to && !isLast ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* Ana Sayfa BÖLÜM 06 (ClosingExperience) ile birebir aynı DNA ve oranda kapanış sahnesi */
export function SigClosing({
  index = "SON",
  title,
  lead = "Arsanız, projeniz veya devam eden işiniz için Başiskele merkezimizde ya da sahada bir araya gelebiliriz.",
  secondaryTo = "/hizmetlerimiz",
  secondaryLabel = "HİZMETLERİMİZ",
  visual = true,
}: {
  index?: string;
  title: string;
  lead?: string;
  secondaryTo?: string;
  secondaryLabel?: string;
  /* false: yapı fotoğrafı gösterilmeyen sayfalar (ör. Projelerimiz) için görselsiz kapanış */
  visual?: boolean;
}) {
  return (
    <section className={`sgi-section sgi-theme-obsidian sgi-closing${visual ? "" : " sgi-closing--plain"}`}>
      <div className="sgi-container">
        {visual && (
          <figure className="sgi-closing__visual" data-sgi="curtain">
            <img
              src={assetUrl(HD_PAGES.contactColonnade)}
              alt="Alacakaranlıkta sıcak aydınlatmalı kireçtaşı kolonaddan sakin ufuk çizgisine bakış — mimari konsept görseli"
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              data-sgi-parallax="0.05"
            />
            <div className="sgi-closing__fade" aria-hidden="true" />
            <figcaption className="sgi-badge">Mimari Konsept Görseli</figcaption>
          </figure>
        )}

        <div className="sgi-closing__body">
          <SigEyebrow index={index}>İLETİŞİM</SigEyebrow>
          <h2 className="sgi-display sgi-closing__title" data-sgi="words">
            <SigWords text={title} />
          </h2>

          <div className="sgi-closing__footer" data-sgi="rise">
            <p className="sgi-prose">{lead}</p>
            <div className="sgi-closing__actions">
              <div className="sgi-closing__buttons">
                <Link
                  className="t-button t-primary sgi-cta-btn"
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
                <Link className="sgi-ghost-btn" to={secondaryTo}>
                  {secondaryLabel}
                </Link>
              </div>
              <div className="sgi-closing__direct">
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

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/* KUK İnşaat — Signature Inner Pages Motion System
   Ana Sayfa (useSignatureMotion) ile aynı fizik eğrileriyle çalışır;
   ek olarak koyu açılış sahnelerinde Header'ın kendi füme cam (sun) modunu yönetir
   ve React yeniden çizimlerinden etkilenmemesi için data-sgi-in="1" kullanır. */
export function useSigInnerMotion(
  root: RefObject<HTMLElement | null>,
  heroToneRef?: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    const revealNodes = Array.from(scope.querySelectorAll<HTMLElement>("[data-sgi]"));
    const apertureNodes = Array.from(scope.querySelectorAll<HTMLElement>("[data-sgi-aperture]"));
    const parallaxNodes = Array.from(scope.querySelectorAll<HTMLElement>("[data-sgi-parallax]"));

    const markIn = (node: HTMLElement) => {
      node.dataset.sgiIn = "1";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealNodes.forEach(markIn);
      apertureNodes.forEach((node) => node.style.setProperty("--ap", "1"));
      delete document.documentElement.dataset.heroTone;
      return;
    }

    const watched = new Map<Element, HTMLElement[]>();
    const register = (target: Element, node: HTMLElement) => {
      const list = watched.get(target);
      if (list) list.push(node);
      else watched.set(target, [node]);
    };

    revealNodes.forEach((node) => {
      register(node, node);
      if (node.dataset.sgi === "curtain" && node.parentElement) {
        register(node.parentElement, node);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          watched.get(entry.target)?.forEach(markIn);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );

    Array.from(watched.keys()).forEach((target) => observer.observe(target));

    let currentTone = "";
    let raf = 0;

    const updateScroll = () => {
      raf = 0;
      const vh = window.innerHeight;
      const desktop = window.innerWidth > 900;

      if (heroToneRef?.current) {
        const hRect = heroToneRef.current.getBoundingClientRect();
        const nextTone = hRect.bottom > 92 && hRect.top < 92 ? "sun" : "";
        if (nextTone !== currentTone) {
          currentTone = nextTone;
          if (nextTone) document.documentElement.dataset.heroTone = nextTone;
          else delete document.documentElement.dataset.heroTone;
        }
      } else if (currentTone) {
        currentTone = "";
        delete document.documentElement.dataset.heroTone;
      }

      revealNodes.forEach((node) => {
        if (node.dataset.sgiIn === "1") return;
        const target = node.dataset.sgi === "curtain" && node.parentElement ? node.parentElement : node;
        if (target.getBoundingClientRect().top < vh * 0.95) {
          markIn(node);
        }
      });

      apertureNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const raw = (vh * 0.94 - rect.top) / Math.max(1, vh * 0.68);
        node.style.setProperty("--ap", clamp(raw, 0, 1).toFixed(4));
      });

      parallaxNodes.forEach((node) => {
        if (!desktop) {
          node.style.setProperty("--py", "0px");
          return;
        }
        const rect = node.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > vh + 120) return;
        const speed = parseFloat(node.dataset.sgiParallax ?? "0.05");
        const delta = rect.top + rect.height / 2 - vh / 2;
        node.style.setProperty("--py", `${clamp(-delta * speed, -26, 26).toFixed(1)}px`);
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(updateScroll);
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      delete document.documentElement.dataset.heroTone;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, heroToneRef, ...deps]);
}
