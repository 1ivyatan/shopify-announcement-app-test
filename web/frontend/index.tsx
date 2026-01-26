import * as Sentry from "@sentry/react";
import { initSentry } from "libautech-frontend";

initSentry(
  Sentry,
  "https://b7ed7a3849e7f5248ffa2e4ec8577970@o4508081539776512.ingest.de.sentry.io/4508540533014608"
);

import App from "./App";
import { createRoot } from "react-dom/client";
import { initI18n } from "./utils/i18nUtils";
import "./styles/tailwind.css";
import { onLCP, onCLS } from "web-vitals";
import { sendEvent } from "./helpers/eventTracker";

onLCP(
  (metric) => {
    console.log("web vitals - LCP value", metric.value / 1000);
    const element = metric.entries[0].element;

    if (element.innerHTML !== "<!--v-if-->") {
      sendEvent("lcp", {
        value: metric.value / 1000,
        element: element.innerHTML,
        path: window.location.pathname,
      });
    }
  },
  { reportAllChanges: true }
);

onCLS(
  (metric) => {
    console.log("web vitals - CLS value", metric.value);
    console.log("CLS: ", metric);
  },
  { reportAllChanges: true }
);

initI18n().then(() => {
  const root = createRoot(document.getElementById("app"));
  root.render(<App />);
});
