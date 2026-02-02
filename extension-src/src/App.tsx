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
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="TSUFFIX-tw-scope">
      Temp hello world test AGAIN
      
    </div>
  );

  /*<code>{temp}</code>
      <code>{JSON.stringify(contextData, null, 2)}</code>*/
};
