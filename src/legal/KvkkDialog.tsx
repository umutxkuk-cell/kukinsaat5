import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { KVKK_META } from "./kvkk";
import { KvkkRegistry, KvkkSections } from "./KvkkDocument";
import "../signature/signature.css";
import "./legal.css";

/* İletişim formundan açılan aydınlatma metni penceresi.
   Sayfadan ayrılmadan okunur; böylece forma yazılanlar kaybolmaz. */
export default function KvkkDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      root.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="lg-modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="lg-modal__panel sgi-page sgi-theme-ivory lg-page"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kvkk-dialog-title"
        ref={panelRef}
      >
        <header className="lg-modal__head">
          <div>
            <span className="lg-modal__kicker">{KVKK_META.kicker}</span>
            <h2 id="kvkk-dialog-title">{KVKK_META.title}</h2>
          </div>
          <button
            type="button"
            className="lg-modal__close"
            aria-label="Aydınlatma metnini kapat"
            onClick={onClose}
            ref={closeRef}
          >
            <X size={18} />
          </button>
        </header>

        <div className="lg-modal__body" tabIndex={0}>
          <p className="lg-preamble">{KVKK_META.preamble}</p>
          <KvkkSections idPrefix="kvkk-pencere" headingLevel={3} />
          <KvkkRegistry />
        </div>

        <footer className="lg-modal__foot">
          <span>Son güncelleme {KVKK_META.updated}</span>
          <button type="button" className="lg-modal__done" onClick={onClose}>
            Kapat
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
