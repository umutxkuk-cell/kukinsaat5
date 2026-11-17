import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { projects } from "../data";
import { services } from "../services";
import { COMPANY } from "../company";

type MenuLink = { label: string; to: string; note?: string };
type NavItem = {
  label: string;
  overviewLabel: string;
  overviewTo: string;
  activePrefixes: string[];
  title: string;
  text: string;
  links: MenuLink[];
};

const navItems: NavItem[] = [
  {
    label: "KURUMSAL",
    overviewLabel: "KURUMSAL SAYFASI",
    overviewTo: "/kurumsal",
    activePrefixes: ["/kurumsal"],
    title: "Mimari duyarlılık ve mühendislik disiplini.",
    text: "KUK İnşaat; Kocaeli ve çevresinde proje, mühendislik ve uygulama süreçlerini tek bir standart ve açık sorumlulukla yürütür.",
    links: [
      { label: "Kurumsal Genel Bakış", to: "/kurumsal", note: "Kimliğimiz ve şirket bilgileri" },
      { label: "Yönetim Anlayışımız", to: "/kurumsal#yonetim-anlayisi", note: "İlkelerimiz ve karar düzeni" },
      { label: "Çalışma Yöntemimiz", to: "/kurumsal#calisma-yontemi", note: "Keşiften teslime süreç yapısı" },
      { label: "İletişim", to: "/iletisim", note: "Başiskele merkez ve ön görüşme" },
    ],
  },
  {
    label: "HİZMETLER",
    overviewLabel: "TÜM HİZMETLERİMİZ",
    overviewTo: "/hizmetlerimiz",
    activePrefixes: ["/hizmetlerimiz", "/hizmetler"],
    title: "Beş uzmanlık, tek bir bütün.",
    text: "İhtiyacınız ister tek bir aşamada ister projenin tamamında olsun; kapsamı baştan netleştirir ve süreci özenle yönetiriz.",
    links: [
      { label: "Hizmetlerimiz Genel Bakış", to: "/hizmetlerimiz", note: "Beş hizmet alanının tamamı" },
      ...services.map((service) => ({
        label: service.title,
        to: `/hizmetlerimiz/${service.slug}`,
        note: service.note,
      })),
    ],
  },
  {
    label: "PROJELERİMİZ",
    overviewLabel: "PROJE PORTFÖYÜ",
    overviewTo: "/projelerimiz",
    activePrefixes: ["/projelerimiz", "/projeler", "/proje"],
    title: "Yalnızca doğrulanmış yapılar.",
    text: "Tamamlanmamış veya bilgileri teyit edilmemiş hiçbir çalışmayı referans olarak yayımlamıyoruz.",
    links: [
      { label: "Projelerimiz Sayfası", to: "/projelerimiz", note: "Portföy ve referans yaklaşımımız" },
      ...projects.map((project) => ({
        label: project.name,
        to: `/projelerimiz/${project.slug}`,
        note: project.location,
      })),
      { label: "Hizmet Alanlarımız", to: "/hizmetlerimiz", note: "Konut, ticari ve karma kullanım" },
      { label: "Projenizi Konuşalım", to: "/iletisim", note: "İlk değerlendirme ve görüşme" },
    ],
  },
];

export function Logo() {
  return (
    <span className="brand">
      <svg className="brand-mark" viewBox="0 0 329.28 372.5" aria-hidden="true" focusable="false">
        <path
          fillRule="evenodd"
          d="M297.08 261.26 164.79 341.36 31 259.41V113.09L164.79 30.22l132.29 82.41ZM164.79 3.36 6.48 98.83v174.45l158.31 95.86 156.35-95.86V98.83Z"
        />
        <path d="M67.56 173.29 101.8 109.85V89.02L74.5 105.22l-45.35 82.42.46 49.08 24.07-38.43 49.97 83.8v-46.76Z" />
        <path d="m253.14 105.22-27.3-16.2v20.83l34.25 63.44-36.1 62.04v46.76l49.98-83.8 24.06 38.43.46-49.08Z" />
        <path d="M183.24 62.6v204.68l-18.51 12.96-18.97-12.96.93-204.68-26.38 15.31V289.5l43.96 29.17 44.42-28.24V76.98Z" />
      </svg>
      <span className="brand-word">
        {COMPANY.brand}
        <small>{COMPANY.descriptor}</small>
      </span>
    </span>
  );
}

export default function Header() {
  const { pathname, hash } = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const lastMenuInput = useRef<"mouse" | "touch" | "keyboard">("keyboard");
  const activeMenuRef = useRef<number | null>(null);

  useEffect(() => {
    activeMenuRef.current = activeMenu;
  }, [activeMenu]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activeMenuRef.current !== null) {
          headerRef.current?.querySelectorAll<HTMLButtonElement>(".header-nav-toggle")[activeMenuRef.current]?.focus();
        }
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    const onOutsidePointer = (event: PointerEvent) => {
      if (headerRef.current && event.target instanceof Node && !headerRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutsidePointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutsidePointer);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 28);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (item: NavItem) =>
    item.activePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  const closeMenus = () => {
    setActiveMenu(null);
    setMobileOpen(false);
  };

  const handleSubLinkClick = (to: string) => {
    closeMenus();
    const hashIndex = to.indexOf("#");
    if (hashIndex !== -1) {
      const targetPath = to.slice(0, hashIndex) || "/";
      const targetId = to.slice(hashIndex + 1);
      if (targetPath === pathname && targetId) {
        window.setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 60);
      }
    }
  };

  return (
    <header
      ref={headerRef}
      className={`terminal-header${scrolled ? " is-scrolled" : ""}${mobileOpen ? " is-menu-open" : ""}`}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="terminal-header-bar">
        <Link className="header-logo" to="/" aria-label={`${COMPANY.name} ana sayfa`} onClick={closeMenus}>
          <Logo />
        </Link>
        <nav className="header-nav" aria-label="Ana navigasyon">
          {navItems.map((item, index) => {
            const active = isActive(item);
            const expanded = activeMenu === index;
            return (
              <div
                className={`header-nav-item${active ? " is-active" : ""}`}
                key={item.label}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "touch") setActiveMenu(index);
                }}
              >
                <Link
                  className="header-nav-link header-nav-main"
                  to={item.overviewTo}
                  aria-current={active ? "page" : undefined}
                  onFocus={() => setActiveMenu(index)}
                  onClick={closeMenus}
                >
                  {item.label}
                </Link>
                <button
                  className="header-nav-toggle"
                  type="button"
                  aria-haspopup="true"
                  aria-controls={expanded ? "mega-menu" : undefined}
                  aria-label={`${item.label} alt menüsü`}
                  aria-expanded={expanded}
                  onPointerDown={(event) => {
                    lastMenuInput.current = event.pointerType === "mouse" ? "mouse" : "touch";
                  }}
                  onKeyDown={(event) => {
                    lastMenuInput.current = "keyboard";
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setActiveMenu(index);
                      requestAnimationFrame(() => headerRef.current?.querySelector<HTMLAnchorElement>(".mega-links a")?.focus());
                    }
                  }}
                  onClick={() => {
                    if (lastMenuInput.current === "keyboard") {
                      setActiveMenu(index);
                      requestAnimationFrame(() => headerRef.current?.querySelector<HTMLAnchorElement>(".mega-links a")?.focus());
                    } else if (lastMenuInput.current === "mouse") {
                      setActiveMenu(index);
                    } else {
                      setActiveMenu((current) => current === index ? null : index);
                    }
                  }}
                >
                  <ChevronDown size={11} className={expanded ? "rotated" : ""} />
                </button>
              </div>
            );
          })}
        </nav>
        <div className="header-context" aria-hidden="true">
          <span>KOCAELİ</span>
          <i />
          <span>BAŞİSKELE · 41</span>
        </div>
        <div className="header-ctas">
          <Link
            className="t-button t-primary"
            to="/iletisim"
            aria-label="Görüşme planla: iletişim sayfasına git"
            data-ga-event="gorusme_planla_tikla"
            data-ga-category="iletisim"
            data-ga-label="Üst menü · görüşme planla"
            onClick={closeMenus}
          >
            GÖRÜŞME PLANLA
          </Link>
        </div>
        <button
          className="header-menu-toggle"
          type="button"
          aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {activeMenu !== null && (
        <div className="mega-menu" id="mega-menu">
          <div className="mega-intro">
            <span className="micro-label">{navItems[activeMenu].label}</span>
            <h2>{navItems[activeMenu].title}</h2>
            <p>{navItems[activeMenu].text}</p>
            <Link
              className="mega-intro__cta"
              to={navItems[activeMenu].overviewTo}
              onClick={() => handleSubLinkClick(navItems[activeMenu].overviewTo)}
            >
              {navItems[activeMenu].overviewLabel} <ArrowRight size={13} />
            </Link>
          </div>
          <div className="mega-links">
            {navItems[activeMenu].links.map((link, index) => (
              <Link
                key={link.label}
                to={link.to}
                aria-label={link.note ? `${link.label}: ${link.note}` : link.label}
                data-ga-event={link.to.startsWith("/projelerimiz/") ? "proje_incele_tikla" : "menu_link_tikla"}
                data-ga-category={link.to.startsWith("/projelerimiz/") ? "projeler" : "navigasyon"}
                data-ga-label={`Menü · ${link.label}`}
                onClick={() => handleSubLinkClick(link.to)}
              >
                <span>0{index + 1}</span>
                <strong>{link.label}</strong>
                {link.note && <small>{link.note}</small>}
                <ArrowUpRight size={15} />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="mobile-drawer-scroll">
          {navItems.map((item, index) => {
            const sectionOpen = mobileSection === index;
            return (
              <div className="mobile-nav-group" key={item.label}>
                <div className="mobile-nav-heading">
                  <Link
                    className="mobile-nav-main"
                    tabIndex={mobileOpen ? 0 : -1}
                    to={item.overviewTo}
                    aria-current={isActive(item) ? "page" : undefined}
                    onClick={closeMenus}
                  >
                    <span>0{index + 1}</span>
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    tabIndex={mobileOpen ? 0 : -1}
                    aria-label={`${item.label} alt menüsünü ${sectionOpen ? "kapat" : "aç"}`}
                    aria-controls={`mobile-submenu-${index}`}
                    aria-expanded={sectionOpen}
                    onClick={() => setMobileSection(sectionOpen ? null : index)}
                  >
                    <ChevronDown className={sectionOpen ? "rotated" : ""} />
                  </button>
                </div>
                <div id={`mobile-submenu-${index}`} className={`mobile-sub-links ${sectionOpen ? "open" : ""}`} aria-hidden={!sectionOpen || !mobileOpen}>
                  {item.links.map((link) => (
                    <Link
                      tabIndex={mobileOpen && sectionOpen ? 0 : -1}
                      to={link.to}
                      key={link.label}
                      aria-label={link.label}
                      data-ga-event={link.to.startsWith("/projelerimiz/") ? "proje_incele_tikla" : "menu_link_tikla"}
                      data-ga-category={link.to.startsWith("/projelerimiz/") ? "projeler" : "navigasyon"}
                      data-ga-label={`Mobil menü · ${link.label}`}
                      onClick={() => handleSubLinkClick(link.to)}
                    >
                      {link.label}
                      <ArrowUpRight size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mobile-drawer-actions">
          <Link
            className="t-button t-primary"
            tabIndex={mobileOpen ? 0 : -1}
            to="/iletisim"
            aria-label="Görüşme planla: iletişim sayfasına git"
            data-ga-event="gorusme_planla_tikla"
            data-ga-category="iletisim"
            data-ga-label="Mobil menü · görüşme planla"
            onClick={closeMenus}
          >
            GÖRÜŞME PLANLA
          </Link>
        </div>
      </div>
    </header>
  );
}
