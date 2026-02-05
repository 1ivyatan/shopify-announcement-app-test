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
import { AlertMessage, AlertMessageData } from "../components/common/AlertMessage";

// Start of component
export default function Create(): React.ReactElement {
  // Core
  const shopify = useAppBridge();
  // State
  const { fetching: shopInfoFetching } = useShopInfoStore();
  //const { fetchAnnouncements, announcementsData } = useAnnouncementsStore();
  const navigate = useNavigate();

  const { postAnnouncement } = useAnnouncementsStore();
  const [ announcement, setAnnouncement ] = useState<Announcement>(nullAnnouncement);
  const [ valid, setValid ] = useState<boolean>(false);

  // Effects
  useEffect(() => {
    shopify.loading(shopInfoFetching);
  }, [shopInfoFetching, shopify]);

  const [ activeMessage, setActiveMessage ] = useState<boolean>(false);
  const [ message, setMessage ] = useState<AlertMessageData>({
    text: "",
    setActive: setActiveMessage,
    tone: "info"
  });
  const infoBanner: React.ReactElement = (
      activeMessage
          ? <AlertMessage data={message} />
          : <></>
  );

  const isLoading: boolean = shopInfoFetching;
  const pageMarkup: React.ReactElement = isLoading ? (
    <Loader />
  ) : (
    <>
      <Page 
        fullWidth
        compactTitle
        title="Create announcement banner"
        backAction={{onAction: () => {
            navigate("/");
        }}}
        primaryAction={
            <Button
                variant="primary"
                disabled={!valid}
                onClick={ async () => {
                    setValid(false);
                    setActiveMessage(false);
                    const response = await postAnnouncement(announcement);

                    if (response.ok) {
                      const json = await response.json();
                      navigate(`/edit/${json.data._id}`);
                    } else {
                        const json = await response.json();
                        setMessage({
                            ...message,
                            text: `Error: ${json.error}`,
                            tone: "critical"
                        })
                        setActiveMessage(true);
                    }
                    setValid(true);
                }}
            >
                Save
            </Button>
        }
      >
        { infoBanner }

        <Text variant="headingLg" as="h3">
          Preview
        </Text>

        <Card>
          <ExtensionPreview contextData={{context: "preview", data: [announcement]}} />
        </Card>

        <Text variant="headingLg" as="h3">
          Properties
        </Text>
        <Card>
            <AnnouncementEditor setValid={setValid} setData={setAnnouncement} data={announcement}/>
        </Card>
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
