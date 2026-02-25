// Modules
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Shopify
import { useAppBridge } from "@shopify/app-bridge-react";
// Pages
// Stores
import useShopInfoStore from "../stores/useShopInfoStore";
import { Loader } from "../components/common/Loader";
import { Card, Page, IndexTable, Button, Badge, ButtonGroup, Text } from "@shopify/polaris";
import { EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import useAnnouncementsStore, {
  Announcement,
  nullAnnouncement,
} from "../stores/useAnnouncementsStore";
import { ErrorPage } from "libautech-frontend";
import { ExtensionPreview } from "../shared/index";

import { AnnouncementEditor } from "../components/common/AnnouncementEditor";
import { AlertMessage, AlertMessageData } from "../components/common/AlertMessage";
import { attemptReviewModal, hasReviewed } from "../utils/reviewUtils";
import { ReviewMessage } from "../components/common/ReviewMessage";

// Start of component
export default function Edit(): React.ReactElement {
  // Core
  const shopify = useAppBridge();
  // State
  const { fetching: shopInfoFetching } = useShopInfoStore();
  const [announcement, setAnnouncement] = useState<Announcement | undefined>(undefined);
  const [valid, setValid] = useState<boolean>(false);

  const [activeMessage, setActiveMessage] = useState<boolean>(false);
  const [activeReviewMessage, setActiveReviewMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<AlertMessageData>({
    text: "",
    setActive: setActiveMessage,
    tone: "info",
  });

  const { fetchAnnouncement, putAnnouncement } = useAnnouncementsStore();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const openReviewDiag = () => {
    if (!hasReviewed() && announcement?.enabled) {
      setActiveReviewMessage(true);
      attemptReviewModal();
    }
  };

  // Effects
  useEffect(() => {
    shopify.loading(shopInfoFetching);

    if (id != null) {
      fetchAnnouncement(id).then((data: any) => {
        if (data) {
          const ann: Announcement = data.data;
          setAnnouncement(ann);
          openReviewDiag();
        } else {
          console.log("none");
        }
      });
    }
  }, [shopInfoFetching, shopify]);

  const infoBanner: React.ReactElement = activeMessage ? <AlertMessage data={message} /> : <></>;
  const reviewBanner = activeReviewMessage ? (
    <ReviewMessage setActive={setActiveReviewMessage} />
  ) : (
    <></>
  );

  const errorMarkup: React.ReactElement = <ErrorPage />;

  const isLoading: boolean = shopInfoFetching;
  const pageMarkup: React.ReactElement =
    isLoading || announcement == undefined ? (
      <Loader />
    ) : id ? (
      <>
        <Page
          fullWidth
          compactTitle
          title="Edit announcement banner"
          backAction={{
            onAction: () => {
              navigate("/");
            },
          }}
          primaryAction={
            <Button
              variant="primary"
              disabled={!valid}
              onClick={async () => {
                setValid(false);
                setActiveMessage(false);
                const response = await putAnnouncement(announcement);

                if (response.ok) {
                  setMessage({
                    ...message,
                    text: "Success!",
                    tone: "success",
                  });
                  setActiveMessage(true);
                } else {
                  const json = await response.json();
                  setMessage({
                    ...message,
                    text: `Error: ${json.error}`,
                    tone: "critical",
                  });
                  setActiveMessage(true);
                }

                setValid(true);
              }}
            >
              Save
            </Button>
          }
        >
          {activeReviewMessage ? reviewBanner : infoBanner}

          <Text variant="headingLg" as="h3">
            Preview
          </Text>

          <Card>
            <ExtensionPreview contextData={{ context: "preview", data: [announcement] }} />
          </Card>

          <br />

          <Text variant="headingLg" as="h3">
            Properties
          </Text>

          <Card>
            <AnnouncementEditor setValid={setValid} setData={setAnnouncement} data={announcement} />
          </Card>
        </Page>
      </>
    ) : (
      errorMarkup
    );

  return <>{pageMarkup}</>;
}
