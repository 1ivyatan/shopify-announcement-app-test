// Modules
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Shopify
import { useAppBridge } from "@shopify/app-bridge-react";
// Pages
// Stores
import useShopInfoStore from "../stores/useShopInfoStore";
import { Loader } from "../components/common/Loader";
import { Card, Page, Text, Button, Badge, ButtonGroup } from "@shopify/polaris";
import {EditIcon, DeleteIcon} from '@shopify/polaris-icons';
import useAnnouncementsStore, { Announcement, nullAnnouncement } from "../stores/useAnnouncementsStore";
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

  const [ announcement, setAnnouncement ] = useState<Announcement>(nullAnnouncement);

  // Effects
  useEffect(() => {
    shopify.loading(shopInfoFetching);
  }, [shopInfoFetching, shopify]);

  const afterSubmission = async (response: Response) => {
    if (response.ok) {
      const json = await response.json();
      navigate(`/edit/${json.data._id}`);
    } else {

    }
  }

  const isLoading: boolean = shopInfoFetching;
  const pageMarkup: React.ReactElement = isLoading ? (
    <Loader />
  ) : (
    <>
      <Page 
        fullWidth
      >
        <Text variant="headingLg" as="h3">
          Preview
        </Text>

        <Card>
          <ExtensionPreview contextData={{context: "preview", data: announcement}} />
        </Card>

        <Text variant="headingLg" as="h3">
          Properties
        </Text>
        <Card>
          <AnnouncementEditor method={"post"} afterSubmission={afterSubmission} setData={setAnnouncement} data={announcement}/>
        </Card>
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
