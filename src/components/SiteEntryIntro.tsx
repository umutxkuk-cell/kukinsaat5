import { useEffect, useState } from "react";
import { COMPANY } from "../company";
import "../entry-intro.css";

const CALIBRATION_PHASES = [
  { n: "01", label: "KEŞİF VE SAHA ANALİZİ" },
  { n: "02", label: "DÖRT DİSİPLİN UYUMU" },
  { n: "03", label: "KONTROLLÜ UYGULAMA" },
  { n: "04", label: "EKSİKSİZ TESLİM" },
];

export default function SiteEntryIntro() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    return true;
  });
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const start = performance.now();
    const duration = 1750;
    let raf = 0;
    let exitTimer = 0;
    let unmountTimer = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        exitTimer = window.setTimeout(() => {
          setExiting(true);
          unmountTimer = window.setTimeout(() => {
            setVisible(false);
          }, 1020);
        }, 160);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (exitTimer) clearTimeout(exitTimer);
      if (unmountTimer) clearTimeout(unmountTimer);
    };
  }, [visible]);

  /* Perde kapalıyken sayfa içi giriş animasyonları bekletilir (bkz. entry-intro.css);
     perde açılmaya başladığı anda işaret kaldırılır ve içerik perdeyle birlikte açılır. */
  useEffect(() => {
    if (!visible || exiting) return;
    const root = document.documentElement;
    root.dataset.kukIntro = "1";
    return () => {
      delete root.dataset.kukIntro;
    };
  }, [visible, exiting]);

  const skipIntro = () => {
    setProgress(100);
    setExiting(true);
    window.setTimeout(() => setVisible(false), 850);
  };

  if (!visible) return null;

  const activePhaseIndex = Math.min(3, Math.floor((progress / 100) * 4));

  return (
    <div
      className={`kuk-intro${exiting ? " is-exiting" : ""}`}
      role="dialog"
      aria-label="KUK İnşaat açılış sahnesi"
    >
      <div className="kuk-intro__shutter kuk-intro__shutter--top" aria-hidden="true" />
      <div className="kuk-intro__shutter kuk-intro__shutter--bottom" aria-hidden="true" />

      <div className="kuk-intro__grid" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="kuk-intro__top">
        <span className="kuk-intro__status">
          <i aria-hidden="true" />
          {COMPANY.name.toUpperCase()} // MÜHENDİSLİK VE YAPI UYGULAMALARI
        </span>
        <span>40°42&apos;N · 29°56&apos;E — BAŞİSKELE, KOCAELİ</span>
      </div>

      <div className="kuk-intro__center">
        <div className="kuk-intro__emblem-wrap" aria-hidden="true">
          <div className="kuk-intro__emblem-ring" />
          <svg className="kuk-intro__emblem" viewBox="0 0 329.28 372.5" focusable="false">
            <path
              fillRule="evenodd"
              d="M297.08 261.26 164.79 341.36 31 259.41V113.09L164.79 30.22l132.29 82.41ZM164.79 3.36 6.48 98.83v174.45l158.31 95.86 156.35-95.86V98.83Z"
            />
            <path d="M67.56 173.29 101.8 109.85V89.02L74.5 105.22l-45.35 82.42.46 49.08 24.07-38.43 49.97 83.8v-46.76Z" />
            <path d="m253.14 105.22-27.3-16.2v20.83l34.25 63.44-36.1 62.04v46.76l49.98-83.8 24.06 38.43.46-49.08Z" />
            <path d="M183.24 62.6v204.68l-18.51 12.96-18.97-12.96.93-204.68-26.38 15.31V289.5l43.96 29.17 44.42-28.24V76.98Z" />
          </svg>
        </div>

        <span className="kuk-intro__kicker">BAŞİSKELE · İZMİT · KOCAELİ</span>
        <p className="kuk-intro__brand">KUK İNŞAAT</p>
        <p className="kuk-intro__tagline">
          Mimarinin dinginliği, mühendisliğin kesinliği.
        </p>

        <div className="kuk-intro__phases" aria-hidden="true">
          {CALIBRATION_PHASES.map((phase, idx) => (
            <div
              key={phase.n}
              className={`kuk-intro__phase${idx <= activePhaseIndex ? " is-active" : ""}`}
            >
              <b>{phase.n}</b>
              <span>{phase.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="kuk-intro__bottom">
        <div className="kuk-intro__bar" aria-hidden="true">
          <div
            className="kuk-intro__bar-fill"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>

        <div className="kuk-intro__foot">
          <div className="kuk-intro__counter" aria-live="polite">
            <span>{String(progress).padStart(3, "0")}</span>
            <small>% · KALİTEYLE KURULUR</small>
          </div>

          <button type="button" className="kuk-intro__skip" onClick={skipIntro}>
            GEÇ ↗
          </button>
        </div>
      </div>
    </div>
  );
}
