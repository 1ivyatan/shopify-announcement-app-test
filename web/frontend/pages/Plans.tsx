import { useEffect } from "react";
import { Layout, Page } from "@shopify/polaris";
import { sendEvent } from "../helpers/eventTracker";
import { PlanSection } from "../components/common/PlanSection";
import { TestimonialSection } from "../components/common/TestimonialSection";
import useShopInfoStore from "../stores/useShopInfoStore";
import { CancelPlanModal, CurrentPlanCard, FooterNew, RedirectModal } from "libautech-frontend";
import { Loader } from "../components/common/Loader";
import { toggleCrisp } from "../utils/miscUtils";
import { footerIcon } from "../assets";

export default function Plans(): React.ReactElement {
  // State
  const { plans, plan, payingApp, isPayingApp, fetchData, fetching } = useShopInfoStore();

  // Init query
  useEffect(() => {
    sendEvent("plans_page_visit", null);
  }, []);

  return (
    <Page>
      {!fetching || (plan && plans) ? (
        <>
          <Layout>
            <Layout.Section>
              <PlanSection />
            </Layout.Section>

            <Layout.Section>
              <TestimonialSection />
            </Layout.Section>
            <Layout.Section>
              <CurrentPlanCard currPlan={plan} isPayingApp={isPayingApp} appName={payingApp} />
            </Layout.Section>
          </Layout>
          <>
            <CancelPlanModal fetchPlan={fetchData} />
            <RedirectModal appName={payingApp} />
          </>
          <FooterNew
            toggleSupportActive={toggleCrisp}
            appIcon={footerIcon}
            appName={"Smart Upsell"}
            app={"add-upsell-cross-sell"}
          />
        </>
      ) : (
        <Loader />
      )}
    </Page>
  );
}
