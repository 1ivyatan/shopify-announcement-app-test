declare module "libautech-frontend" {
  import { FC, ReactNode } from "react";

  export const ErrorPage: FC;
  export function initSentry(Sentry: any, dsn: string): void;

  // Plan components
  export const RegularPlan: FC<any>;
  export const PackagePlan: FC<any>;
  export const PackagePlanNoColor: FC<any>;
  export const UpsellPlanCard: FC<any>;
  export const CurrentPlanCard: FC<any>;

  // Footer component
  export const FooterNew: FC<any>;

  // Modal components
  export const CancelPlanModal: FC<any>;
  export const RedirectModal: FC<any>;

  // Other components
  export const Testimonials: FC<any>;
  export const BillingCycleSwitch: FC<any>;

  // Functions
  export function mantleSubscribe(...args: any[]): Promise<any>;

  // Add more as you discover what's exported
}
