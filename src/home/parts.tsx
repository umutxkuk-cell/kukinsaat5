import { Fragment, type CSSProperties, type ReactNode } from "react";
import { PLATES } from "../assets/plates";

export const cssVars = (vars: Record<string, string | number>) => vars as unknown as CSSProperties;

/* Ana sayfada kullanılan tüm görseller tek bir mimari monografi sanat yönetimiyle
   özel üretilmiş ve tek dosya derlemesi içinde gömülü olarak sunulmaktadır. */
export const HOME_IMAGES = {
  capability01: PLATES.courtyard,
  capability02: PLATES.concrete,
  capability03: PLATES.atrium,
  capability04: PLATES.facade,
  capability05: PLATES.materials,
  atmosphere: PLATES.experience,
  closingHorizon: PLATES.horizon,
} as const;

/* Başlık kelimelerini taban çizgisi maskesinden sırayla yükseltir. */
export function MaskedWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          <span className="sig-word">
            <span style={cssVars({ "--wi": index })}>{word}</span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

export function Eyebrow({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="sig-eyebrow">
      <span className="sig-eyebrow__index">{index}</span>
      <i aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
