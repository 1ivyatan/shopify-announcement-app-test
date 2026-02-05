// Modules
import { useEffect, useState } from "react";
import useMainStore from "@/stores/useMainStore";
import { initPreviewUtils } from "./previews/utils";

export const App = ({ contextData }: { contextData: any }) => {
  if (window.TSUFFIXIsPreview) {
    initPreviewUtils("{amount_with_comma_separator}");
  }

  window.TSUFFIXIsPreview = false;
  // State
  const { temp } = useMainStore() as any;
  const [shouldShow, setShouldShow] = useState(false);

  //actual should show logic...
  useEffect(() => {
    setShouldShow(true);

    /* send stats */
    if (contextData.data.length > 0 /*&& contextData.context == "embed"*/) {
      const ids = contextData.data.map((banner: any) => {
        return banner._id;
      });

      console.log(ids)
      console.log(document.URL)
    }
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="TSUFFIX-tw-scope">
        { 
        contextData.data.map((banner: any) => {
          return (
            <div style={{
              width: "100%", padding: "0.5em 1em", lineHeight: "1em",display: "flex",alignItems: "center", justifyContent: "center",
              fontSize: `${banner.fontSize || 12}pt`, 
              backgroundColor: `${banner.bgColor || "#000"}`, 
              color: `${banner.fgColor || "#FFF"}`
              }}
            >
              { banner.text }
            </div>
          );
        })}
      </div>
  );
};  //contextData.enabled

/* <div style={{
        width: "100%", padding: "0.5em 1em", lineHeight: "1em",display: "flex",alignItems: "center", justifyContent: "center",
        fontSize: `${contextData.fontSize}pt`, backgroundColor: `${contextData.bgColor}`, color: `${contextData.fgColor}`
        }}>
        { contextData.text }
      </div>*/