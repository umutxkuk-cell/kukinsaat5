import { useEffect } from "react";

/* Kanonik üretim adresi, çalışan kukinsaat.com alan adına sabitlenir. */
const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};
const rawSiteUrl = metaEnv.VITE_SITE_URL?.trim();
export const SITE_URL = (rawSiteUrl ? rawSiteUrl : "https://kukinsaat.com").replace(/\/+$/, "");
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-cover.jpg`;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: object[];
};

const setContent = (selector: string, value: string) => {
  document.querySelector(selector)?.setAttribute("content", value);
};

/* Her sayfa kendi başlık, açıklama, canonical, Open Graph ve yapılandırılmış veri bilgisini bildirir.
   *.pages.dev önizleme alan adlarında arama motoru indekslemesini otomatik olarak kapatır. */
export function usePageMeta({ title, description, path, image, noindex = false, jsonLd }: PageMeta) {
  const ldKey = jsonLd ? JSON.stringify(jsonLd) : "";
  const resolvedImage =
    image && !image.startsWith("data:")
      ? image.startsWith("http")
        ? image
        : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`
      : DEFAULT_OG_IMAGE;

  useEffect(() => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${SITE_URL}${normalizedPath}`;
    const isPreviewHost =
      typeof window !== "undefined" && window.location.hostname.toLowerCase().endsWith(".pages.dev");
    const shouldNoindex = noindex || isPreviewHost;

    document.title = title;
    setContent('meta[name="description"]', description);
    setContent('meta[name="robots"]', shouldNoindex ? "noindex, nofollow" : "index, follow");
    setContent('meta[property="og:title"]', title);
    setContent('meta[property="og:description"]', description);
    setContent('meta[property="og:url"]', url);
    setContent('meta[property="og:image"]', resolvedImage);
    setContent('meta[name="twitter:title"]', title);
    setContent('meta[name="twitter:description"]', description);
    setContent('meta[name="twitter:image"]', resolvedImage);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    document.querySelector('link[rel="alternate"][hreflang="tr"]')?.setAttribute("href", url);

    let script = document.getElementById("route-jsonld") as HTMLScriptElement | null;
    if (ldKey) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "route-jsonld";
        document.head.appendChild(script);
      }
      script.textContent = ldKey;
    } else {
      script?.remove();
    }
  }, [title, description, path, resolvedImage, noindex, ldKey]);

  useEffect(
    () => () => {
      document.getElementById("route-jsonld")?.remove();
    },
    [],
  );
}
