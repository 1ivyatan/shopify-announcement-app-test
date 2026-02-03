// Modules
import { useCallback, useEffect, useState } from "react";
// Shopify
import { useAppBridge } from "@shopify/app-bridge-react";
// Pages
// Stores
import useShopInfoStore from "../stores/useShopInfoStore";
import { Loader } from "../components/common/Loader";
import { BannerTone, Button, Card, Checkbox, Form, FormLayout, InlineGrid, Page, Text, TextField } from "@shopify/polaris";
import { FooterNew } from "libautech-frontend";
import { toggleCrisp } from "../utils/miscUtils";
import { footerIcon } from "../assets";

//
import { ExtensionPreview } from "../shared/index";
import { AlertMessage } from "../components/common/AlertMessage";

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
    {
      setInfoBannerTone("warning");
      setInfoBannerText("Invalid fields! WIll not submit");
      setInfoBannerActive(true);
      return;
    }
    setEnabledSubmit(false);

    const response = await fetch("/api/shop/announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
       body: JSON.stringify(announcement)
    });

    if (response.ok) {
      setInfoBannerTone("success");
      setInfoBannerText("Success!");
      setInfoBannerActive(true);
    } else {
      setInfoBannerTone("critical");
      setInfoBannerText("Server error while saving!");
      setInfoBannerActive(true);
      console.log(response)
    }

    setEnabledSubmit(true);

    console.log(announcement)
  }, [announcement]);

  const [ infoBannerText, setInfoBannerText ] = useState<string>("");
  const [ infoBannerActive, setInfoBannerActive ] = useState<boolean>(false);
  const [ infoBannerTone, setInfoBannerTone ] = useState<BannerTone>("info");
  const infoBanner = infoBannerActive ? <AlertMessage text={`${infoBannerText}`} tone={infoBannerTone} setActive={setInfoBannerActive} /> : <></>;
 
  const isLoading: boolean = shopInfoFetching;
  const pageMarkup: React.ReactElement = isLoading ? (
    <Loader />
  ) : (
    <>
      <Page fullWidth>

        <Card>

          {infoBanner}

          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <Checkbox
                label="Enabled"
                checked={announcement.enabled || false}
                onChange={(newValue) => { setAnnouncement({...announcement, enabled: newValue})  }}
                helpText={
                  <span>Show or hide the announcement bar</span>
                }
              />

              <TextField
                value={announcement.text}
                onChange={ (newValue) => { setAnnouncement({...announcement, text: newValue}); newValue.trim().length == 0 ? setEnabledSubmit(false) :  setEnabledSubmit(true)  }}
                label="Text"
                type="text"
                autoComplete="off"
                disabled={!announcement.enabled}
                helpText={
                  <span>This text will appear at the top of the store page.</span>
                }
              />

              <TextField
                value={`${announcement.fontSize || 12}`}
                onChange={(newValue) => { setAnnouncement({...announcement, fontSize: parseInt(newValue)})  }}
                label="Font size (pt)"
                type="number"
                autoComplete="off"
                min={6}
                max={48}
                disabled={!announcement.enabled}
              />


              <InlineGrid columns={2}>
                <span>
                  <Text variant="bodyMd" as="span">Text color:</Text>
                  <input 
                    type="color" 
                    value={announcement.fgColor} 
                    disabled={!announcement.enabled} 
                    onChange={(e) => { setAnnouncement({...announcement, fgColor: e.target.value}) }} 
                  />
                </span>
                <span>
                  <Text variant="bodyMd" as="span">Background color:</Text>
                  <input 
                    type="color" 
                    value={announcement.bgColor} 
                    disabled={!announcement.enabled} 
                    onChange={(e) => { setAnnouncement({...announcement, bgColor: e.target.value}) }} 
                  />
                </span>
              </InlineGrid>

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
