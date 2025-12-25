import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import LayoutProvider from "./components/providers/provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LayoutProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LayoutProvider>
  </StrictMode>,
);
