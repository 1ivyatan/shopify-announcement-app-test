import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// Custom plugin to modify the CSS after a certain class and prefix all rules with .TSUFFIX-tw-scope
function replaceRemWithEmAndPrefix() {
  return {
    name: "replace-rem-with-em-and-prefix", // Name of the plugin
    generateBundle(_: any, bundle: any) {
      for (const fileName in bundle) {
        if (fileName.endsWith(".css")) {
          const cssAsset = bundle[fileName];
          if (cssAsset && typeof cssAsset.source === "string") {
            let cssContent = cssAsset.source;

            // Replace all "rem" with "em"
            cssContent = cssContent.replace(/rem/g, "em");

            // Use a regex to match the marker class, ignoring extra spaces and newlines
            const markerRegex = /\.TSUFFIX-every-class-after-this\s*\{\s*content:\s*"";\s*\}/;
            const markerMatch = cssContent.match(markerRegex);

            if (markerMatch) {
              const markerIndex = cssContent.indexOf(markerMatch[0]);
              const beforeMarker = cssContent.slice(0, markerIndex + markerMatch[0].length);
              const afterMarker = cssContent.slice(markerIndex + markerMatch[0].length);

              // Process each line and prefix lines that start with a `.`
              const prefixedAfterMarker = afterMarker
                .split("\n")
                .map((line: string) => {
                  const trimmedLine = line.trimStart();
                  // If the line starts with a `.`, prefix it with `.TSUFFIX-tw-scope `
                  if (trimmedLine.startsWith(".")) {
                    return line.replace(
                      /^\s*\./,
                      (indent: string) => `${indent}TSUFFIX-tw-scope .`
                    );
                  }
                  return line; // Return the line unmodified if it doesn't start with `.`
                })
                .join("\n");

              // Reconstruct the CSS file
              cssAsset.source = `${beforeMarker}\n${prefixedAfterMarker}`;
            } else {
              // If marker is not found, retain the original CSS
              cssAsset.source = cssContent;
            }
          }
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [nodePolyfills(), react(), replaceRemWithEmAndPrefix()], // Add the custom plugin to the plugin list
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsDir: "", // Place assets in the root directory
    cssCodeSplit: true, // Enable CSS code splitting
    outDir: "../upsell/assets", // Output directory for both CSS and JS
    rollupOptions: {
      input: "./src/main.tsx", // Entry point for Vite
      output: [
        {
          entryFileNames: "index.js", // Ensure JavaScript is named index.js
          assetFileNames: (assetInfo) => {
            // Force the CSS file to be named "index.css" instead of adding a hash
            if (assetInfo?.name === "style.css" || assetInfo?.name?.endsWith(".css")) {
              return "index.css";
            }
            return assetInfo.name || "default-asset-name"; // Ensure a string is always returned
          },
          inlineDynamicImports: true, // Required for inlining dynamic imports
          dir: "../upsell/assets", // Ensure all assets go to this directory
        },
      ],
    },
    sourcemap: false,
    minify: false, // Optional: disable minification if you prefer
  },
});
