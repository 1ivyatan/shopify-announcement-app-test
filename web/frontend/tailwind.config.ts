import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./node_modules/libautech-frontend/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "polaris-border": "rgba(138, 138, 138, 1)",
        "polaris-border-hover": "rgba(97, 97, 97, 1)",
        "polaris-border-active": "rgba(26, 26, 26, 1)",
      },
      borderWidth: {
        polaris: "0.04125rem",
      },
    },
  },
  plugins: [],
  // This ensures Tailwind works well with Shopify Polaris
  important: true,
};

export default config;
