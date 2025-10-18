import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "@app/providers/AppProviders";
import { AppShell } from "@app/AppShell";
import "@styles/globals.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <AppShell />
    </AppProviders>
  </StrictMode>
);
