// Modules
import { useCallback, useEffect, useState } from "react";
// Shopify
import { useAppBridge } from "@shopify/app-bridge-react";
// Pages
// Stores
import useShopInfoStore from "../stores/useShopInfoStore";
import { Loader } from "../components/common/Loader";
import { Card, Page, Text } from "@shopify/polaris";
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

  const [ announcement, setAnnouncement ] = useState({});

  const fetchAnnouncement = useCallback(async () => {
    const response = await fetch("/api/shop/announcement");
    const json = await response.json();
    setAnnouncement(json.data);
  }, []);

  // Effects
  useEffect(() => {
    shopify.loading(shopInfoFetching);
    fetchAnnouncement();
  }, [shopInfoFetching, shopify]);

  const isLoading: boolean = shopInfoFetching;
  const pageMarkup: React.ReactElement = isLoading ? (
    <Loader />
  ) : (
    <>
      <Page fullWidth>

        <Card>
          
          <Text variant="bodyMd" as="p">Preview:</Text>
          <ExtensionPreview contextData={{context: "preview", data: {...announcement, enabled: true}}} />
        </Card>
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
