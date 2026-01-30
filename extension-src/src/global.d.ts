// src/global.d.ts
export {};

interface ContextData {
  context: string;
  // Add other fields as needed
  data?: any;
}

interface LBTANNContext {
  [key: string]: ContextData;
}


declare global {
  interface Window {
    LBTANNIsMobile: boolean; // Declare the custom property here
    LBTANNRendered: any;
    LBTANNContext: LBTANNContext;
    LBTANNClickCheckout: () => void;
    LBTANNShopify: any;
    LBTANNFormatMoney: (cents: any, format: any) => string;
    LBTANNIsPreview: boolean;
    Shopify: any;
  }
}
