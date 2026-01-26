import { AppProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import { ReactNode } from "react";

interface PolarisProviderProps {
  children: ReactNode;
}

export function PolarisProvider({ children }: PolarisProviderProps): React.ReactElement {
  return <AppProvider i18n={translations}>{children}</AppProvider>;
}
