import {
  Banner,
  BlockStack,
  Box,
  Button,
  InlineStack,
  Layout,
  ProgressBar,
  Text,
} from "@shopify/polaris";
import { ExternalIcon, TargetFilledIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import useShopInfoStore from "../../stores/useShopInfoStore";

interface PlanLimits {
  orders: number;
}

interface Plan {
  name: string;
  billingCycle: string;
  limits?: PlanLimits;
}

interface Stats {
  monthlyOrders?: number;
}

interface PlanProgressBannerProps {
  plan?: string;
  plans?: Plan[];
  stats?: Stats;
  cta?: boolean;
  warningsOnly?: boolean;
}

export default function PlanProgressBanner({
  plan,
  plans,
  stats,
  cta = false,
  warningsOnly = false,
}: PlanProgressBannerProps) {
  const { billingCycle } = useShopInfoStore();
  if (!plan || !plans || !stats) {
    return null;
  }
  const navigate = useNavigate();

  const billingTypePlans = plans.filter((p) =>
    billingCycle === "yearly" ? p.billingCycle === "yearly" : p.billingCycle === "monthly"
  );

  const currentPlanInfo =
    (plans && plan && billingTypePlans.find((p) => p.name === plan.toLowerCase())) || null;

  const current = stats?.monthlyOrders || 0;
  const maxOrders = currentPlanInfo?.limits?.orders || 0;
  const percentageUsed = Math.round((current / maxOrders) * 100);

  const goPlanPage = () => {
    navigate("/plans");
  };

  // -1 means no limit
  if (maxOrders === -1 || maxOrders === 0) {
    return null;
  }

  const progressBanner = (
    <Banner icon={TargetFilledIcon} title={t("Plans.monthlyOrdersProgress")}>
      <Box paddingBlockEnd="100">
        <BlockStack gap="300">
          <Text variant="bodyLg" as="p">
            {t("Plans.ordersThisMonth", { current: current, maxOrders: maxOrders })}
          </Text>
          <ProgressBar progress={(current / maxOrders) * 100} size="small" />
        </BlockStack>
      </Box>
      <InlineStack gap="200" align="space-between">
        <Text variant="bodyMd" as="p" tone="subdued">
          {current} {current == 1 ? t("Plans.order") : t("Plans.orders")}
        </Text>
        <Text variant="bodyMd" as="p" tone="subdued">
          {t("Plans.remainingOrders", { count: maxOrders - current })}
        </Text>
      </InlineStack>
    </Banner>
  );

  const aproachingLimit = (
    <Banner icon={TargetFilledIcon} title={t("Plans.aproachingOrdersLimit")} tone="warning">
      <Box paddingBlockEnd="300">
        <BlockStack gap="300">
          <Text variant="headingMd" as="p" fontWeight="medium">
            {t("Plans.aproachingOrdersLimitMessage", { maxOrders: maxOrders })}
          </Text>
          <Text variant="bodyMd" as="p">
            {t("Plans.aproachingOrdersLimitMessage2", {
              current: current,
              currentPercentage: percentageUsed + "%",
            })}
          </Text>
          <ProgressBar progress={percentageUsed} size="small" />
        </BlockStack>
      </Box>
      <InlineStack gap="200" align="space-between" blockAlign="center">
        {cta && (
          <Button variant="primary" icon={ExternalIcon} onClick={goPlanPage}>
            {t("Plans.upgradeNow")}
          </Button>
        )}
        <Text variant="bodyMd" as="p" tone="subdued">
          {t("Plans.remainingOrders", { count: maxOrders - current })}
        </Text>
      </InlineStack>
    </Banner>
  );

  const exceededBanner = (
    <Banner title={t("Plans.ordersLimitExceeded")} tone="critical">
      <BlockStack gap="200">
        <Text variant="headingMd" as="p" fontWeight="medium">
          {t("Plans.ordersLimitExceededMessage", { maxOrders: maxOrders })}
        </Text>
        <Text variant="bodyMd" as="p">
          {t("Plans.ordersLimitExceededMessage2")}
        </Text>
        {cta && (
          <Box paddingBlockStart="100">
            <Button variant="primary" icon={ExternalIcon} onClick={goPlanPage}>
              {t("Plans.upgradeNow")}
            </Button>
          </Box>
        )}
      </BlockStack>
    </Banner>
  );

  return (
    <Layout.Section>
      {current >= maxOrders
        ? exceededBanner
        : percentageUsed >= 80 // if 90% or more of the limit is used show warning
        ? aproachingLimit
        : warningsOnly == true // if only warnings then dont show the progress bar
        ? null
        : progressBanner}
    </Layout.Section>
  );
}
