import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

/* Eski #/ tabanlı bağlantıları gerçek yollara taşır; böylece dışarıdan gelen eski linkler kırılmaz. */
const legacyRoutes: Record<string, string> = {
  "#": "/",
  "#top": "/",
  "#/kurumsal": "/kurumsal",
  "#/hizmetler": "/hizmetlerimiz",
  "#/hizmetlerimiz": "/hizmetlerimiz",
  "#/projeler": "/projelerimiz",
  "#/projelerimiz": "/projelerimiz",
  "#/iletisim": "/iletisim",
  "#kurumsal": "/kurumsal",
  "#hizmetler": "/hizmetlerimiz",
  "#iletisim": "/iletisim",
  "#sistem": "/kurumsal#calisma-yontemi",
  "#anlayis": "/kurumsal#yonetim-anlayisi",
};

function legacyTarget(hash: string): string | null {
  let raw: string;
  try {
    raw = decodeURIComponent(hash).replace(/\/+$/, "");
  } catch {
    return null;
  }
  if (!raw) return null;
  if (raw.startsWith("#/hizmetler/")) return `/hizmetlerimiz/${raw.slice("#/hizmetler/".length)}`;
  if (raw.startsWith("#/proje/")) return `/projelerimiz/${raw.slice("#/proje/".length)}`;
  return legacyRoutes[raw] ?? null;
}

/* Sayfa geçişlerinde kaydırma, anchor hedefleri ve kademeli görünen öğeleri yönetir. */
export default function RouteEffects({ mode = "browser" }: { mode?: "browser" | "hash" | "memory" }) {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "hash") return;
    if (mode === "memory") {
      const route = `${pathname}${hash}`;
      const onHashChange = () => {
        const value = window.location.hash;
        if (!value.startsWith("#/")) return;
        const target = legacyTarget(value) ?? value.slice(1);
        if (target !== route) navigate(target, { replace: true });
      };
      try {
        const nextHash = `#${route}`;
        if (window.location.hash !== nextHash) window.location.hash = nextHash;
      } catch {
        // An opaque sandbox may forbid even fragment updates; routing still works in memory.
      }
      window.addEventListener("hashchange", onHashChange);
      return () => window.removeEventListener("hashchange", onHashChange);
    }
    const redirect = () => {
      const target = legacyTarget(window.location.hash);
      if (target) navigate(target, { replace: true });
    };
    redirect();
    window.addEventListener("hashchange", redirect);
    return () => window.removeEventListener("hashchange", redirect);
  }, [mode, pathname, hash, navigate]);

  useEffect(() => {
    if (hash) {
      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 90);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -30px" },
    );
    const revealPassed = () =>
      elements.forEach((element) => {
        if (element.getBoundingClientRect().bottom < window.innerHeight * 0.92) element.classList.add("is-visible");
      });
    const timer = window.setTimeout(() => {
      elements.forEach((element) => observer.observe(element));
      revealPassed();
    }, 30);
    window.addEventListener("scroll", revealPassed, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", revealPassed);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
