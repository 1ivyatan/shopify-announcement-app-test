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
import { AnnouncementEditor } from "../components/common/AnnouncementEditor";
import { ExtensionPreview } from "../shared/index";

// Start of component
export default function Create(): React.ReactElement {
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

  const afterSubmission = () => {
    console.log("123")
  }

  const isLoading: boolean = shopInfoFetching;
  const pageMarkup: React.ReactElement = isLoading ? (
    <Loader />
  ) : (
    <>
      <Page fullWidth>
        <Card>
          <AnnouncementEditor method={"post"} afterSubmission={afterSubmission} id={null} />
        </Card>
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
