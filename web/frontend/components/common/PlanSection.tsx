import { BlockStack, InlineGrid, InlineStack } from "@shopify/polaris";
import { BillingCycleSwitch, mantleSubscribe, UpsellPlanCard } from "libautech-frontend";
import { useState } from "react";
import useShopInfoStore from "../../stores/useShopInfoStore";
import { sendEvent } from "../../helpers/eventTracker";
import { Loader } from "./Loader";
import { useAppBridge } from "@shopify/app-bridge-react";

export const PlanSection = (): React.ReactElement => {
  const { mantleApiToken, plan, fetchData, plans, hasHadTrial, billingCycle } = useShopInfoStore();
  const [yearly, setYearly] = useState<boolean>(false);

  // const currPlan = plans && plan && plans.find((p) => p.name === plan.toLowerCase());

  const shopify = useAppBridge();

  const billingTypePlans =
    plans?.filter((p: any) =>
      yearly ? p.billingCycle === "annual" : p.billingCycle === "monthly"
    ) || [];

  const currPlan =
    (plans && plan && billingTypePlans.find((p: any) => p.name === plan.toLowerCase())) || "free";
  const starterPlan = plans && billingTypePlans.find((p: any) => p.name === "starter");
  const proPlan = plans && billingTypePlans.find((p: any) => p.name === "pro");
  const unlimitedPlan = plans && billingTypePlans.find((p: any) => p.name === "unlimited");

  const plansToMap = [starterPlan, proPlan, unlimitedPlan].filter(Boolean);

  return !plans ? (
    <Loader />
  ) : (
    <BlockStack gap="500">
      <InlineStack align="space-between" blockAlign="center">
        <BillingCycleSwitch annual={yearly} setAnnual={setYearly} />
      </InlineStack>
      <InlineGrid columns={{ sm: 1, md: 2, lg: 3, xl: 3 }} gap={"500"}>
        {plansToMap.map((plan: any) => {
          return (
            <UpsellPlanCard
              key={plan.id}
              plan={{
                ...plan,
                amount: plan.amount,
                annualPrice: yearly ? (plan.amount * 12 + 0.02).toFixed(2) : null,
              }}
              isCurrPlan={
                currPlan && currPlan.name === plan.name && billingCycle === currPlan.billingCycle
              }
              eligibleForTrial={!hasHadTrial}
              onSubscribe={async (_plan: any) => {
                if (yearly) {
                  sendEvent("upgrade_plan_click_annual", { planId: _plan.id });
                } else {
                  sendEvent("upgrade_plan_click", { planId: _plan.id });
                }
                const subscription = await mantleSubscribe(
                  {
                    planId: _plan.id,
                    returnUrl: "/",
                  },
                  mantleApiToken,
                  import.meta.env.VITE_MANTLE_APP_ID
                ).then((res) => {
                  if (res.error) {
                    console.log("data error", res.error);
                    shopify.toast.show(res.error, { isError: true });
                    return null;
                  }
                  return res;
                });

                if (subscription?.confirmationUrl) {
                  open(subscription.confirmationUrl, "_parent");
                } else if (subscription == null) {
                  console.error(
                    "Failed to get subscribtion, check both envs, frontend and backend"
                  );
                } else {
                  await fetchData();
                }
              }}
              features={plan.features}
              annual={yearly}
            />
          );
        })}
      </InlineGrid>
    </BlockStack>
  );
};
