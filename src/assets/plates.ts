import {
  PLATE_ATRIUM,
  PLATE_CONCRETE,
  PLATE_COURTYARD,
  PLATE_FACADE,
  PLATE_MATERIALS,
} from "./platesA";
import { PLATE_EXPERIENCE, PLATE_HORIZON } from "./platesB";
import { PAGE_COLONNADE } from "./pages/colonnade";
import { PAGE_COMMERCIAL } from "./pages/commercial";
import { PAGE_MIXED } from "./pages/mixed";
import { PAGE_PAVILION } from "./pages/pavilion";
import { PAGE_STRUCTURE } from "./pages/structure";
import { PAGE_STUDIO } from "./pages/studio";
import { assetUrl } from "../utils/assetUrl";

/* Ana sayfa görselleri: tek sanat yönetimiyle üretilmiş, gömülü mimari konsept plakaları. */
export const PLATES = {
  courtyard: PLATE_COURTYARD,
  concrete: PLATE_CONCRETE,
  atrium: PLATE_ATRIUM,
  facade: PLATE_FACADE,
  materials: PLATE_MATERIALS,
  experience: PLATE_EXPERIENCE,
  horizon: PLATE_HORIZON,
} as const;

/* İç sayfa görselleri: KUK İnşaat'ın özgün mimari konsept görselleri (stok fotoğraf değildir).
   Hepsi konsept görselidir; gerçek proje olarak sunulmaz.

   Varsayılan: 1280px WebP olarak gömülüdür — dosya sunulmayan tek dosya önizlemelerinde ve
   görsel dosyaları eksik olduğunda da kırılmaz.
   İsteğe bağlı üretim modu: derleme ortamında VITE_PAGE_IMAGES=local tanımlanırsa görseller
   public/images/pages/ altındaki özgün JPG dosyalarından (ayrı ve tembel yüklenen dosyalar olarak)
   okunur; gömülü kopyalar pakete girmez ve index.html yaklaşık 890 KB küçülür.
   Bu mod yalnızca yedi JPG dosyası depoda mevcutsa kullanılmalıdır. */
/* Vite bu ifadeyi derleme anında sabit değere çevirir; böylece kullanılmayan dal pakete girmez. */
const LOCAL_FILES =
  (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_PAGE_IMAGES === "local";

export const HD_PAGES = {
  corporateStudio: LOCAL_FILES ? assetUrl("/images/pages/corporate-studio-clean.jpg") : PAGE_STUDIO,
  servicesPavilion: LOCAL_FILES ? assetUrl("/images/pages/services-pavilion.jpg") : PAGE_PAVILION,
  engineeringStructure: LOCAL_FILES ? assetUrl("/images/pages/engineering-structure.jpg") : PAGE_STRUCTURE,
  contactColonnade: LOCAL_FILES ? assetUrl("/images/pages/contact-colonnade.jpg") : PAGE_COLONNADE,
  typologyCommercial: LOCAL_FILES ? assetUrl("/images/pages/typology-commercial.jpg") : PAGE_COMMERCIAL,
  typologyMixed: LOCAL_FILES ? assetUrl("/images/pages/typology-mixed.jpg") : PAGE_MIXED,
} as const;

export const HD_ALTS = {
  corporateStudio:
    "Gün ışığı alan traverten çalışma masası üzerinde mimari paftalar ve doğal taş numuneleri — mimari konsept görseli",
  servicesPavilion:
    "Altın saat ışığında dingin yansıma havuzu ve traverten konsol saçaklı çağdaş mimari pavyon — mimari konsept görseli",
  engineeringStructure:
    "Doğal yan ışık alan brüt beton ve sıcak meşe detaylı mimari galeri duvarı — mimari konsept görseli",
  contactColonnade:
    "Alacakaranlıkta sıcak aydınlatmalı kireçtaşı kolonaddan sakin ufuk çizgisine bakış — mimari konsept görseli",
  typologyCommercial:
    "Altın saat ışığında dikey traverten cephe kayıtları ve bronz doğramalı çağdaş yapı cephesi — mimari konsept görseli",
  typologyMixed:
    "Tepe ışığı alan çift kat yüksekliğinde kireçtaşı ve meşe akustik panelli çağdaş atriyum — mimari konsept görseli",
} as const;
