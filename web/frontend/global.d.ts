/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOPIFY_API_KEY: string;
  readonly BACKEND_PORT: string;
  readonly FRONTEND_PORT: string;
  readonly HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Crisp chat types
type CrispCommand =
  | ["set", "user:email", [string]]
  | ["set", "user:nickname", [string]]
  | ["set", "session:data", [Array<[string, string]>]]
  | ["do", "chat:open"]
  | ["do", "chat:close"]
  | ["on", "chat:opened", () => void]
  | any[];

interface Window {
  $crisp: CrispCommand[];
  CRISP_WEBSITE_ID: string;
  userEmail?: string;
  shopify?: any;
}

declare const $crisp: CrispCommand[];
