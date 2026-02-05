// Modules
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Shopify
import { useAppBridge } from "@shopify/app-bridge-react";
// Pages
// Stores
import useShopInfoStore from "../stores/useShopInfoStore";
import { Loader } from "../components/common/Loader";
import { Card, Page, IndexTable, Button, Badge, ButtonGroup, Frame, Modal, Text, InlineStack } from "@shopify/polaris";
import {EditIcon, DeleteIcon} from '@shopify/polaris-icons';
import useAnnouncementsStore from "../stores/useAnnouncementsStore";
import { AnnouncementsPreview } from "../components/common/AnnouncementsPreview";


// Start of component
export default function Home(): React.ReactElement {
  // Core
  const shopify = useAppBridge();
  // State
  const { fetching: shopInfoFetching } = useShopInfoStore();
  const { fetchAnnouncements, announcementsData, deleteAnnouncement } = useAnnouncementsStore();

  const [ pageNum, setPageNum ] = useState<number>(0);
  const navigate = useNavigate();

  const [ selectedBanner, setSelectedBanner ] = useState<string>("");

  // Effects
  useEffect(() => {
    shopify.loading(shopInfoFetching);
    fetchAnnouncements(pageNum);
  }, [shopInfoFetching, shopify]);

  useEffect(() => {
    fetchAnnouncements(pageNum);
  }, [pageNum]);

  // deletion
  const [activeDeletion, setActiveDeletion] = useState(true);

  const announcementsListMarkup = (
    announcementsData ? 
    <>
    <IndexTable
      itemCount={announcementsData ? announcementsData.data.length : 0}
      headings={[
        {title: 'Label'},
        {title: 'Status'},
        {title: 'Text'},
        {title: 'Views'},
        {title: 'Last updated'},
        {title: 'Actions'},
      ]}
      selectable={false}

      pagination={{
        hasNext: announcementsData.meta.hasNext ?? false,
        hasPrevious: announcementsData.meta.hasPrev ?? false,
        onNext: () => { setPageNum(pageNum + 1) },
        onPrevious: () => { setPageNum(pageNum - 1) }
      }}
    >
      {
          announcementsData && announcementsData.data.length > 0 && announcementsData.data.map(
            (item: any, index: number) => {
              return (
                <IndexTable.Row id={item._id} key={item._id} position={index}>
                  <IndexTable.Cell>
                    {JSON.stringify(item.label ?? null)}
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <Badge
                      tone={item.enabled ? "success" : "critical"}
                    >
                      {item.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    {item.text}
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    0
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    {item.updatedAt}
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <ButtonGroup>
                      <Button 
                        icon={EditIcon}
                        accessibilityLabel="Add banner"
                        onClick={() => {
                          navigate(`/edit/${item._id}`);
                        }}
                      />
                      <Button
                        icon={DeleteIcon}
                        variant="plain"
                        tone="critical"
                        accessibilityLabel="Delete banner"
                        onClick={() => {
                          setSelectedBanner(`${item._id}`);
                        }}
                      />
                    </ButtonGroup>
                  </IndexTable.Cell>
                </IndexTable.Row>
              );
            }
          )
      }
    </IndexTable></> : <Loader />);

  const deleteModal = (
  selectedBanner.length > 0 ? 
  <Frame>
    <div style={{height: '500px'}}>
      <Modal
        open={true}
        onClose={() => {
          setSelectedBanner("");
        }}
        title="Discard all unsaved changes"
        primaryAction={{
          destructive: true,
          content: 'Delete banner',
          onAction: async () => {
            const response = await deleteAnnouncement(selectedBanner);
            if (response.ok) {
              fetchAnnouncements(pageNum);
            } else {

            }
            setSelectedBanner("");
          },
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => {
              setSelectedBanner("");
            },
          },
        ]}
      >
        <Modal.Section>
          The announcement bar will be deleted upon confirmation irrecoverably.
        </Modal.Section>
      </Modal>
    </div>
  </Frame> : <></>);

  const isLoading: boolean = shopInfoFetching;
  const pageMarkup: React.ReactElement = isLoading ? (
    <Loader />
  ) : (
    <>
      <Page fullWidth>
        <Text variant="headingLg" as="h3">
          Preview
        </Text>
        <Card>
          <AnnouncementsPreview />
        </Card>
        
        <br />


        <div style={{display: "flex", justifyContent: "space-between"}}>
          <Text variant="headingLg" as="h3">
          Banners
          </Text>

        <Button 
          variant="primary"
          onClick={() => {
            navigate("/create");
          }}
        >Create</Button>
        </div>

        

        <Card>
          { announcementsListMarkup }
        </Card>
      </Page>
      
      {deleteModal}
    </>
  );

  return <>{pageMarkup}</>;
}
