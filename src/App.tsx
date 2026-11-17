import { useState } from "react";
import { BrowserRouter, HashRouter, MemoryRouter, Navigate, Route, Routes, useParams } from "react-router";
import CustomCursor from "./components/CustomCursor";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RouteEffects from "./components/RouteEffects";
import SiteEntryIntro from "./components/SiteEntryIntro";
import CookieConsent from "./components/CookieConsent";
import HomePage from "./pages/Home";
import CorporatePage from "./pages/Corporate";
import ServicesPage from "./pages/Services";
import ServiceDetailPage from "./pages/ServiceDetail";
import { ProjectDetailPage, ProjectsPage } from "./pages/Projects";
import ContactPage from "./pages/ContactPage";
import KvkkPage from "./pages/Kvkk";
import NotFoundPage from "./pages/NotFound";
import "./sections.css";
import "./redesign.css";
import "./service-pages.css";
import "./header-nav-fix.css";

function LegacyServiceRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/hizmetlerimiz/${slug ?? ""}`} replace />;
}

function LegacyProjectRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/projelerimiz/${slug ?? ""}`} replace />;
}

const KNOWN_ROUTE_PREFIXES = [
  "/kurumsal",
  "/hizmetlerimiz",
  "/hizmetler",
  "/projelerimiz",
  "/projeler",
  "/proje",
  "/iletisim",
  "/kvkk",
  "/gizlilik-politikasi",
];

function isKnownAppPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/index.html" ||
    KNOWN_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  );
}

function resolveInitialMemoryEntry(pathname: string, hash: string): string {
  if (hash.startsWith("#/")) {
    return hash.slice(1) || "/";
  }
  if (pathname && pathname !== "/index.html" && isKnownAppPath(pathname)) {
    return `${pathname}${hash || ""}`;
  }
  return "/";
}

type RouterMode =
  | { mode: "browser" }
  | { mode: "hash" }
  | { mode: "memory"; initialEntry: string };

function detectRouterConfig(): RouterMode {
  if (typeof window === "undefined") {
    return { mode: "browser" };
  }

  try {
    const { protocol, origin: locOrigin, pathname, hash } = window.location;
    const winOrigin = typeof window.origin === "string" ? window.origin : "";
    const isHttp = protocol === "http:" || protocol === "https:";

    // srcdoc, blob:, data:, file: veya kısıtlı (null-origin) çerçevelerde bellek içi yönlendirici kullan
    if (!isHttp || locOrigin === "null" || winOrigin === "null") {
      return { mode: "memory", initialEntry: resolveInitialMemoryEntry(pathname, hash) };
    }

    let isEmbeddedFrame = false;
    try {
      isEmbeddedFrame = window.self !== window.top;
    } catch {
      isEmbeddedFrame = true;
    }

    // Single-file preview paths cannot rely on a server fallback. Hash URLs
    // stay bookmarkable there; real Pages domains keep clean browser URLs.
    if (pathname.endsWith("/index.html") && pathname !== "/index.html") {
      return { mode: "hash" };
    }
    if (isEmbeddedFrame && !isKnownAppPath(pathname)) {
      return { mode: "hash" };
    }

    return { mode: "browser" };
  } catch {
    return { mode: "memory", initialEntry: "/" };
  }
}

export function SiteRoutes({ mode = "browser" }: { mode?: RouterMode["mode"] }) {
  return (
    <>
      <SiteEntryIntro />
      <RouteEffects mode={mode} />
      <CustomCursor />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/index.html" element={<HomePage />} />
        <Route path="/kurumsal" element={<CorporatePage />} />
        <Route path="/hizmetlerimiz" element={<ServicesPage />} />
        <Route path="/hizmetler" element={<ServicesPage />} />
        <Route path="/hizmetlerimiz/:slug" element={<ServiceDetailPage />} />
        <Route path="/projelerimiz" element={<ProjectsPage />} />
        <Route path="/projelerimiz/:slug" element={<ProjectDetailPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/kvkk" element={<KvkkPage />} />
        <Route path="/gizlilik-politikasi" element={<Navigate to="/kvkk" replace />} />
        <Route path="/hizmetler/:slug" element={<LegacyServiceRedirect />} />
        <Route path="/projeler" element={<Navigate to="/projelerimiz" replace />} />
        <Route path="/proje/:slug" element={<LegacyProjectRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <CookieConsent />
    </>
  );
}

export default function App() {
  const [routerConfig] = useState<RouterMode>(detectRouterConfig);

  if (routerConfig.mode === "memory") {
    return (
      <MemoryRouter initialEntries={[routerConfig.initialEntry]}>
        <SiteRoutes mode="memory" />
      </MemoryRouter>
    );
  }

  if (routerConfig.mode === "hash") {
    return (
      <HashRouter>
        <SiteRoutes mode="hash" />
      </HashRouter>
    );
  }

  return (
    <BrowserRouter>
      <SiteRoutes />
    </BrowserRouter>
  );
}
