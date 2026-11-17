import { useRef } from "react";
import HeroScene from "../components/HeroScene";
import { useSignatureMotion } from "../home/motion";
import {
  ApproachSection,
  ArchitecturalExperience,
  BrandStatement,
  CapabilitiesSection,
  ClosingExperience,
  SelectedWorks,
} from "../home/sections";
import { usePageMeta } from "../seo";

export default function HomePage() {
  usePageMeta({
    title: "KUK İnşaat | Kocaeli İnşaat Uygulaması ve Mühendislik",
    description:
      "KUK İnşaat; Kocaeli'de konut, ticari ve karma kullanımlı yapılar için inşaat uygulaması, mühendislik, teknik koordinasyon ve süreç yönetimi hizmetleri sunar.",
    path: "/",
  });

  const rootRef = useRef<HTMLDivElement>(null);
  useSignatureMotion(rootRef);

  return (
    <main>
      <HeroScene />
      <div className="sig-home" ref={rootRef}>
        <BrandStatement />
        <CapabilitiesSection />
        <ArchitecturalExperience />
        <ApproachSection />
        <SelectedWorks />
        <ClosingExperience />
      </div>
    </main>
  );
}
