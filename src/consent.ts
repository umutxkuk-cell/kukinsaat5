/* Çerez rızası — tek kaynak.
   KVKK Aydınlatma Metni md.07: zorunlu çerezler rızaya bakılmaksızın kullanılır;
   performans/analiz ve üçüncü taraf çerezleri yalnızca açık rıza ile etkinleşir.
   Google Analytics bu dosya üzerinden, ancak "analytics" onayı verildiğinde yüklenir. */

export type ConsentChoice = {
  functional: boolean;
  analytics: boolean;
  thirdParty: boolean;
};

export type StoredConsent = ConsentChoice & { decidedAt: string; version: 1 };

export const CONSENT_STORAGE_KEY = "kuk_cookie_consent_v1";
export const OPEN_PREFS_EVENT = "kuk:open-cookie-preferences";
export const CONSENT_CHANGE_EVENT = "kuk:cookie-consent";

const GA_ID = "G-EFGSKFKXBM";

type ConsentWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  __kukAnalyticsAllowed?: boolean;
  [key: `ga-disable-${string}`]: boolean | undefined;
};

/* Depolama kapalıysa (gizli mod, kısıtlı çerçeve) seçim oturum boyunca bellekte tutulur. */
let memoryConsent: StoredConsent | null = null;
let gaScriptRequested = false;

export function readConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return memoryConsent;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return memoryConsent;
    const record = parsed as Record<string, unknown>;
    if (typeof record.decidedAt !== "string") return memoryConsent;
    return {
      functional: record.functional === true,
      analytics: record.analytics === true,
      thirdParty: record.thirdParty === true,
      decidedAt: record.decidedAt,
      version: 1,
    };
  } catch {
    return memoryConsent;
  }
}

export function saveConsent(choice: ConsentChoice): StoredConsent {
  const stored: StoredConsent = { ...choice, decidedAt: new Date().toISOString(), version: 1 };
  memoryConsent = stored;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Depolama erişilemiyor; seçim bu oturum için bellekte geçerli kalır.
  }
  return stored;
}

function expireAnalyticsCookies() {
  try {
    const names = document.cookie
      .split(";")
      .map((part) => part.split("=")[0]?.trim())
      .filter((name): name is string => Boolean(name) && (name === "_ga" || name.startsWith("_ga_") || name === "_gid"));
    if (names.length === 0) return;
    const host = window.location.hostname;
    const parts = host.split(".");
    const domains = ["", host];
    for (let i = 1; i < parts.length - 1; i += 1) domains.push(`.${parts.slice(i).join(".")}`);
    domains.push(`.${host}`);
    names.forEach((name) => {
      domains.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
      });
    });
  } catch {
    // Çerez erişimi kısıtlıysa yapılacak bir şey yok.
  }
}

/* Seçimi uygular: analiz onayı varsa GA'yı yükler, yoksa devre dışı bırakır. */
export function applyConsent(consent: ConsentChoice | null): void {
  const w = window as unknown as ConsentWindow;
  const allowed = consent?.analytics === true;
  w.__kukAnalyticsAllowed = allowed;
  w[`ga-disable-${GA_ID}`] = !allowed;

  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", { analytics_storage: allowed ? "granted" : "denied" });
  }

  if (allowed) {
    if (!gaScriptRequested && typeof w.gtag === "function") {
      gaScriptRequested = true;
      w.gtag("js", new Date());
      w.gtag("config", GA_ID);
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);
    }
  } else {
    expireAnalyticsCookies();
  }

  try {
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: consent }));
  } catch {
    // CustomEvent desteklenmeyen ortamlarda sessizce geçilir.
  }
}

/* Alt bilgideki "Çerez Tercihleri" bağlantısı bu olayla tercih panelini yeniden açar. */
export function openCookiePreferences(): void {
  window.dispatchEvent(new Event(OPEN_PREFS_EVENT));
}
