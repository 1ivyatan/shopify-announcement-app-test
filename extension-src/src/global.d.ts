// src/global.d.ts
export {};

interface ContextData {
  context: string;
  // Add other fields as needed
  data?: any;
}

interface TSUFFIXContext {
  [key: string]: ContextData;
}


declare global {
  interface Window {
    TSUFFIXIsMobile: boolean; // Declare the custom property here
    TSUFFIXRendered: any;
    TSUFFIXContext: TSUFFIXContext;
    TSUFFIXClickCheckout: () => void;
    TSUFFIXShopify: any;
    TSUFFIXFormatMoney: (cents: any, format: any) => string;
    TSUFFIXIsPreview: boolean;
    Shopify: any;
  }
}
