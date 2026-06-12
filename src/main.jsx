import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { applyBranding } from "./config/branding";

// Inject brand colors/fonts as CSS variables + set title/meta from one place.
applyBranding();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
