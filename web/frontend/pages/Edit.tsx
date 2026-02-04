// Modules
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Shopify
import { useAppBridge } from "@shopify/app-bridge-react";
// Pages
// Stores
import useShopInfoStore from "../stores/useShopInfoStore";
import { Loader } from "../components/common/Loader";
import { Card, Page, IndexTable, Button, Badge, ButtonGroup } from "@shopify/polaris";
import {EditIcon, DeleteIcon} from '@shopify/polaris-icons';
import useAnnouncementsStore from "../stores/useAnnouncementsStore";

// Start of component
export default function Edit(): React.ReactElement {
  // Core
  const shopify = useAppBridge();
  // State
  const { fetching: shopInfoFetching } = useShopInfoStore();
  //const { fetchAnnouncements, announcementsData } = useAnnouncementsStore();
  const navigate = useNavigate();

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
        <Card>
          hahahahahahahahha
        </Card>
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
