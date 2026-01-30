// Modules
import { useCallback, useEffect, useState } from "react";
// Shopify
import { useAppBridge } from "@shopify/app-bridge-react";
// Pages
// Stores
import useShopInfoStore from "../stores/useShopInfoStore";
import { Loader } from "../components/common/Loader";
import { Button, Card, Checkbox, Form, FormLayout, Page, TextField, Text, Layout, InlineGrid } from "@shopify/polaris";

// Start of component
export default function Home(): React.ReactElement {
  // shopify
  const shopify = useAppBridge();
  const { fetching: shopInfoFetching } = useShopInfoStore();

  // form
  const [announcementText, setannouncementText] = useState<string>('');
  const [announcementBarOn, setAnnouncementBarOn] = useState<boolean>(false);
  const [fgColorHex, setFgColorHex] = useState<string>('#000000');
  const [bgColorHex, setBgColorHex] = useState<string>('#FFFFFF');
  const [fontSize, setFontSize] = useState<number>(12);
  const [enabledSubmit, setEnabledSubmit] = useState<boolean>(false);
  
  const handleAnnouncementTextChange = useCallback((value: string) => {
    setannouncementText(value)
  }, []);

  const handleFgColorHexChange = useCallback((value: string) => {
    setFgColorHex(value)
  }, []);

  const handleBgColorHexChange = useCallback((value: string) => {
    setBgColorHex(value)
  }, []);

  const handleFontSizeChange = useCallback((value: string) => {
    var num = parseInt(value);

    setFontSize(num);
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
    setFgColorHex(json.data.fgColor);
    setBgColorHex(json.data.bgColor);
    setFontSize(json.data.fontSize);
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
        text: announcementText,
        fgColor: fgColorHex,
        bgColor: bgColorHex,
        fontSize: fontSize,
       })
    });

    setEnabledSubmit(true);
    console.log(await response.json())
  }, [announcementBarOn, announcementText, fgColorHex, bgColorHex, fontSize]);

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

              <TextField
                value={`${fontSize || 12}`}
                onChange={handleFontSizeChange}
                label="Font size (pt)"
                type="number"
                autoComplete="off"
                min={6}
                max={48}
                disabled={!announcementBarOn}
              />

              <InlineGrid columns={2}>
                <span>
                  <Text variant="bodyMd" as="span">Text color:</Text>
                  <input type="color" value={fgColorHex} disabled={!announcementBarOn} onChange={(e) => handleFgColorHexChange(e.target.value)} />
                </span>
                <span>
                  <Text variant="bodyMd" as="span">Background color:</Text>
                  <input type="color" value={bgColorHex} disabled={!announcementBarOn} onChange={(e) => handleBgColorHexChange(e.target.value)} />
                </span>
              </InlineGrid>


              <Text variant="bodyMd" as="p">
                Preview:
              </Text>
              <div
                style={{
                  backgroundColor: bgColorHex,
                  color:fgColorHex,
                  padding: "0.5em 1em",
                  fontSize: `${fontSize}pt`,
                  lineHeight: "1em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                { announcementText }
              </div>

              <Button submit={true} variant="primary" disabled={( enabledSubmit && announcementText.trim().length == 0 )}>Save</Button>
            </FormLayout>
          </Form>
          
        </Card>
      </Page>
    </>
  );

  return <>{pageMarkup}</>;
}
