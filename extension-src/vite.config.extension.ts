import path from "path";
import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { visualizer } from "rollup-plugin-visualizer";
import zlib from "zlib";
import crypto from "crypto";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import chalk from "chalk";

let generatedFullIdentifier: string = "";
let generatedIdentifier: string = "";
let generatedColor: string = "";

function replaceRemWithEmAndPrefix() {
  return {
    name: "replace-rem-with-em-and-prefix",
    generateBundle(_: any, bundle: any) {
      for (const fileName in bundle) {
        if (fileName.endsWith(".css")) {
          const cssAsset = bundle[fileName];
          if (cssAsset && typeof cssAsset.source === "string") {
            let cssContent = cssAsset.source;
            cssContent = cssContent.replace(/rem/g, "em");
            const markerRegex = /\.TSUFFIX-every-class-after-this\s*\{\s*content:\s*"";\s*\}/;
            const markerMatch = cssContent.match(markerRegex);

            if (markerMatch) {
              const markerIndex = cssContent.indexOf(markerMatch[0]);
              const beforeMarker = cssContent.slice(0, markerIndex + markerMatch[0].length);
              const afterMarker = cssContent.slice(markerIndex + markerMatch[0].length);
              const prefixedAfterMarker = afterMarker
                .split("\n")
                .map((line: string) => {
                  const trimmedLine = line.trimStart();
                  if (trimmedLine.startsWith(".")) {
                    return line.replace(
                      /^\s*\./,
                      (indent: string) => `${indent}TSUFFIX-tw-scope .`
                    );
                  }
                  return line;
                })
                .join("\n");
              cssAsset.source = `${beforeMarker}\n${prefixedAfterMarker}`;
            } else {
              cssAsset.source = cssContent;
            }
          }
        }
      }
    },
  };
}

function addDebugIdentifier() {
  return {
    name: "add-debug-identifier",
    generateBundle(_: any, bundle: any) {
      for (const fileName in bundle) {
        if (fileName === "index.js") {
          const jsAsset = bundle[fileName];
          if (jsAsset && jsAsset.type === "chunk") {
            const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Teal", "Pink"];
            const adjectives = [
              "Happy",
              "Brave",
              "Swift",
              "Clever",
              "Mighty",
              "Fierce",
              "Gentle",
              "Wise",
            ];
            const animals = ["Fox", "Wolf", "Eagle", "Panda", "Tiger", "Dolphin", "Owl", "Lion"];

            const color = colors[Math.floor(Math.random() * colors.length)];
            const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const animal = animals[Math.floor(Math.random() * animals.length)];

            const debugId = `console.log("%c[${color} ${adjective} ${animal}]", "color: ${color}; font-weight: bold", "TEMP Extension loaded, I test HAHAHAHHAHAHAHAHAHHAHAHAHAHHAH");`;
            generatedIdentifier = `[${color} ${adjective} ${animal}]`;
            generatedColor = color;
            generatedFullIdentifier = debugId;
            jsAsset.code = `${debugId}\n\n${jsAsset.code}`;
          }
        }
      }
    },
  };
}
function removeLicenseComments() {
  return {
    name: "remove-license-comments",
    generateBundle(_: any, bundle: any) {
      for (const fileName in bundle) {
        if (fileName === "index.js") {
          const jsAsset = bundle[fileName];
          if (jsAsset && jsAsset.type === "chunk") {
            jsAsset.code = jsAsset.code
              .replace(/\/\*[\s\S]*?@license[\s\S]*?\*\//g, "")
              .replace(/\/\*[\s\S]*?MIT[\s\S]*?\*\//g, "")
              .replace(/\/\*[\s\S]*?Copyright[\s\S]*?\*\//g, "")
              .replace(/\/\*[\s\S]*?Licensed[\s\S]*?\*\//g, "")
              .replace(/^\/\*[\s\S]*?\*\/\s*/g, "")
              .replace(/\s+/g, " ")
              .replace(/;\s*}/g, "}")
              .replace(/{\s+/g, "{")
              .replace(/}\s+/g, "}");
          }
        }
      }
    },
  };
}

function gzipAndBase64() {
  return {
    name: "gzip-base64-encode",
    writeBundle(options: any, bundle: any) {
      const jsAsset = bundle["index.js"];
      if (jsAsset && jsAsset.type === "chunk") {
        let originalCode = jsAsset.code;

        // Strip out the debug identifier line for hash calculation
        // This regex matches the entire first console.log line added by addDebugIdentifier
        const codeWithoutDebug = originalCode.replace(generatedFullIdentifier, "");

        // Generate hash from code WITHOUT the debug identifier
        const hash = crypto
          .createHash("sha256")
          .update(codeWithoutDebug)
          .digest("hex")
          .substring(0, 12);

        // Now add the hash to the debug identifier in the actual code
        originalCode = originalCode.replace(
          /(console\.log\("%c\[.*?\]",.*?"Upsell Extension loaded)("\);)/,
          `$1 - v${hash}$2`
        );

        // Update the bundle with the modified code (now includes hash in console.log)
        jsAsset.code = originalCode;

        // Original file size
        const originalSize = Buffer.from(originalCode).length;
        const originalSizeKB = (originalSize / 1024).toFixed(2);

        // Gzip compression
        const gzipped = zlib.gzipSync(Buffer.from(originalCode), { level: 9 });
        const gzippedSize = gzipped.length;
        const gzippedSizeKB = (gzippedSize / 1024).toFixed(2);

        // Base64 encoding
        const base64 = gzipped.toString("base64");
        const base64Size = Buffer.from(base64).length;
        const base64SizeKB = (base64Size / 1024).toFixed(2); // Log sizes
        console.log(chalk.cyan.bold("\n=== File Size Report ==="));
        console.log(chalk.white(`Original JS: ${chalk.yellow(originalSizeKB + " KB")}`));
        console.log(
          chalk.white(
            `Gzipped:     ${chalk.green(gzippedSizeKB + " KB")} ${chalk.dim(
              `(${((gzippedSize / originalSize) * 100).toFixed(1)}% of original)`
            )}`
          )
        );
        console.log(
          chalk.white(
            `Base64:      ${chalk.blue(base64SizeKB + " KB")} ${chalk.dim(
              `(${((base64Size / originalSize) * 100).toFixed(1)}% of original)`
            )}`
          )
        );
        console.log(chalk.cyan.bold("---"));
        console.log(chalk.white(`Version Hash: ${chalk.magenta(hash)}`));

        // Color map for chalk
        const colorMap: Record<string, any> = {
          Red: chalk.red,
          Blue: chalk.blue,
          Green: chalk.green,
          Yellow: chalk.yellow,
          Purple: chalk.magenta,
          Orange: chalk.hex("#FFA500"),
          Teal: chalk.cyan,
          Pink: chalk.hex("#FFC0CB"),
        };

        const chalkColor = colorMap[generatedColor] || chalk.white;
        console.log("Included Debug Identifier:", chalkColor.bold(generatedIdentifier));
        console.log(chalk.cyan.bold("======================\n"));

        const snippetsDir = path.resolve(process.cwd(), "../web/constants");
        if (!existsSync(snippetsDir)) {
          mkdirSync(snippetsDir, { recursive: true });
        }

        const final = `export const widgetVersion = "${hash}";
export const widgetGzipped = "${base64}";
`;
        writeFileSync(path.join(snippetsDir, "widgetGzipped.js"), final);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: false,
        global: false,
        process: false,
      },
    }),
    preact(),
    replaceRemWithEmAndPrefix(),
    addDebugIdentifier(),
    removeLicenseComments(),
    visualizer(),
    gzipAndBase64(),
  ],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    assetsDir: "",
    cssCodeSplit: true,
    cssMinify: false,
    rollupOptions: {
      input: "./src/main.tsx",
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      output: {
        entryFileNames: "index.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo?.name === "style.css" || assetInfo?.name?.endsWith(".css")) {
            return "index.css";
          }
          return assetInfo.name || "default-asset-name";
        },
        dir: "../extensions/upsell/assets",
      },
    },
    sourcemap: false,
    minify: "esbuild",
    reportCompressedSize: false,
  },
});
