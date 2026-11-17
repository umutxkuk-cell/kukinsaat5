import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "./typography.css";
import "./premium-top.css";
import "./theme-603010.css";
import "./header-layout.css";
import "./redesign.css";
import "./motion.css";
import "./cursor.css";

class RootErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[KUK App Boundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="not-found">
          <span className="micro-label">KUK İNŞAAT</span>
          <h1>Sayfa yüklenirken bir sorun oluştu.</h1>
          <p>Sayfayı yenileyerek tekrar deneyebilirsiniz.</p>
          <div className="not-found__actions">
            <button
              type="button"
              className="t-button t-primary"
              onClick={() => window.location.reload()}
            >
              SAYFAYI YENİLE
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

function mountApp() {
  const container = document.getElementById("root");
  if (!container) {
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", mountApp, { once: true });
    }
    return;
  }

  createRoot(container).render(
    <StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </StrictMode>,
  );
}

mountApp();
