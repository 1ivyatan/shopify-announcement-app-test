import { t } from "i18next";

interface NavTabConfig {
  id: string;
  href: string;
  matchRoute: string;
  rel?: string;
  content: string;
  description: string;
  showInNavMenu: boolean;
  showInHeader: boolean;
  headerTitle: string;
  backButton: {
    show: boolean;
    path?: string;
  };
}

interface GetUnifiedNavTabsOptions {
  isPaid?: boolean;
}

/**
 * Get navigation configuration for UnifiedNavigation component
 */
export const getUnifiedNavTabs = ({
  isPaid = false,
}: GetUnifiedNavTabsOptions = {}): NavTabConfig[] => {
  return [
    {
      id: "dashboard",
      href: "/",
      matchRoute: "/dashboard",
      rel: "home",
      content: t("Navigation.dashboard"),
      description: t("deskDesc"),
      showInNavMenu: true,
      showInHeader: true,
      headerTitle: t("Navigation.dashboard"),
      backButton: { show: false },
    },
    {
      id: "plans",
      href: "/plans",
      matchRoute: "/plans",
      content: t("Navigation.plans"),
      description: t("planDesc"),
      showInNavMenu: true,
      showInHeader: true,
      headerTitle: t("Navigation.plans"),
      backButton: { show: true /*TODO: should put this to ispaid */, path: "/dashboard" },
    },
  ];
};
