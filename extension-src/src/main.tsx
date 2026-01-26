import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

// Ensure we have a global object to track rendered placeholders
window.TSUFFIXRendered = window.TSUFFIXRendered || {};

// Loop through all placeholders in the TSUFFIXContext and render React app for each one
for (const [elementId, contextData] of Object.entries(window.TSUFFIXContext)) {
  // Check if the placeholder has already been rendered
  if (!window.TSUFFIXRendered[elementId]) {
    const container = document.getElementById(elementId);
    if (container) {
      // Mark this placeholder as rendered
      window.TSUFFIXRendered[elementId] = true;

      createRoot(container).render(<App contextData={contextData} />);
      break;
    } else {
      console.error(`Element with ID '${elementId}' not found.`);
    }
  } else {
    // This placeholder has already been rendered, so skip it
  }
}