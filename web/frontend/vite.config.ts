import { defineConfig, loadEnv } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { dirname } from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

dotenv.config();

const proxyOptions = {
  target: `http://127.0.0.1:${process.env.BACKEND_PORT}`,
  changeOrigin: false,
  secure: true,
  ws: false,
};

const host = process.env.HOST ? process.env.HOST.replace(/https?:\/\//, "") : "localhost";

let hmrConfig: any;
if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: Number(process.env.FRONTEND_PORT),
    clientPort: 443,
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (env.npm_lifecycle_event === "build" && !env.CI && !env.VITE_SHOPIFY_API_KEY) {
    console.warn(
      "\nBuilding the frontend app without an API key. The frontend build will not run without an API key. Set the VITE_SHOPIFY_API_KEY environment variable when running the build command.\n"
    );
  }

  return {
    root: dirname(fileURLToPath(import.meta.url)),
    envDir: process.cwd(),
    plugins: [
      react(),
      sentryVitePlugin({
        authToken: env.SENTRY_AUTH_TOKEN,
        org: "libautech",
        project: "upsell-frontend",
      }),
    ],
    resolve: {
      preserveSymlinks: true,
    },
    define: {
      "import.meta.env.VITE_SHOPIFY_API_KEY": JSON.stringify(env.VITE_SHOPIFY_API_KEY),
    },
    server: {
      host: "localhost",
      port: Number(env.FRONTEND_PORT),
      hmr: hmrConfig,
      proxy: {
        "^/(\\?.*)?$": proxyOptions,
        "^/api(/|(\\?.*)?$)": proxyOptions,
        "^/proxy(/|(\\?.*)?$)": proxyOptions,
        "^/public(/|(\\?.*)?$)": proxyOptions,
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules") && !id.includes("sentry")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          },
        },
      },
    },
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
  };
});
