// Modules
import { useEffect } from "react";
// Shopify
import { useAppBridge } from "@shopify/app-bridge-react";
// Pages
// Stores
import useShopInfoStore from "../stores/useShopInfoStore";
import { Loader } from "../components/common/Loader";
import { Page } from "@shopify/polaris";
import { FooterNew } from "libautech-frontend";
import { toggleCrisp } from "../utils/miscUtils";
import { footerIcon } from "../assets";

//
import { ExtensionPreview } from "../shared/index";

// Start of component
export default function Home(): React.ReactElement {
  // Core
  const shopify = useAppBridge();
  // State
  const { fetching: shopInfoFetching } = useShopInfoStore();

  // Effects
  useEffect(() => {
    shopify.loading(shopInfoFetching);
  }, [shopInfoFetching, shopify]);

  const isLoading: boolean = shopInfoFetching;
  const pageMarkup: React.ReactElement = isLoading ? (
    <Loader />
  ) : (
    <>
      <Page fullWidth>
        Yo gang
        <ExtensionPreview contextData={{}} />
        <FooterNew
          toggleSupportActive={toggleCrisp}
          appIcon={footerIcon}
          appName={"Smart Upsell"}
          app={"add-upsell-cross-sell"}
        />
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
