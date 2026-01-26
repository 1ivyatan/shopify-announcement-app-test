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
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    react({
      jsxRuntime: "automatic",
      jsxImportSource: "react",
    }),
    replaceRemWithEmAndPrefix(),
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    global: "globalThis",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["@radix-ui/react-checkbox", "@radix-ui/react-icons", "react-dom"],
  },
  build: {
    lib: {
      entry: "./src/exports.ts",
      formats: ["es"],
      fileName: () => "index",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        dir: "../web/frontend/shared",
        format: "es",
        entryFileNames: "index.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name].[ext]",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    sourcemap: false,
    minify: false,
  },
});
