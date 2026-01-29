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
  
  const handleAnnouncementTextChange = useCallback((value: string) => setannouncementText(value), []);
  const handleAnnouncementBarOnChange = useCallback(
    (newChecked: boolean) => setAnnouncementBarOn(newChecked),
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (announcementBarOn == null) {
      console.log("no");
      return;
    }

    let reqBody = JSON.stringify({});

    if (announcementBarOn) {
      reqBody = JSON.stringify({
        enabled: announcementBarOn,
        text: announcementText
       })
    } else {
      reqBody = JSON.stringify({
        enabled: announcementBarOn
       })
    }

    const response = await fetch("/api/shop/announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
       body: reqBody
    });
    console.log(await response.json())
  }, []);

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

              
              <Text variant="bodyMd" as="p">
                Only works in embed editor :DDDD
              </Text>

              <Button submit={true} variant="primary">Save</Button>
            </FormLayout>
          </Form>
        </Card>
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
