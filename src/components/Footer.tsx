import { Link, NavLink } from "react-router";
import { ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react";
import { COMPANY } from "../company";
import { openCookiePreferences } from "../consent";
import { services } from "../services";
import { Logo } from "./Header";
import "../footer.css";

/* ALT BİLGİ
   Dört kartlı yapı korunur (marka · keşfet · hizmetler · bize ulaşın); kartlar sitenin
   diğer kartlarıyla aynı dildedir: obsidyen zemin, saç teli çizgi, bronz vurgu,
   Archivo başlık + Space Mono etiket. Bağlantı satırları dokunmatik için 46px yüksekliğindedir. */

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${COMPANY.address[0]}, ${COMPANY.address[1]}`,
)}`;

const explore = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/kurumsal", label: "Kurumsal" },
  { to: "/hizmetlerimiz", label: "Hizmetlerimiz" },
  { to: "/projelerimiz", label: "Projelerimiz" },
  { to: "/iletisim", label: "İletişim" },
];

/* Slogan: son kelime vurgulu yazılır ("Kaliteyle Kurulur."). */
const sloganWords: string[] = COMPANY.slogan.split(" ");
const sloganTail = sloganWords.pop() ?? "";
const sloganHead = sloganWords.join(" ");

/* "Pazartesi–Cumartesi, 09:00–18:00": gün ve saat aralığı satır ortasından bölünmez. */
const [hoursDays, hoursTime] = COMPANY.hours.split(", ");

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <div className="ft__inner">
        <div className="ft__grid">
          {/* 1 — Marka */}
          <section className="ft-card ft-card--brand" aria-label={COMPANY.name} data-reveal>
            <Link to="/" className="ft-logo">
              <span aria-hidden="true">
                <Logo />
              </span>
              <span className="sr-only">{COMPANY.name} — ana sayfa</span>
            </Link>

            <p className="ft-slogan">
              {sloganHead} <em>{sloganTail}.</em>
            </p>
            <p className="ft-brand__text">Kocaeli merkezli inşaat ve mühendislik firması.</p>

            <dl className="ft-facts">
              <div>
                <dt>Merkez</dt>
                <dd>Başiskele, Kocaeli</dd>
              </div>
              <div>
                <dt>Faaliyet</dt>
                <dd>İnşaat · Proje · Mühendislik</dd>
              </div>
            </dl>
          </section>

          {/* 2 — Keşfet */}
          <nav className="ft-card" aria-labelledby="ft-kesfet" data-reveal>
            <h2 className="ft-label" id="ft-kesfet">
              Keşfet
            </h2>
            <ul className="ft-links">
              {explore.map((item) => (
                <li key={item.to}>
                  <NavLink end to={item.to} className="ft-link">
                    <span>{item.label}</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3 — Hizmetler */}
          <nav className="ft-card" aria-labelledby="ft-hizmetler" data-reveal>
            <h2 className="ft-label" id="ft-hizmetler">
              Hizmetler
            </h2>
            <ul className="ft-links">
              {services.map((service) => (
                <li key={service.slug}>
                  <NavLink end to={`/hizmetlerimiz/${service.slug}`} className="ft-link ft-link--n">
                    <span className="ft-link__n" aria-hidden="true">
                      {service.n}
                    </span>
                    <span>{service.title}</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* 4 — Bize ulaşın */}
          <section className="ft-card ft-card--contact" aria-labelledby="ft-iletisim" data-reveal>
            <h2 className="ft-label" id="ft-iletisim">
              Bize Ulaşın
            </h2>

            <div className="ft-direct">
              <a
                href={`tel:${COMPANY.phoneHref}`}
                data-ga-event="telefon_tikla"
                data-ga-category="iletisim"
                data-ga-label="Alt bilgi · telefon"
              >
                {COMPANY.phone}
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                data-ga-event="eposta_tikla"
                data-ga-category="iletisim"
                data-ga-label="Alt bilgi · e-posta"
              >
                {COMPANY.email}
              </a>
            </div>

            <dl className="ft-facts">
              <div>
                <dt>Saatler</dt>
                <dd>
                  <span className="ft-nowrap">{hoursDays},</span> <span className="ft-nowrap">{hoursTime}</span>
                </dd>
              </div>
              <div>
                <dt>Adres</dt>
                <dd>
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                    {COMPANY.address[0]}
                    <br />
                    {COMPANY.address[1]}
                    <span className="sr-only"> — haritada aç (yeni sekme)</span>
                  </a>
                </dd>
              </div>
            </dl>

            <Link
              className="ft-cta"
              to="/iletisim#iletisim-formu"
              data-ga-event="iletisim_sayfasi_tikla"
              data-ga-category="navigasyon"
              data-ga-label="Alt bilgi · ön görüşme formu"
              data-cursor-magnetic
            >
              <span data-magnetic-inner>
                Ön Görüşme Formu <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          </section>
        </div>

        <div className="ft__legal">
          <p>
            © {year} {COMPANY.legalName}
          </p>
          <nav aria-label="Yasal bağlantılar">
            <Link to="/kvkk">KVKK &amp; Gizlilik</Link>
            <button type="button" onClick={openCookiePreferences}>
              Çerez Tercihleri
            </button>
            <button type="button" onClick={() => window.scrollTo({ top: 0 })}>
              Başa Dön <ArrowUp size={12} aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
