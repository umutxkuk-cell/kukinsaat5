import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  applyConsent,
  OPEN_PREFS_EVENT,
  readConsent,
  saveConsent,
  type ConsentChoice,
} from "../consent";
import "../cookie.css";

const NONE: ConsentChoice = { functional: false, analytics: false, thirdParty: false };
const ALL: ConsentChoice = { functional: true, analytics: true, thirdParty: true };

const OPTIONS: { key: keyof ConsentChoice; title: string; text: string }[] = [
  {
    key: "functional",
    title: "İşlevsel / tercih çerezleri",
    text: "Site tercihlerinizin hatırlanmasını sağlar.",
  },
  {
    key: "analytics",
    title: "Performans / analiz çerezleri",
    text: "Ziyaret istatistiklerinin toplu hâlde ölçülmesi için Google Analytics kullanılır.",
  },
  {
    key: "thirdParty",
    title: "Üçüncü taraf içerik çerezleri",
    text: "Harita, görsel CDN ve sosyal medya bileşenleri tarafından kullanılabilir.",
  },
];

/* Site alt bandındaki çerez bildirimi. Reddetmek, kabul etmek kadar kolaydır;
   alt bilgideki "Çerez Tercihleri" bağlantısı aynı paneli yeniden açar. */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>(NONE);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stored = readConsent();
    applyConsent(stored);
    if (stored) {
      setChoice({ functional: stored.functional, analytics: stored.analytics, thirdParty: stored.thirdParty });
    } else {
      setVisible(true);
    }

    const reopen = () => {
      const current = readConsent();
      if (current) {
        setChoice({ functional: current.functional, analytics: current.analytics, thirdParty: current.thirdParty });
      }
      setPrefsOpen(true);
      setVisible(true);
      window.setTimeout(() => barRef.current?.focus(), 60);
    };
    window.addEventListener(OPEN_PREFS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_PREFS_EVENT, reopen);
  }, []);

  const commit = (next: ConsentChoice) => {
    saveConsent(next);
    applyConsent(next);
    setChoice(next);
    setPrefsOpen(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section className="ck-bar" aria-label="Çerez tercihleri" tabIndex={-1} ref={barRef}>
      {prefsOpen && (
        <div className="ck-prefs" id="ck-prefs">
          <div className="ck-pref">
            <div>
              <strong>Zorunlu çerezler</strong>
              <p>Oturum ve güvenlik için gereklidir; rızanıza bakılmaksızın kullanılır.</p>
            </div>
            <span className="ck-pref__fixed">Her zaman etkin</span>
          </div>

          {OPTIONS.map((option) => {
            const on = choice[option.key];
            return (
              <div className="ck-pref" key={option.key}>
                <div>
                  <strong>{option.title}</strong>
                  <p>{option.text}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={option.title}
                  className={`ck-switch${on ? " is-on" : ""}`}
                  onClick={() => setChoice((prev) => ({ ...prev, [option.key]: !prev[option.key] }))}
                >
                  <span aria-hidden="true" />
                </button>
              </div>
            );
          })}

          <div className="ck-prefs__foot">
            <button type="button" className="ck-btn ck-btn--outline" onClick={() => commit(choice)}>
              Seçimi Kaydet
            </button>
          </div>
        </div>
      )}

      <div className="ck-bar__main">
        <div className="ck-bar__copy">
          <span className="ck-bar__label">Çerez Tercihleri</span>
          <p>
            Sitenin çalışması için zorunlu çerezleri kullanıyoruz. Analiz ve üçüncü taraf çerezleri yalnızca
            onay verirseniz etkinleşir.{" "}
            <Link to="/kvkk#kvkk-07">Çerez ve KVKK metni</Link>
          </p>
        </div>

        <div className="ck-bar__actions">
          <button
            type="button"
            className="ck-btn ck-btn--ghost"
            aria-expanded={prefsOpen}
            aria-controls="ck-prefs"
            onClick={() => setPrefsOpen((open) => !open)}
          >
            {prefsOpen ? "Tercihleri Gizle" : "Tercihler"}
          </button>
          <button type="button" className="ck-btn ck-btn--outline" onClick={() => commit(NONE)}>
            Yalnızca Zorunlu
          </button>
          <button type="button" className="ck-btn ck-btn--solid" onClick={() => commit(ALL)}>
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </section>
  );
}
