// Modules
import { useCallback, useEffect, useState } from "react";
// Shopify
import { useAppBridge } from "@shopify/app-bridge-react";
// Pages
// Stores
import useShopInfoStore from "../stores/useShopInfoStore";
import { Loader } from "../components/common/Loader";
import { Button, Card, Checkbox, Form, FormLayout, Page, TextField, Text } from "@shopify/polaris";

// Start of component
export default function Home(): React.ReactElement {
  // shopify
  const shopify = useAppBridge();
  const { fetching: shopInfoFetching } = useShopInfoStore();

  // form
  const [announcementText, setannouncementText] = useState<string>('');
  const [announcementBarOn, setAnnouncementBarOn] = useState<boolean>(false);
  const [enabledSubmit, setEnabledSubmit] = useState<boolean>(false);
  
  const handleAnnouncementTextChange = useCallback((value: string) => {
    setannouncementText(value)
  }, []);
  const handleAnnouncementBarOnChange = useCallback(
    (newChecked: boolean) => {
      setAnnouncementBarOn(newChecked)
    },
    [],
  );

  const fetchAnnouncement = useCallback(async () => {
    const response = await fetch("/api/shop/announcement");
    const json = await response.json();

    setAnnouncementBarOn(json.data.enabled);
    setannouncementText(json.data.text);
    setEnabledSubmit(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    setEnabledSubmit(false);

    if (announcementBarOn == null || (announcementBarOn && announcementText.trim().length == 0)) {
      setEnabledSubmit(true);
      return;
    }

    const response = await fetch("/api/shop/announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
        enabled: announcementBarOn,
        text: announcementText
       })
    });

    setEnabledSubmit(true);
    console.log(await response.json())
  }, [announcementBarOn, announcementText]);

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
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <Checkbox
                label="Enabled"
                checked={announcementBarOn}
                onChange={handleAnnouncementBarOnChange}
                helpText={
                  <span>Show or hide the announcement bar</span>
                }
              />
              
              <TextField
                value={announcementText}
                onChange={handleAnnouncementTextChange}
                label="Text"
                type="text"
                autoComplete="off"
                disabled={!announcementBarOn}
                helpText={
                  <span>This text will appear at the top of the store page.</span>
                }
              />

              <Button submit={true} variant="primary" disabled={( enabledSubmit && announcementText.trim().length == 0 )}>Save</Button>
            </FormLayout>
          </Form>
        </Card>
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
