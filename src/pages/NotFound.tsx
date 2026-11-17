import { Link, useLocation } from "react-router";
import { ArrowRight } from "lucide-react";
import { usePageMeta } from "../seo";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  usePageMeta({
    title: "Sayfa Bulunamadı (404) | KUK İnşaat",
    description: "Aradığınız sayfa bulunamadı. Ana sayfaya, hizmetlerimize veya iletişim sayfamıza dönebilirsiniz.",
    path: pathname || "/404",
    noindex: true,
  });

  return (
    <main className="not-found">
      <span className="micro-label">404 / SAYFA BULUNAMADI</span>
      <h1>
        Aradığınız sayfa{" "}
        <br />
        bulunamadı.
      </h1>
      <p>Bağlantı değişmiş veya kaldırılmış olabilir. Aşağıdaki sayfalardan devam edebilirsiniz.</p>
      <div className="not-found__actions">
        <Link className="t-button t-primary" to="/" aria-label="Ana sayfaya dön">
          ANA SAYFAYA DÖN <ArrowRight size={14} />
        </Link>
        <Link className="t-button t-secondary" to="/hizmetlerimiz" aria-label="Hizmetlerimiz sayfasına git">
          HİZMETLERİMİZ
        </Link>
        <Link className="t-button t-secondary" to="/kurumsal" aria-label="Kurumsal sayfasına git">
          KURUMSAL
        </Link>
        <Link className="t-button t-tertiary" to="/iletisim" aria-label="İletişim sayfasına git">
          İLETİŞİM
        </Link>
      </div>
    </main>
  );
}
