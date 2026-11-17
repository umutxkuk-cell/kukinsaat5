/* Single source of truth for the company identity shown across the site.
   Phone and e-mail were supplied by the owner; the street address is the one published
   on the company's public website (kukinsaat.com). The registered title and contact hours
   are the ones stated in the company's own KVKK notice. */
export const COMPANY = {
  name: "KUK İnşaat",
  legalName: "KUK Proje Mühendislik İnşaat Ticaret Limited Şirketi",
  brand: "KUK",
  descriptor: "İNŞAAT",
  slogan: "Kaliteyle Kurulur",
  url: "https://www.kukinsaat.com",
  city: "Kocaeli",
  email: "umut@kukinsaat.com",
  phone: "+90 543 741 05 41",
  phoneHref: "+905437410541",
  address: ["Ovacık Mah. Çuhane Cad. No:176", "Başiskele, Kocaeli"],
  hours: "Pazartesi–Cumartesi, 09:00–18:00",
} as const;
