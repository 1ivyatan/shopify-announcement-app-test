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
export default function Home(): React.ReactElement {
  // Core
  const shopify = useAppBridge();
  // State
  const { fetching: shopInfoFetching } = useShopInfoStore();
  const { fetchAnnouncements, announcementsData } = useAnnouncementsStore();
  const [ pageNum, setPageNum ] = useState<number>(0);
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    shopify.loading(shopInfoFetching);
    fetchAnnouncements(pageNum);
  }, [shopInfoFetching, shopify]);


  const announcementsListMarkup = (
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
        hasNext: true,
        onNext: () => {},
        onPrevious: () => {}
      }}
    >
      {
          announcementsData && announcementsData.data.map(
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

                        }}
                      />
                    </ButtonGroup>
                  </IndexTable.Cell>
                </IndexTable.Row>
              );
            }
          )
      }
    </IndexTable>);

  const isLoading: boolean = shopInfoFetching;
  const pageMarkup: React.ReactElement = isLoading ? (
    <Loader />
  ) : (
    <>
      <Page fullWidth>
        <Card>
          <Button 
            variant="primary"
            onClick={() => {
              navigate("/create");
            }}
          >Create</Button>
          { announcementsListMarkup }
        </Card>
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
