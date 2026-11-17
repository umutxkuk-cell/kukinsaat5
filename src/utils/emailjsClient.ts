/* KUK İnşaat — Tarayıcı Uyumlu EmailJS İstemcisi
   Resmi @emailjs/browser SDK'sının (v5) birebir HTTP protokolünü uygular
   (POST https://api.emailjs.com/api/v1.0/email/send).
   Farkı: Modül yüklenirken window.localStorage erişimi yapmadığı için
   Safari/WebKit ITP, gizli sekme ve kısıtlı (sandboxed) önizleme çerçevelerinde
   SecurityError fırlatarak uygulamayı beyaz ekranda bırakmaz. */

export class EmailJSResponseStatus {
  public readonly status: number;
  public readonly text: string;

  constructor(status = 0, text = "Network Error") {
    this.status = status;
    this.text = text;
  }
}

export interface EmailJSLimitRate {
  id?: string;
  throttle?: number;
}

export interface EmailJSOptions {
  publicKey?: string;
  origin?: string;
  limitRate?: EmailJSLimitRate;
}

const DEFAULT_ORIGIN = "https://api.emailjs.com";
const LIB_VERSION = "5.0.3";

const state: {
  publicKey: string;
  origin: string;
  limitRate?: EmailJSLimitRate;
} = {
  publicKey: "",
  origin: DEFAULT_ORIGIN,
};

const throttleTimestamps = new Map<string, number>();

export function init(options: EmailJSOptions | string, origin = DEFAULT_ORIGIN): void {
  if (!options) return;
  if (typeof options === "string") {
    state.publicKey = options;
    state.origin = origin;
    return;
  }
  if (options.publicKey) state.publicKey = options.publicKey;
  if (options.origin) state.origin = options.origin;
  if (options.limitRate) state.limitRate = options.limitRate;
}

export async function send(
  serviceID: string,
  templateID: string,
  templateParams: Record<string, unknown> = {},
  options?: EmailJSOptions | string,
): Promise<EmailJSResponseStatus> {
  const normalized: EmailJSOptions =
    typeof options === "string" ? { publicKey: options } : options ?? {};

  const publicKey = normalized.publicKey || state.publicKey;
  const origin = (normalized.origin || state.origin || DEFAULT_ORIGIN).replace(/\/+$/, "");
  const limitRate = normalized.limitRate ?? state.limitRate;

  if (!publicKey) {
    throw new EmailJSResponseStatus(400, "The public key is required.");
  }
  if (!serviceID) {
    throw new EmailJSResponseStatus(400, "The service ID is required.");
  }
  if (!templateID) {
    throw new EmailJSResponseStatus(400, "The template ID is required.");
  }

  if (limitRate?.throttle && limitRate.throttle > 0) {
    const throttleKey = limitRate.id || "default";
    const lastSentAt = throttleTimestamps.get(throttleKey) ?? 0;
    const now = Date.now();
    if (now - lastSentAt < limitRate.throttle) {
      throw new EmailJSResponseStatus(429, "Too Many Requests");
    }
  }

  let response: Response;
  try {
    response = await fetch(`${origin}/api/v1.0/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lib_version: LIB_VERSION,
        user_id: publicKey,
        service_id: serviceID,
        template_id: templateID,
        template_params: templateParams,
      }),
    });
  } catch (networkError) {
    const detail = networkError instanceof Error ? networkError.message : "Network Error";
    throw new EmailJSResponseStatus(0, detail);
  }

  const responseText = await response.text().catch(() => "");
  const result = new EmailJSResponseStatus(response.status, responseText);

  if (!response.ok) {
    throw result;
  }

  // A rejected delivery should not lock the visitor out of an immediate retry.
  if (limitRate?.throttle && limitRate.throttle > 0) {
    throttleTimestamps.set(limitRate.id || "default", Date.now());
  }

  return result;
}

const emailjs = {
  init,
  send,
  EmailJSResponseStatus,
};

export default emailjs;
