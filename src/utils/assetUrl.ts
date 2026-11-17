/* Harici (http/https) ve gömülü (data:/blob:) adresleri olduğu gibi döndürür;
   göreli kök yollarını (/images/...) alt dizin önizlemeleriyle uyumlu hâle getirir. */
function detectAssetPrefix(): string {
  if (typeof window === "undefined") return "";
  const { protocol, pathname } = window.location;
  if (protocol !== "http:" && protocol !== "https:") return "";
  if (pathname.endsWith("/index.html") && pathname !== "/index.html") {
    return pathname.slice(0, -"/index.html".length);
  }
  return "";
}

const ASSET_PREFIX = detectAssetPrefix();

export function assetUrl(path: string): string {
  if (
    path.startsWith("data:") ||
    path.startsWith("blob:") ||
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${ASSET_PREFIX}${normalized}`;
}
