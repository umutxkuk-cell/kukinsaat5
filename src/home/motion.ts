import { useEffect, type RefObject } from "react";

/* KUK İnşaat — Signature Homepage Motion System
   Tek bir gözlemci ve hafif bir kaydırma döngüsü üzerinden çalışır:
   - data-sig="words" | "rise" | "curtain" | "hairline" | "stagger": sahneye girince .is-in alır.
   - data-sig-aperture: kaydırma ilerlemesini 0–1 aralığında --ap değişkenine yazar (sinematik kadraj açılışı).
   - data-sig-parallax="0.06": yalnızca masaüstünde hafif katmanlı paralaks (--py) uygular. */

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function useSignatureMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    const revealNodes = Array.from(scope.querySelectorAll<HTMLElement>("[data-sig]"));
    const apertureNodes = Array.from(scope.querySelectorAll<HTMLElement>("[data-sig-aperture]"));
    const parallaxNodes = Array.from(scope.querySelectorAll<HTMLElement>("[data-sig-parallax]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealNodes.forEach((node) => node.classList.add("is-in"));
      apertureNodes.forEach((node) => node.style.setProperty("--ap", "1"));
      return;
    }

    /* Maskelenmiş (curtain) görsellerde hem öğenin kendisi hem kapsayıcısı izlenir. */
    const watched = new Map<Element, HTMLElement[]>();
    const register = (target: Element, node: HTMLElement) => {
      const list = watched.get(target);
      if (list) list.push(node);
      else watched.set(target, [node]);
    };

    revealNodes.forEach((node) => {
      register(node, node);
      if (node.dataset.sig === "curtain" && node.parentElement) {
        register(node.parentElement, node);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          watched.get(entry.target)?.forEach((node) => node.classList.add("is-in"));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    Array.from(watched.keys()).forEach((target) => observer.observe(target));

    let raf = 0;
    const updateScroll = () => {
      raf = 0;
      const vh = window.innerHeight;
      const desktop = window.innerWidth > 900;

      revealNodes.forEach((node) => {
        if (node.classList.contains("is-in")) return;
        const target = node.dataset.sig === "curtain" && node.parentElement ? node.parentElement : node;
        if (target.getBoundingClientRect().top < vh * 0.94) {
          node.classList.add("is-in");
        }
      });

      apertureNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const raw = (vh * 0.92 - rect.top) / Math.max(1, vh * 0.72);
        node.style.setProperty("--ap", clamp(raw, 0, 1).toFixed(4));
      });

      parallaxNodes.forEach((node) => {
        if (!desktop) {
          node.style.setProperty("--py", "0px");
          return;
        }
        const rect = node.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) return;
        const speed = parseFloat(node.dataset.sigParallax ?? "0.05");
        const delta = rect.top + rect.height / 2 - vh / 2;
        node.style.setProperty("--py", `${clamp(-delta * speed, -28, 28).toFixed(1)}px`);
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
    };
  }, [root]);
}
