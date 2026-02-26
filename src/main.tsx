import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { App } from "./App.tsx";
import PWAInstallPrompt from "./components/PWAInstallPrompt.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PWAInstallPrompt />
    <App />
  </StrictMode>
);
