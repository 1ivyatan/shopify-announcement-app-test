import { BlockStack, Text } from "@shopify/polaris";
import { t } from "i18next";
import { Testimonials } from "libautech-frontend";

export const TestimonialSection = (): React.ReactElement => {
  return (
    <BlockStack gap="400">
      <Text as="h2" variant="headingLg" fontWeight="bold">
        {t("otherMerchants")}
      </Text>
      <Testimonials stores={["baiushki", "voltage", "windup"]} />
    </BlockStack>
  );
};
