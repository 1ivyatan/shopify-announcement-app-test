import { Banner, BannerTone, Link } from "@shopify/polaris";
import { Dispatch, SetStateAction, useState } from "react";

export const ReviewMessage = (props: {
  setActive: Dispatch<SetStateAction<boolean>>;
}): React.ReactElement | null => {
  const [active, setActive] = useState<boolean>(true);
  return active ? (
    <Banner
      tone={"success"}
      onDismiss={() => {
        props.setActive(false);
        setActive(false);
      }}
    >
      Success! <br />
      If you have a moment, we would appreciate your feedback on this app. <br />
      <Link
        //url="https://apps.shopify.com/your-app-handle#modal-show=WriteReviewModal"
        url="https://example.com"
        target="_blank"
      >
        Leave feedback on the Shopify App Store
      </Link>
    </Banner>
  ) : null;
};
