// Modules
import { useCallback, useEffect, useState, Fragment } from "react";
// Shopify
import { useAppBridge } from "@shopify/app-bridge-react";
// Pages
// Stores
import useShopInfoStore from "../stores/useShopInfoStore";
import { Loader } from "../components/common/Loader";
import { BannerTone, Button, Card, Checkbox, Form, FormLayout, InlineGrid, IndexTableRowProps, IndexTableProps, Page, Text, TextField, IndexTable, useBreakpoints, useIndexResourceState } from "@shopify/polaris";
import { FooterNew } from "libautech-frontend";
import { toggleCrisp } from "../utils/miscUtils";
import { footerIcon } from "../assets";
import useAnnouncementsStore from "../stores/useAnnouncementsStore";


// Start of component
export default function Home(): React.ReactElement {
  // Core
  const shopify = useAppBridge();
  // State
  const { fetching: shopInfoFetching } = useShopInfoStore();

  const { fetchAnnouncements } = useAnnouncementsStore();


  // Effects
  useEffect(() => {
    shopify.loading(shopInfoFetching);
    fetchAnnouncements();
  }, [shopInfoFetching, shopify]);



  const isLoading: boolean = shopInfoFetching;
  const pageMarkup: React.ReactElement = isLoading ? (
    <Loader />
  ) : (
    <>
      <Page fullWidth>
        <Card>

        </Card>
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
