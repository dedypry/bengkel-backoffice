import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import App from "./App.tsx";
import LayoutProvider from "./components/providers/provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import i18n from "./utils/libs/i18n.ts";
import "sweetalert2/src/sweetalert2.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LayoutProvider>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Toaster />
          <App />
        </I18nextProvider>
      </BrowserRouter>
    </LayoutProvider>
  </StrictMode>,
);
