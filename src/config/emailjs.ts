import { COMPANY } from "../company";

/* KUK İnşaat — Mevcut EmailJS Yapılandırması
   Önceki sürümde doğrulanmış olan Service ID, Template ID, Public Key ve alıcı adresi
   birebir korunmuştur. Cloudflare Pages Dashboard'da VITE_EMAILJS_* ortam değişkenleri
   tanımlandığında derleme zamanında öncelikli olarak o değerler okunur. */

const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

const readEnv = (key: string, fallback: string): string => {
  const trimmed = metaEnv[key]?.trim();
  return trimmed ? trimmed : fallback;
};

export const EMAILJS_CONFIG = {
  serviceId: readEnv("VITE_EMAILJS_SERVICE_ID", "service_vbcjk3d"),
  templateId: readEnv("VITE_EMAILJS_TEMPLATE_ID", "template_hitg8vm"),
  publicKey: readEnv("VITE_EMAILJS_PUBLIC_KEY", "245gQkDPKWRYbzMAe"),
  toEmail: readEnv("VITE_CONTACT_TO_EMAIL", COMPANY.email),
} as const;
