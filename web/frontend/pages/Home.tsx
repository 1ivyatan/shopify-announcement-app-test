// Modules
import { useCallback, useEffect, useState } from "react";
// Shopify
import { useAppBridge } from "@shopify/app-bridge-react";
// Pages
// Stores
import useShopInfoStore from "../stores/useShopInfoStore";
import { Loader } from "../components/common/Loader";
import { Button, Card, Checkbox, Form, FormLayout, Page, Text } from "@shopify/polaris";
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

  /* meh */
  const [ announcement, setAnnouncement ] = useState({enabled:true,text:"Welcome!",fgColor:"#FFFFFF",bgColor:"#000000",fontSize:16});
  const [ enabledSubmit, setEnabledSubmit ] = useState<boolean>(false);

  const fetchAnnouncement = useCallback(async () => {
    const response = await fetch("/api/shop/announcement");
    const json = await response.json();
    setAnnouncement(json.data);
    setEnabledSubmit(true);
  }, []);

  // Effects
  useEffect(() => {
    shopify.loading(shopInfoFetching);
    fetchAnnouncement();
  }, [shopInfoFetching, shopify]);

  const handleSubmit = useCallback(async () => {
    if (!enabledSubmit)
      return;
    setEnabledSubmit(false);

    const response = await fetch("/api/shop/announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
       body: JSON.stringify(announcement)
    });

    if (response.ok) {
      console.log("yay!")
    } else {
      console.log(response)
    }

    setEnabledSubmit(true);

    console.log(announcement)
  }, [announcement]);

  const infoBanner = <></>;
 
  const isLoading: boolean = shopInfoFetching;
  const pageMarkup: React.ReactElement = isLoading ? (
    <Loader />
  ) : (
    <>
      <Page fullWidth>

      {infoBanner}

        <Card>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <Checkbox
                label="Enabled"
                checked={announcement.enabled}
                onChange={(newValue) => { setAnnouncement({...announcement, enabled: newValue})  }}
                helpText={
                  <span>Show or hide the announcement bar</span>
                }
              />

              <Button submit={true} variant="primary" disabled={!enabledSubmit}>Save</Button>
            </FormLayout>
          </Form>
          
          <Text variant="bodyMd" as="p">Preview:</Text>
          <ExtensionPreview contextData={{context: "preview", data: {...announcement, enabled: true}}} />
        </Card>
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
